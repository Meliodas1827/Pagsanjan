<?php

namespace App\Http\Controllers\LandingAreaAdmin;

use App\Http\Controllers\Controller;
use App\Models\LandingArea;
use App\Models\LandingAreaImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandingAreaImageController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $landingArea = LandingArea::with(['images' => function($query) {
            $query->orderBy('order');
        }])->findOrFail($user->landing_area_id);

        return Inertia::render('landing-area/LandingAreaImages', [
            'landingArea' => $landingArea,
            'images' => $landingArea->images,
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

        $path = $request->file('image')->store('landing-area-images', 'public');

        if ($request->is_primary) {
            LandingAreaImage::where('landing_area_id', $user->landing_area_id)->update(['is_primary' => false]);
        }

        $maxOrder = LandingAreaImage::where('landing_area_id', $user->landing_area_id)->max('order') ?? 0;

        LandingAreaImage::create([
            'landing_area_id' => $user->landing_area_id,
            'image_path' => $path,
            'caption' => $validated['caption'] ?? null,
            'order' => $maxOrder + 1,
            'is_primary' => $request->is_primary ?? false,
        ]);

        return back()->with('success', 'Image uploaded successfully!');
    }

    public function update(Request $request, LandingAreaImage $image)
    {
        $user = auth()->user();
        if ($image->landing_area_id !== $user->landing_area_id) {
            return back()->with('error', 'Unauthorized action');
        }

        $validated = $request->validate([
            'caption' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['boolean'],
            'order' => ['integer', 'min:0'],
        ]);

        if (isset($validated['is_primary']) && $validated['is_primary']) {
            LandingAreaImage::where('landing_area_id', $user->landing_area_id)
                ->where('id', '!=', $image->id)
                ->update(['is_primary' => false]);
        }

        $image->update($validated);
        return back()->with('success', 'Image updated successfully!');
    }

    public function destroy(LandingAreaImage $image)
    {
        $user = auth()->user();
        if ($image->landing_area_id !== $user->landing_area_id) {
            return back()->with('error', 'Unauthorized action');
        }

        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();
        return back()->with('success', 'Image deleted successfully!');
    }

    public function reorder(Request $request)
    {
        $user = auth()->user();
        $validated = $request->validate([
            'images' => ['required', 'array'],
            'images.*.id' => ['required', 'exists:landing_area_images,id'],
            'images.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['images'] as $imageData) {
            LandingAreaImage::where('id', $imageData['id'])
                ->where('landing_area_id', $user->landing_area_id)
                ->update(['order' => $imageData['order']]);
        }

        return back()->with('success', 'Images reordered successfully!');
    }
}
