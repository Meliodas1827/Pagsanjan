<?php

namespace App\Http\Controllers\Resort;

use App\Http\Controllers\Controller;
use App\Models\Resort;
use App\Models\ResortImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResortImageController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get the resort for this user
        $resort = Resort::with(['images' => function($query) {
            $query->orderBy('order');
        }])->findOrFail($user->resort_id);

        return Inertia::render('resort/ResortImages', [
            'resort' => $resort,
            'images' => $resort->images,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'caption' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['boolean'],
        ]);

        // Store the image
        $path = $request->file('image')->store('resort-images', 'public');

        // If this is set as primary, unset other primary images
        if ($request->is_primary) {
            ResortImage::where('resort_id', $user->resort_id)
                ->update(['is_primary' => false]);
        }

        // Get the next order number
        $maxOrder = ResortImage::where('resort_id', $user->resort_id)->max('order') ?? 0;

        // Create the image record
        $image = ResortImage::create([
            'resort_id' => $user->resort_id,
            'image_path' => $path,
            'caption' => $validated['caption'] ?? null,
            'order' => $maxOrder + 1,
            'is_primary' => $request->is_primary ?? false,
        ]);

        return back()->with('success', 'Image uploaded successfully!');
    }

    public function update(Request $request, ResortImage $image)
    {
        $user = auth()->user();

        // Ensure the image belongs to this user's resort
        if ($image->resort_id !== $user->resort_id) {
            return back()->with('error', 'Unauthorized action');
        }

        $validated = $request->validate([
            'caption' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        // If this is set as primary, unset other primary images
        if (isset($validated['is_primary']) && $validated['is_primary']) {
            ResortImage::where('resort_id', $user->resort_id)
                ->where('id', '!=', $image->id)
                ->update(['is_primary' => false]);
        }

        $image->update($validated);

        return back()->with('success', 'Image updated successfully!');
    }

    public function destroy(ResortImage $image)
    {
        $user = auth()->user();

        // Ensure the image belongs to this user's resort
        if ($image->resort_id !== $user->resort_id) {
            return back()->with('error', 'Unauthorized action');
        }

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
        $user = auth()->user();

        $validated = $request->validate([
            'images' => ['required', 'array'],
            'images.*.id' => ['required', 'exists:resort_images,id'],
            'images.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['images'] as $imageData) {
            ResortImage::where('id', $imageData['id'])
                ->where('resort_id', $user->resort_id)
                ->update(['order' => $imageData['order']]);
        }

        return back()->with('success', 'Images reordered successfully!');
    }
}
