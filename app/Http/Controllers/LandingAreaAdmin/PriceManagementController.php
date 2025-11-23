<?php

namespace App\Http\Controllers\LandingAreaAdmin;

use App\Http\Controllers\Controller;
use App\Models\LandingArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PriceManagementController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user->landing_area_id) {
            return redirect()->back()->with('error', 'You are not assigned to any landing area.');
        }

        $landingArea = LandingArea::find($user->landing_area_id);

        if (!$landingArea) {
            return redirect()->back()->with('error', 'Landing area not found.');
        }

        return Inertia::render('landing-area-admin/PriceManagement', [
            'landingArea' => [
                'id' => $landingArea->id,
                'name' => $landingArea->name,
                'price' => $landingArea->price,
                'price_per_adult' => $landingArea->price_per_adult,
                'price_per_child' => $landingArea->price_per_child,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        if (!$user->landing_area_id) {
            return redirect()->back()->with('error', 'You are not assigned to any landing area.');
        }

        $validated = $request->validate([
            'price' => 'nullable|numeric|min:0',
            'price_per_adult' => 'nullable|numeric|min:0',
            'price_per_child' => 'nullable|numeric|min:0',
        ]);

        $landingArea = LandingArea::find($user->landing_area_id);

        if (!$landingArea) {
            return redirect()->back()->with('error', 'Landing area not found.');
        }

        $landingArea->update($validated);

        return redirect()->back()->with('success', 'Prices updated successfully.');
    }
}
