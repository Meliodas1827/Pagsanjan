<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandingAreaController extends Controller
{
    public function index()
    {
        $landingAreas = LandingArea::all()->map(function ($area) {
            return [
                'id' => $area->id,
                'name' => $area->name,
                'description' => $area->description,
                'location' => $area->location,
                'address' => $area->address,
                'is_active' => $area->is_active,
                'capacity' => $area->capacity,
                'image' => $area->image,
                'price' => $area->price,
            ];
        });

        return Inertia::render('admin/LandingArea', [
            'landingAreas' => $landingAreas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'capacity' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('landing-areas', 'public');
        }

        LandingArea::create($validated);

        return redirect()->back()->with('success', 'Landing area created successfully');
    }

    public function update(Request $request, LandingArea $landingArea)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'capacity' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($landingArea->image) {
                Storage::disk('public')->delete($landingArea->image);
            }
            $validated['image'] = $request->file('image')->store('landing-areas', 'public');
        }

        $landingArea->update($validated);

        return redirect()->back()->with('success', 'Landing area updated successfully');
    }

    public function destroy(LandingArea $landingArea)
    {
        // Delete image if exists
        if ($landingArea->image) {
            Storage::disk('public')->delete($landingArea->image);
        }

        $landingArea->delete();
        return redirect()->back()->with('success', 'Landing area deleted successfully');
    }
}
