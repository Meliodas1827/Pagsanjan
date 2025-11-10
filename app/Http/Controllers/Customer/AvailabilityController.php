<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ResortBooking;
use App\Models\ResortRoom;
use App\Models\ReservationType;
// Future: HotelRoom, HotelBooking, LandingArea, RestaurantTable
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AvailabilityController extends Controller
{
    public function AvailabilityCheck(Request $request, $reservation_type, $id = null)
    {
        // Validate reservation type
        $validTypes = ['landing-area', 'resort', 'hotel', 'restaurant'];
        if (!in_array($reservation_type, $validTypes)) {
            abort(404, 'Invalid reservation type');
        }

        // Get the reservation type ID
        $reservationTypeModel = ReservationType::where('reservation_type', $reservation_type)->first();
        if (!$reservationTypeModel) {
            abort(404, 'Reservation type not found');
        }

        // Get the specific resource (resort, hotel room, etc.) if ID is provided
        $resource = $this->getResource($reservation_type, $id);

        // Get date range (current month by default, but allow month/year parameters)
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);
        
        $startDate = Carbon::create($year, $month, 1)->startOfDay();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth()->endOfDay();

        // Get bookings based on reservation type and resource
        $availabilityData = $this->getAvailabilityData($reservation_type, $resource, $reservationTypeModel->id, $startDate, $endDate);

        return Inertia::render('customer/CheckAvailability', [
            'reservationType' => $reservation_type,
            'resource' => $resource,
            'availabilityData' => $availabilityData,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }

    private function getResource($reservation_type, $id)
    {
        if (!$id) {
            return null;
        }

        switch ($reservation_type) {
            case 'resort':
                return ResortRoom::findOrFail($id);
            case 'hotel':
                // return HotelRoom::findOrFail($id); // Future implementation
                return null;
            case 'restaurant':
                // return Restaurant::findOrFail($id); // Future implementation
                return null;
            case 'landing-area':
                // return LandingArea::findOrFail($id); // Future implementation
                return null;
            default:
                return null;
        }
    }

    private function getAvailabilityData($reservation_type, $resource, $reservationTypeId, $startDate, $endDate)
    {
        switch ($reservation_type) {
            case 'resort':
                return $this->getResortAvailability($resource, $reservationTypeId, $startDate, $endDate);
            case 'hotel':
                return $this->getHotelAvailability($resource, $reservationTypeId, $startDate, $endDate);
            case 'restaurant':
                return $this->getRestaurantAvailability($resource, $reservationTypeId, $startDate, $endDate);
            case 'landing-area':
                return $this->getLandingAreaAvailability($resource, $reservationTypeId, $startDate, $endDate);
            default:
                return [];
        }
    }

    private function getResortAvailability($resortRoom, $reservationTypeId, $startDate, $endDate)
    {
        if (!$resortRoom) {
            return [];
        }

        // For resort: entire resort is booked, so check if any booking exists for the resort
        $bookings = Booking::where('reservation_type_id', $reservationTypeId)
            ->whereHas('resortBookings', function($query) use ($resortRoom) {
                $query->where('resort_room_id', $resortRoom->id);
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
            ->with('resortBookings')
            ->get();

        return $this->processResortBookings($bookings, $startDate, $endDate, $resortRoom);
    }

    private function processResortBookings($bookings, $startDate, $endDate, $resortRoom)
    {
        $availabilityData = [];
        $current = $startDate->copy();

        // Initialize all dates as available
        while ($current <= $endDate) {
            $dateKey = $current->format('Y-m-d');
            $availabilityData[$dateKey] = [
                'status' => 'available',
                'booking_count' => 0,
                'total_capacity' => 1, // Resort can only be booked once per day
                'bookings' => [],
                'resource_status' => $resortRoom->status
            ];
            $current->addDay();
        }

        // Process each booking - for resort, if there's any booking, it's fully booked
        foreach ($bookings as $booking) {
            $checkIn = Carbon::parse($booking->check_in_date);
            $checkOut = Carbon::parse($booking->check_out_date);
            
            // Mark all dates within the booking period as booked
            $current = $checkIn->copy()->startOfDay();
            while ($current < $checkOut->startOfDay()) {
                $dateKey = $current->format('Y-m-d');
                
                if (isset($availabilityData[$dateKey])) {
                    $availabilityData[$dateKey]['booking_count'] = 1;
                    $availabilityData[$dateKey]['status'] = 'fully-booked';
                    $availabilityData[$dateKey]['bookings'][] = [
                        'id' => $booking->id,
                        'reference_id' => $booking->reference_id,
                        'check_in' => $booking->check_in_date,
                        'check_out' => $booking->check_out_date,
                        'guests' => $booking->no_of_adults + $booking->no_of_children,
                        'status' => $booking->booking_status,
                        'total_price' => $booking->total_price
                    ];
                }
                
                $current->addDay();
            }
        }

        // Check if resort is under maintenance
        if ($resortRoom->status === 'maintenance') {
            foreach ($availabilityData as $dateKey => &$dayData) {
                $dayData['status'] = 'maintenance';
            }
        }

        return $availabilityData;
    }

    private function getHotelAvailability($hotelRoom, $reservationTypeId, $startDate, $endDate)
    {
        // Future implementation for hotel rooms
        // Hotels work differently - multiple rooms can be booked independently
        // This would check availability for specific hotel room
        
        /*
        if (!$hotelRoom) {
            return [];
        }

        $bookings = Booking::where('reservation_type_id', $reservationTypeId)
            ->whereHas('hotelBookings', function($query) use ($hotelRoom) {
                $query->where('hotel_room_id', $hotelRoom->id);
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
            ->with('hotelBookings')
            ->get();

        return $this->processHotelRoomBookings($bookings, $startDate, $endDate, $hotelRoom);
        */
        
        return [];
    }

    private function getRestaurantAvailability($restaurant, $reservationTypeId, $startDate, $endDate)
    {
        // Future implementation for restaurant
        // Restaurants would have time slots and table availability
        return [];
    }

    private function getLandingAreaAvailability($landingArea, $reservationTypeId, $startDate, $endDate)
    {
        // Future implementation for landing area
        // Similar to resort - entire area is booked
        return [];
    }

    // API endpoint to get available resorts for selection
    public function getAvailableResorts(Request $request)
    {
        $resorts = ResortRoom::where('status', '!=', 'maintenance')
            ->select('id', 'resort_name', 'description', 'capacity', 'price_per_day', 'pax', 'image_url', 'status', 'amenities', 'contact', 'resort_email')
            ->get();

        return response()->json($resorts);
    }

    // API endpoint to get available hotel rooms for selection  
    public function getAvailableHotelRooms(Request $request, $hotel_id)
    {
        // Future implementation
        /*
        $hotelRooms = HotelRoom::where('hotel_id', $hotel_id)
            ->where('status', '!=', 'maintenance')
            ->select('id', 'room_number', 'room_type', 'capacity', 'price_per_night', 'amenities')
            ->get();

        return response()->json($hotelRooms);
        */
        return response()->json([]);
    }
}