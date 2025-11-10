<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\HotelRoomType;
use App\Models\HotelImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RoomTypeController extends Controller
{
    public function index()
    {
        $roomTypes = HotelRoomType::all()->map(function ($roomType) {
            return [
                'id' => $roomType->id,
                'room_type' => $roomType->room_type,
                'is_active' => $roomType->is_active,
                'created_at' => $roomType->created_at,
            ];
        });

        return Inertia::render('hotel/RoomType', [
            'roomTypes' => $roomTypes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type' => 'required|string|max:255|unique:hotel_room_types,room_type',
        ]);

        HotelRoomType::create([
            'room_type' => $validated['room_type'],
        ]);

        return redirect()->back()->with('success', 'Room type created successfully');
    }

    public function update(Request $request, HotelRoomType $roomType)
    {
        $validated = $request->validate([
            'room_type' => 'required|string|max:255|unique:hotel_room_types,room_type,' . $roomType->id,
        ]);

        $roomType->update([
            'room_type' => $validated['room_type'],
        ]);

        return redirect()->back()->with('success', 'Room type updated successfully');
    }

    public function destroy(HotelRoomType $roomType)
    {
        // Toggle is_active status instead of deleting
        $roomType->is_active = !$roomType->is_active;
        $roomType->save();

        $message = $roomType->is_active ? 'Room type activated successfully' : 'Room type deactivated successfully';
        return redirect()->back()->with('success', $message);
    }
}
