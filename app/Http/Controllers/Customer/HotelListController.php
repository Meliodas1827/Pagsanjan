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
            ->get()
            ->map(function ($hotel) {
                return [
                    'id' => $hotel->id,
                    'hotel_name' => $hotel->hotel_name,
                    'location' => $hotel->location,
                    'description' => $hotel->description,
                    'image_url' => $hotel->image_url,
                ];
            });

        return Inertia::render('customer/AccommodationPage', [
            'hotels' => $hotels,
            'role' => auth()->check() ? auth()->user()->role_id : null
        ]);
    }
}
