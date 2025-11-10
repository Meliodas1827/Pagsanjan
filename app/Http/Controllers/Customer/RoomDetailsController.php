<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomInventory;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class RoomDetailsController extends Controller
{
    public function show(Request $request, $id)
    {
        $room = Room::with(['pricing' => function($query) {
            $query->where('is_active', true);
        }, 'features', 'images'])
            ->where('is_active', true)
            ->findOrFail($id);

        // Get the active pricing
        $activePricing = $room->pricing->where('is_active', true)->first();

        // Get similar rooms (same room type, different room)
        $similarRooms = Room::where('id', '!=', $id)
            ->where('room_type', $room->room_type)
            ->where('is_active', true)
            ->where('is_bookable', true)
            ->with(['pricing' => function($query) {
                $query->where('is_active', true);
            }])
            ->limit(3)
            ->get()
            ->map(function ($room) {
                return [
                    'id' => $room->id,
                    'room_name' => $room->room_name,
                    'room_type' => $room->room_type,
                    'main_image' => $room->main_image,
                    'max_adults' => $room->max_adults,
                    'max_children' => $room->max_children,
                    'price_per_night' => $room->pricing->where('is_active', true)->first()?->price_per_night ?? 0,
                ];
            });

        // Get availability data for the next 3 months
        $availabilityData = $this->getRoomAvailability($room, $request);

        return Inertia::render('customer/RoomDetails', [
            'room' => [
                'id' => $room->id,
                'room_name' => $room->room_name,
                'room_type' => $room->room_type,
                'promo_label' => $room->promo_label,
                'description' => $room->description,
                'location_details' => $room->location_details,
                'max_adults' => $room->max_adults,
                'max_children' => $room->max_children,
                'children_age_limit' => $room->children_age_limit,
                'room_size_sqm' => $room->room_size_sqm,
                'number_of_beds' => $room->number_of_beds,
                'bed_type' => $room->bed_type,
                'view_type' => $room->view_type,
                'bathroom_sinks' => $room->bathroom_sinks,
                'has_rain_shower' => $room->has_rain_shower,
                'has_premium_toiletries' => $room->has_premium_toiletries,
                'has_algotherm_toiletries' => $room->has_algotherm_toiletries,
                'has_tv' => $room->has_tv,
                'has_movie_channels' => $room->has_movie_channels,
                'has_wifi' => $room->has_wifi,
                'has_welcome_drink' => $room->has_welcome_drink,
                'has_bottled_water' => $room->has_bottled_water,
                'has_mini_refrigerator' => $room->has_mini_refrigerator,
                'building_name' => $room->building_name,
                'floor_number' => $room->floor_number,
                'full_address' => $room->full_address,
                'main_image' => $room->main_image,
                'image_gallery' => $room->image_gallery,
                'is_bookable' => $room->is_bookable,
                'features' => $room->features,
                'images' => $room->images,
            ],
            'pricing' => $activePricing ? [
                'price_per_night' => $activePricing->price_per_night,
                'weekend_price' => $activePricing->weekend_price,
                'holiday_price' => $activePricing->holiday_price,
                'early_bird_discount' => $activePricing->early_bird_discount,
                'early_bird_days' => $activePricing->early_bird_days,
                'extended_stay_discount' => $activePricing->extended_stay_discount,
                'extended_stay_nights' => $activePricing->extended_stay_nights,
                'extra_adult_charge' => $activePricing->extra_adult_charge,
                'extra_child_charge' => $activePricing->extra_child_charge,
                'season' => $activePricing->season,
            ] : null,
            'similarRooms' => $similarRooms,
            'availabilityData' => $availabilityData,
        ]);
    }

    private function getRoomAvailability($room, $request)
    {
        // Get date range - default to next 3 months
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $startDate = Carbon::create($year, $month, 1)->startOfDay();
        $endDate = Carbon::create($year, $month, 1)->addMonths(2)->endOfMonth()->endOfDay();

        // Get all room inventory items for this room
        $roomInventoryIds = RoomInventory::where('room_id', $room->id)
            ->where('status', 'available')
            ->pluck('id');

        $availabilityData = [];
        $current = $startDate->copy();

        // Initialize all dates as available
        while ($current <= $endDate) {
            $dateKey = $current->format('Y-m-d');
            $availabilityData[$dateKey] = [
                'status' => 'available',
                'total_rooms' => $roomInventoryIds->count(),
                'booked_rooms' => 0,
                'available_rooms' => $roomInventoryIds->count(),
            ];
            $current->addDay();
        }

        // Note: Since we don't have a direct hotel booking system yet,
        // we'll mark dates as "available" for now. When the booking system is implemented,
        // we would query bookings and mark dates accordingly.

        // Future implementation would look like this:
        /*
        $bookings = Booking::where('reservation_type_id', $hotelReservationTypeId)
            ->whereHas('hotelBookings', function($query) use ($roomInventoryIds) {
                $query->whereIn('room_inventory_id', $roomInventoryIds);
            })
            ->where('booking_status', '!=', 'cancelled')
            ->where(function($query) use ($startDate, $endDate) {
                $query->whereBetween('check_in_date', [$startDate, $endDate])
                      ->orWhereBetween('check_out_date', [$startDate, $endDate])
                      ->orWhere(function($q) use ($startDate, $endDate) {
                          $q->where('check_in_date', '<=', $startDate)
                            ->where('check_out_date', '>=', $endDate);
                      });
            })
            ->get();

        foreach ($bookings as $booking) {
            $checkIn = Carbon::parse($booking->check_in_date);
            $checkOut = Carbon::parse($booking->check_out_date);

            $current = $checkIn->copy()->startOfDay();
            while ($current < $checkOut->startOfDay()) {
                $dateKey = $current->format('Y-m-d');

                if (isset($availabilityData[$dateKey])) {
                    $availabilityData[$dateKey]['booked_rooms']++;
                    $availabilityData[$dateKey]['available_rooms']--;

                    if ($availabilityData[$dateKey]['available_rooms'] <= 0) {
                        $availabilityData[$dateKey]['status'] = 'fully-booked';
                    } elseif ($availabilityData[$dateKey]['available_rooms'] < $availabilityData[$dateKey]['total_rooms']) {
                        $availabilityData[$dateKey]['status'] = 'limited';
                    }
                }

                $current->addDay();
            }
        }
        */

        return $availabilityData;
    }
}
