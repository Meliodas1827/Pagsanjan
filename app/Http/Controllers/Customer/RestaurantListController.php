<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Resto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantListController extends Controller
{
    public function index()
    {
        $restaurants = Resto::where('deleted', 0)
            ->with(['restoTables' => function($query) {
                $query->where('deleted', 0);
            }])
            ->get()
            ->map(function ($restaurant) {
                $activeTables = $restaurant->restoTables->where('deleted', 0);

                return [
                    'id' => $restaurant->id,
                    'name' => $restaurant->resto_name,
                    'description' => null,
                    'image' => $restaurant->img,
                    'payment_qr' => $restaurant->payment_qr,
                    'deleted' => $restaurant->deleted,
                    'resto_tables' => $activeTables->values(),
                    'available_tables_count' => $activeTables->where('status', 'available')->count(),
                    'total_capacity' => $activeTables->sum('no_of_chairs'),
                ];
            });

        return Inertia::render('customer/AccommodationPage', [
            'restaurants' => $restaurants,
            'role' => auth()->check() ? auth()->user()->role_id : null
        ]);
    }
}
