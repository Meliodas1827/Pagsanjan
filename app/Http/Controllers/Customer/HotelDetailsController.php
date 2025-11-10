<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\Room;
use Inertia\Inertia;

class HotelDetailsController extends Controller
{
    public function show($id)
    {
        $hotel = Hotel::with('hotelImages')->findOrFail($id);

        $rooms = Room::where('hotelid', $id)
            ->where('is_active', 1)
            ->with('currentPrice')
            ->get()
            ->map(function ($room) {
                $capacity = ($room->max_adults ?? 0) + ($room->max_children ?? 0);
                $price = $room->currentPrice ? $room->currentPrice->price_per_night : 0;

                return [
                    'id' => $room->id,
                    'room_name' => $room->room_name,
                    'room_type' => $room->room_type,
                    'capacity' => $capacity,
                    'price_per_night' => $price,
                    'description' => $room->description,
                    'amenities' => $this->getAmenities($room),
                    'image_url' => $room->main_image ? '/storage/' . $room->main_image : null,
                    'is_bookable' => $room->is_bookable,
                ];
            });

        return Inertia::render('landing-page/HotelDetails', [
            'hotel' => [
                'id' => $hotel->id,
                'hotel_name' => $hotel->hotel_name,
                'location' => $hotel->location,
                'description' => $hotel->description,
                'image_url' => $hotel->image_url,
                'hotel_images' => $hotel->hotelImages->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_url' => $image->image_url,
                    ];
                }),
            ],
            'rooms' => $rooms,
        ]);
    }

    private function getAmenities($room)
    {
        $amenities = [];

        if ($room->has_wifi) $amenities[] = 'WiFi';
        if ($room->has_tv) $amenities[] = 'TV';
        if ($room->has_mini_refrigerator) $amenities[] = 'Mini Fridge';
        if ($room->has_welcome_drink) $amenities[] = 'Welcome Drink';
        if ($room->has_rain_shower) $amenities[] = 'Rain Shower';

        return implode(', ', $amenities);
    }
}
