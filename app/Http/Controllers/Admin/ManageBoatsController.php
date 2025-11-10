<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Boat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ManageBoatsController extends Controller
{
    public function index()
    {
        $boats = Boat::all()->map(function ($boat) {
            return [
                'id' => $boat->id,
                'boat_no' => $boat->boat_no,
                'bankero_name' => $boat->bankero_name,
                'capacity' => $boat->capacity,
                'available_slot' => $boat->available_slot,
                'price_per_adult' => $boat->price_per_adult,
                'price_per_child' => $boat->price_per_child,
                'status' => $boat->status,
                'image' => $boat->image,
            ];
        });

        return Inertia::render('admin/ManageBoats', [
            'boats' => $boats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'boat_no' => 'required|string|unique:boats,boat_no|max:255',
            'bankero_name' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'available_slot' => 'required|integer|min:0',
            'price_per_adult' => 'required|numeric|min:0',
            'price_per_child' => 'required|numeric|min:0',
            'status' => 'required|in:onride,booked,available',
            'image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('boats', 'public');
        }

        Boat::create($validated);

        return redirect()->back()->with('success', 'Boat created successfully');
    }

    public function update(Request $request, Boat $boat)
    {
        $validated = $request->validate([
            'boat_no' => 'required|string|max:255|unique:boats,boat_no,' . $boat->id,
            'bankero_name' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'available_slot' => 'required|integer|min:0',
            'price_per_adult' => 'required|numeric|min:0',
            'price_per_child' => 'required|numeric|min:0',
            'status' => 'required|in:onride,booked,available',
            'image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($boat->image) {
                Storage::disk('public')->delete($boat->image);
            }
            $validated['image'] = $request->file('image')->store('boats', 'public');
        }

        $boat->update($validated);

        return redirect()->back()->with('success', 'Boat updated successfully');
    }

    public function destroy(Boat $boat)
    {
        // Delete image if exists
        if ($boat->image) {
            Storage::disk('public')->delete($boat->image);
        }

        $boat->delete();
        return redirect()->back()->with('success', 'Boat deleted successfully');
    }
}
