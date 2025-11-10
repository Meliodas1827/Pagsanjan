<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function React\Promise\all;

class RoomManageController extends Controller
{
    public function index(Request $request)
    {
        // 1. Get the hotel owned by the authenticated user
        $hotel = Hotel::where('user_id', $request->user()->id)->first();

        if (!$hotel) {
            return Inertia::render('hotel/RoomManagement', [
                'rooms' => []
            ]);
        }
        // 2. Get the rooms for this hotel
        $rooms = HotelRoom::where('hotel_id', $hotel->id)->get();

        // 3. Return to Inertia with rooms data


        return Inertia::render('hotel/RoomManagement', [
            'rooms' => $rooms
        ]);
        //  return Inertia::render('hotel/RoomManagement');

    }


    public function store(Request $request)
    {
        // 1. Validate the request
        $validated = $request->validate([
            'room_no' => 'required|string|max:10|unique:hotel_rooms,room_no',
            'description' => 'required|string',
            'room_type' => 'required|string',
            'capacity' => 'required|integer',
            'price_per_night' => 'required|numeric',
            'status' => 'required|string|in:available,unavailable',
            'amenities' => 'nullable|string',
            'image' => 'required|image|max:2048', // max 2MB
        ]);

        // 2. Find hotel for authenticated user
        $hotel = Hotel::where('user_id', $request->user()->id)->firstOrFail();

        // 3. Handle image upload
        $imagePath = $request->file('image')->store('hotel_rooms', 'public');

        // 4. Create the hotel room
        HotelRoom::create([
            'hotel_id' => $hotel->id,
            'room_no' => $validated['room_no'],
            'description' => $validated['description'],
            'room_type' => $validated['room_type'],
            'capacity' => $validated['capacity'],
            'price_per_night' => $validated['price_per_night'],
            'status' => $validated['status'],
            'amenities' => $validated['amenities'],
            'image_url' => $imagePath, // Assuming `image_url` is used in DB
        ]);

        return redirect()->back()->with('success', 'Room created successfully.');
    }

    public function update(Request $request, HotelRoom $room)
    {
        $hotel = Hotel::where('user_id', $request->user()->id)->firstOrFail();
        if ($room->hotel_id !== $hotel->id) {
            abort(403);
        }

        $validated = $request->validate([
            'room_no' => 'required|string|max:10|unique:hotel_rooms,room_no,' . $room->id,
            'description' => 'required|string',
            'room_type' => 'required|string',
            'capacity' => 'required|integer',
            'price_per_night' => 'required|numeric',
            'status' => 'required|string|in:available,maintenance,occupied,out_of_order',
            'amenities' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('hotel_rooms', 'public');
            $validated['image_url'] = $imagePath;
        }

        $room->update($validated);

        return redirect()->back()->with('success', 'Room updated successfully.');
    }

    public function destroy(Request $request, HotelRoom $room)
    {
        $hotel = Hotel::where('user_id', $request->user()->id)->firstOrFail();
        if ($room->hotel_id !== $hotel->id) {
            abort(403);
        }

        $room->delete();

        return redirect()->back()->with('success', 'Room deleted successfully.');
    }

    public function togglePost(Request $request, HotelRoom $room)
    {
        $hotel = Hotel::where('user_id', $request->user()->id)->firstOrFail();
        if ($room->hotel_id !== $hotel->id) {
            abort(403);
        }

        $room->is_posted = !$room->is_posted;
        $room->save();

        return redirect()->back()->with('success', $room->is_posted ? 'Room posted.' : 'Room unposted.');
    }
}
