<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Resort;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResortListController extends Controller
{
    public function index()
    {
        $resorts = Resort::where('deleted', 0)
            ->get()
            ->map(function ($resort) {
                return [
                    'id' => $resort->id,
                    'resort_name' => $resort->resort_name,
                    'img' => $resort->img,
                    'payment_qr' => $resort->payment_qr,
                    'deleted' => $resort->deleted,
                ];
            });

        return Inertia::render('customer/AccommodationPage', [
            'resorts' => $resorts,
            'role' => auth()->check() ? auth()->user()->role_id : null
        ]);
    }
}
