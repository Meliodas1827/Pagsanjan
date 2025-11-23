<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelListController extends Controller
{
    public function index()
    {
        $hotels = Hotel::where('isdeleted', 0)
            ->with('hotelImages')
            ->get()
            ->map(function ($hotel) {
                return [
                    'id' => $hotel->id,
                    'hotel_name' => $hotel->hotel_name,
                    'location' => $hotel->location,
                    'description' => $hotel->description,
                    'image_url' => $hotel->image_url,
                    'images' => $hotel->hotelImages->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_url' => $image->image_url,
                        ];
                    }),
                ];
            });

        return Inertia::render('customer/HotelList', [
            'hotels' => $hotels,
        ]);
    }
}
