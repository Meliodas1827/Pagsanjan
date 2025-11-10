<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelRoomType;
use App\Models\Room;
use App\Models\RoomPricing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RoomsController extends Controller
{
    public function index()
    {
        // Get only active room types for the form dropdown
        $roomTypes = HotelRoomType::where('is_active', true)->get()->map(function ($type) {
            return [
                'id' => $type->id,
                'room_type' => $type->room_type,
            ];
        });

        // Get hotels for dropdown
        $hotels = Hotel::where('isdeleted', 0)->get()->map(function ($hotel) {
            return [
                'id' => $hotel->id,
                'hotel_name' => $hotel->hotel_name,
            ];
        });

        $rooms = Room::with(['pricing'])->get()
            ->map(function (Room $room) {
                return [
                    'id' => $room->id,
                    'hotelid' => $room->hotelid,

                    // Basic Information
                    'room_name' => $room->room_name,
                    'room_type' => $room->room_type,
                    'promo_label' => $room->promo_label,

                    // Description
                    'description' => $room->description,
                    'location_details' => $room->location_details,

                    // Capacity
                    'max_adults' => $room->max_adults,
                    'max_children' => $room->max_children,
                    'children_age_limit' => $room->children_age_limit,

                    // Room Specifications
                    'room_size_sqm' => $room->room_size_sqm,
                    'number_of_beds' => $room->number_of_beds,
                    'bed_type' => $room->bed_type,
                    'view_type' => $room->view_type,

                    // Bathroom Features
                    'bathroom_sinks' => $room->bathroom_sinks,
                    'has_rain_shower' => $room->has_rain_shower,
                    'has_premium_toiletries' => $room->has_premium_toiletries,

                    // Personal Care Amenities
                    'has_algotherm_toiletries' => $room->has_algotherm_toiletries,

                    // Entertainment Amenities
                    'has_tv' => $room->has_tv,
                    'has_movie_channels' => $room->has_movie_channels,
                    'has_wifi' => $room->has_wifi,

                    // Refreshments
                    'has_welcome_drink' => $room->has_welcome_drink,
                    'has_bottled_water' => $room->has_bottled_water,
                    'has_mini_refrigerator' => $room->has_mini_refrigerator,

                    // Location
                    'building_name' => $room->building_name,
                    'floor_number' => $room->floor_number,
                    'full_address' => $room->full_address,

                    // Media
                    'main_image' => $room->main_image,
                    'image_gallery' => $room->image_gallery,

                    // Status
                    'is_active' => $room->is_active,
                    'is_bookable' => $room->is_bookable,

                    // Related data
                    'pricing' => $room->pricing,
                    'features' => $room->features,
                    'inventory' => $room->inventory,
                    'images' => $room->images,
                ];
            });

        return Inertia::render('hotel/RoomManagement', [
            'rooms' => $rooms,
            'roomTypes' => $roomTypes,
            'hotels' => $hotels,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotelid' => 'required|exists:hotels,id',
            'room_name' => 'required|string|max:100',
            'room_type' => 'nullable|string|max:50',
            'promo_label' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'location_details' => 'nullable|string',
            'max_adults' => 'required|integer|min:0|max:10',
            'max_children' => 'required|integer|min:0|max:10',
            'children_age_limit' => 'nullable|integer|min:0|max:17',
            'room_size_sqm' => 'nullable|numeric|min:0',
            'number_of_beds' => 'nullable|integer|min:0|max:10',
            'bed_type' => 'nullable|string|max:50',
            'view_type' => 'nullable|string|max:50',
            'bathroom_sinks' => 'nullable|integer|min:1|max:5',
            'has_rain_shower' => 'sometimes|boolean',
            'has_premium_toiletries' => 'sometimes|boolean',
            'has_algotherm_toiletries' => 'sometimes|boolean',
            'has_tv' => 'sometimes|boolean',
            'has_movie_channels' => 'sometimes|boolean',
            'has_wifi' => 'sometimes|boolean',
            'has_welcome_drink' => 'sometimes|boolean',
            'has_bottled_water' => 'sometimes|boolean',
            'has_mini_refrigerator' => 'sometimes|boolean',
            'building_name' => 'nullable|string|max:100',
            'floor_number' => 'nullable|integer|min:0|max:200',
            'full_address' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
            'is_bookable' => 'sometimes|boolean',
            'main_image' => 'nullable|image|max:4096',
            'price_per_night' => 'required|numeric|min:0',
        ]);

        if ($request->hasFile('main_image')) {
            $validated['main_image'] = $request->file('main_image')->store('rooms', 'public');
        }

        $room = Room::create(array_merge([
            'children_age_limit' => $validated['children_age_limit'] ?? 7,
            'is_active' => $validated['is_active'] ?? true,
            'is_bookable' => $validated['is_bookable'] ?? true,
        ], $validated));

        RoomPricing::create([
            'room_id' => $room->id,
            'season' => 'regular',
            'price_per_night' => $validated['price_per_night'],
            'currency' => 'PHP',
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Room created');
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'hotelid' => 'sometimes|required|exists:hotels,id',
            'room_name' => 'sometimes|required|string|max:100',
            'room_type' => 'nullable|string|max:50',
            'promo_label' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'location_details' => 'nullable|string',
            'max_adults' => 'nullable|integer|min:0|max:10',
            'max_children' => 'nullable|integer|min:0|max:10',
            'children_age_limit' => 'nullable|integer|min:0|max:17',
            'room_size_sqm' => 'nullable|numeric|min:0',
            'number_of_beds' => 'nullable|integer|min:0|max:10',
            'bed_type' => 'nullable|string|max:50',
            'view_type' => 'nullable|string|max:50',
            'bathroom_sinks' => 'nullable|integer|min:1|max:5',
            'has_rain_shower' => 'boolean',
            'has_premium_toiletries' => 'boolean',
            'has_algotherm_toiletries' => 'boolean',
            'has_tv' => 'boolean',
            'has_movie_channels' => 'boolean',
            'has_wifi' => 'boolean',
            'has_welcome_drink' => 'boolean',
            'has_bottled_water' => 'boolean',
            'has_mini_refrigerator' => 'boolean',
            'building_name' => 'nullable|string|max:100',
            'floor_number' => 'nullable|integer|min:0|max:200',
            'full_address' => 'nullable|string',
            'is_active' => 'boolean',
            'is_bookable' => 'boolean',
            'main_image' => 'nullable|image|max:4096',
            'price_per_night' => 'nullable|numeric|min:0',
        ]);

        if ($request->hasFile('main_image')) {
            $validated['main_image'] = $request->file('main_image')->store('rooms', 'public');
        }

        $room->update($validated);

        if (array_key_exists('price_per_night', $validated)) {
            RoomPricing::updateOrCreate(
                ['room_id' => $room->id, 'season' => 'regular'],
                ['price_per_night' => $validated['price_per_night'], 'is_active' => true, 'currency' => 'PHP']
            );
        }

        return redirect()->back()->with('success', 'Room updated');
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->back()->with('success', 'Room deleted');
    }

    public function toggleBookable(Room $room)
    {
        $room->is_bookable = !$room->is_bookable;
        $room->save();
        return redirect()->back()->with('success', $room->is_bookable ? 'Room marked as bookable' : 'Room marked as not bookable');
    }

    public function toggleActive(Room $room)
    {
        $room->is_active = !$room->is_active;
        $room->save();
        return redirect()->back()->with('success', $room->is_active ? 'Room activated' : 'Room deactivated');
    }
}
