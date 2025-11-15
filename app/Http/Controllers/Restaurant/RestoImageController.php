<?php

namespace App\Http\Controllers\Restaurant;

use App\Http\Controllers\Controller;
use App\Models\Resto;
use App\Models\RestoImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RestoImageController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get the restaurant for this user
        $resto = Resto::with(['images' => function($query) {
            $query->orderBy('order');
        }])->findOrFail($user->restoid);

        return Inertia::render('restaurant/RestoImages', [
            'restaurant' => $resto,
            'images' => $resto->images,
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
        $path = $request->file('image')->store('resto-images', 'public');

        // If this is set as primary, unset other primary images
        if ($request->is_primary) {
            RestoImage::where('resto_id', $user->restoid)
                ->update(['is_primary' => false]);
        }

        // Get the next order number
        $maxOrder = RestoImage::where('resto_id', $user->restoid)->max('order') ?? 0;

        // Create the image record
        $image = RestoImage::create([
            'resto_id' => $user->restoid,
            'image_path' => $path,
            'caption' => $validated['caption'] ?? null,
            'order' => $maxOrder + 1,
            'is_primary' => $request->is_primary ?? false,
        ]);

        return back()->with('success', 'Image uploaded successfully!');
    }

    public function update(Request $request, RestoImage $image)
    {
        $user = auth()->user();

        // Ensure the image belongs to this user's restaurant
        if ($image->resto_id !== $user->restoid) {
            return back()->with('error', 'Unauthorized action');
        }

        $validated = $request->validate([
            'caption' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        // If this is set as primary, unset other primary images
        if (isset($validated['is_primary']) && $validated['is_primary']) {
            RestoImage::where('resto_id', $user->restoid)
                ->where('id', '!=', $image->id)
                ->update(['is_primary' => false]);
        }

        $image->update($validated);

        return back()->with('success', 'Image updated successfully!');
    }

    public function destroy(RestoImage $image)
    {
        $user = auth()->user();

        // Ensure the image belongs to this user's restaurant
        if ($image->resto_id !== $user->restoid) {
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
            'images.*.id' => ['required', 'exists:resto_images,id'],
            'images.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['images'] as $imageData) {
            RestoImage::where('id', $imageData['id'])
                ->where('resto_id', $user->restoid)
                ->update(['order' => $imageData['order']]);
        }

        return back()->with('success', 'Images reordered successfully!');
    }
}
