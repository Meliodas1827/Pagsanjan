<?php

namespace App\Http\Controllers\customer;

use App\Http\Controllers\Controller;
use App\Models\LandingArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingAreaListController extends Controller
{
    public function index()
    {
        $landingAreas = LandingArea::where('is_active', true)
            ->get()
            ->map(function ($landingArea) {
                return [
                    'id' => $landingArea->id,
                    'name' => $landingArea->name,
                    'description' => $landingArea->description,
                    'location' => $landingArea->location,
                    'address' => $landingArea->address,
                    'capacity' => $landingArea->capacity,
                    'image' => $landingArea->image,
                    'payment_qr' => $landingArea->payment_qr,
                    'price' => $landingArea->price,
                ];
            });

        return Inertia::render('customer/AccommodationPage', [
            'landingAreas' => $landingAreas,
            'role' => auth()->check() ? auth()->user()->role_id : null
        ]);
    }
}
