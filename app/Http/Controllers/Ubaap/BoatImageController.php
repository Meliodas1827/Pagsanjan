<?php

namespace App\Http\Controllers\Ubaap;

use App\Http\Controllers\Controller;
use App\Models\Boat;
use App\Models\BoatImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BoatImageController extends Controller
{
    public function index()
    {
        // Get all boats for UBAAP admin
        $boats = Boat::with(['images' => function($query) {
            $query->orderBy('order');
        }])->get();

        return Inertia::render('ubaap/BoatImages', [
            'boats' => $boats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'boat_id' => ['required', 'exists:boats,id'],
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'caption' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['boolean'],
        ]);

        // Store the image
        $path = $request->file('image')->store('boat-images', 'public');

        // If this is set as primary, unset other primary images for this boat
        if ($request->is_primary) {
            BoatImage::where('boat_id', $validated['boat_id'])
                ->update(['is_primary' => false]);
        }

        // Get the next order number for this boat
        $maxOrder = BoatImage::where('boat_id', $validated['boat_id'])->max('order') ?? 0;

        // Create the image record
        $image = BoatImage::create([
            'boat_id' => $validated['boat_id'],
            'image_path' => $path,
            'caption' => $validated['caption'] ?? null,
            'order' => $maxOrder + 1,
            'is_primary' => $request->is_primary ?? false,
        ]);

        return back()->with('success', 'Image uploaded successfully!');
    }

    public function update(Request $request, BoatImage $image)
    {
        $validated = $request->validate([
            'caption' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        // If this is set as primary, unset other primary images for this boat
        if (isset($validated['is_primary']) && $validated['is_primary']) {
            BoatImage::where('boat_id', $image->boat_id)
                ->where('id', '!=', $image->id)
                ->update(['is_primary' => false]);
        }

        $image->update($validated);

        return back()->with('success', 'Image updated successfully!');
    }

    public function destroy(BoatImage $image)
    {
        // Delete the image file
        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        // Delete the database record
        $image->delete();

        return back()->with('success', 'Image deleted successfully!');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'images' => ['required', 'array'],
            'images.*.id' => ['required', 'exists:boat_images,id'],
            'images.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['images'] as $imageData) {
            BoatImage::where('id', $imageData['id'])
                ->update(['order' => $imageData['order']]);
        }

        return back()->with('success', 'Images reordered successfully!');
    }
}
