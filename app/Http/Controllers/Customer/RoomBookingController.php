<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Boat;
use App\Models\Hotel;
use Inertia\Inertia;

class RoomBookingController extends Controller
{
    public function show($id)
    {
        $room = Room::with('currentPrice')->findOrFail($id);

        $capacity = ($room->max_adults ?? 0) + ($room->max_children ?? 0);
        $price = $room->currentPrice ? $room->currentPrice->price_per_night : 0;

        // Get amenities list
        $amenities = $this->getAmenities($room);

        // Get image gallery
        $imageGallery = $room->image_gallery ?? [];
        if ($room->main_image) {
            array_unshift($imageGallery, $room->main_image);
        }

        // Get hotel's QR code
        $hotel = Hotel::find($room->hotelid);

        // Get booked dates for this room
        $bookedDates = \App\Models\Booking::where('roomid', $id)
            ->whereIn('booking_status', ['pending', 'confirmed', 'accepted'])
            ->where('check_out_date', '>=', now())
            ->get()
            ->map(function ($booking) {
                return [
                    'check_in' => \Carbon\Carbon::parse($booking->check_in_date)->format('Y-m-d'),
                    'check_out' => \Carbon\Carbon::parse($booking->check_out_date)->format('Y-m-d'),
                ];
            })
            ->toArray();

        return Inertia::render('customer/RoomBooking', [
            'room' => [
                'id' => $room->id,
                'hotelid' => $room->hotelid,
                'room_name' => $room->room_name,
                'room_type' => $room->room_type,
                'description' => $room->description,
                'capacity' => $capacity,
                'max_adults' => $room->max_adults,
                'max_children' => $room->max_children,
                'price_per_night' => $price,
                'amenities' => $amenities,
                'room_size_sqm' => $room->room_size_sqm,
                'number_of_beds' => $room->number_of_beds,
                'bed_type' => $room->bed_type,
                'view_type' => $room->view_type,
                'main_image' => $room->main_image ? '/storage/' . $room->main_image : null,
                'image_gallery' => array_map(function ($img) {
                    return is_string($img) ? '/storage/' . $img : $img;
                }, $imageGallery),
            ],
            'hotelQrCode' => $hotel ? $hotel->qrcode_image_payment : null,
            'bookedDates' => $bookedDates,
        ]);
    }

    public function getBoatAvailability($hotelId, $date)
    {
        // Get all boats for this hotel
        $boats = Boat::where('status', 'available')->where('hotelid', $hotelId)->get();

        $availability = [];

        foreach ($boats as $boat) {
            // Get total reserved seats for this boat on this date
            $reservedSeats = \App\Models\BoatBooking::where('boat_id', $boat->id)
                ->where('date_of_booking', $date)
                ->whereIn('status', ['pending', 'confirmed', 'accepted'])
                ->sum(\DB::raw('no_of_adults + no_of_children'));

            $availability[$boat->id] = [
                'capacity' => $boat->capacity,
                'reserved' => $reservedSeats,
                'available' => max(0, $boat->capacity - $reservedSeats),
            ];
        }

        return response()->json($availability);
    }

    private function getAmenities($room)
    {
        $amenities = [];

        if ($room->has_wifi) $amenities[] = ['name' => 'WiFi', 'available' => true];
        if ($room->has_tv) $amenities[] = ['name' => 'TV', 'available' => true];
        if ($room->has_movie_channels) $amenities[] = ['name' => 'Movie Channels', 'available' => true];
        if ($room->has_mini_refrigerator) $amenities[] = ['name' => 'Mini Refrigerator', 'available' => true];
        if ($room->has_welcome_drink) $amenities[] = ['name' => 'Welcome Drink', 'available' => true];
        if ($room->has_bottled_water) $amenities[] = ['name' => 'Bottled Water', 'available' => true];
        if ($room->has_rain_shower) $amenities[] = ['name' => 'Rain Shower', 'available' => true];
        if ($room->has_premium_toiletries) $amenities[] = ['name' => 'Premium Toiletries', 'available' => true];
        if ($room->has_algotherm_toiletries) $amenities[] = ['name' => 'Algotherm Toiletries', 'available' => true];

        return $amenities;
    }
}
