<?php

namespace App\Http\Controllers\Admin;

use App\Models\Hotel;
use App\Models\HotelImage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelController extends Controller
{
    public function index()
    {
        $hotels = Hotel::getHotels();

        return Inertia::render('hotel/HotelManagement', [
            'hotels' => $hotels
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/hotels'), $imageName);
            $validated['image_url'] = '/uploads/hotels/' . $imageName;
        }

        unset($validated['image']);

        Hotel::create($validated);

        return redirect()->route('manage-hotel.index')->with('success', 'Hotel created successfully!');
    }

    public function update(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($hotel->image_url && file_exists(public_path($hotel->image_url))) {
                unlink(public_path($hotel->image_url));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/hotels'), $imageName);
            $validated['image_url'] = '/uploads/hotels/' . $imageName;
        }

        unset($validated['image']);

        $hotel->update($validated);

        return redirect()->route('manage-hotel.index')->with('success', 'Hotel updated successfully!');
    }

    public function destroy(Hotel $hotel)
    {
        $hotel->update(['isdeleted' => 1]);

        return redirect()->route('manage-hotel.index')->with('success', 'Hotel deleted successfully!');
    }

    public function toggleStatus(Hotel $hotel)
    {
        $hotel->update(['isdeleted' => $hotel->isdeleted ? 0 : 1]);

        return redirect()->route('manage-hotel.index')->with('success', $hotel->isdeleted ? 'Hotel disabled successfully!' : 'Hotel enabled successfully!');
    }

    public function storeImages(Request $request, Hotel $hotel)
    {
        try {
            $validated = $request->validate([
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->move(public_path('uploads/hotels/gallery'), $imageName);

                    HotelImage::create([
                        'hotelid' => $hotel->id,
                        'image_url' => '/uploads/hotels/gallery/' . $imageName,
                    ]);
                }
            }

            return back()->with('success', 'Images uploaded successfully!');
        } catch (\Exception $e) {
            \Log::error('Image upload error: ' . $e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function deleteImage(Request $request, Hotel $hotel)
    {
        $imageId = $request->input('image_id');

        $hotelImage = HotelImage::where('id', $imageId)
            ->where('hotelid', $hotel->id)
            ->first();

        if ($hotelImage) {
            // Delete physical file
            if (file_exists(public_path($hotelImage->image_url))) {
                unlink(public_path($hotelImage->image_url));
            }

            // Delete database record
            $hotelImage->delete();
        }

        return back()->with('success', 'Image deleted successfully!');
    }

    public function updateQrCode(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'qrcode_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle QR code upload
        if ($request->hasFile('qrcode_image')) {
            // Delete old QR code if exists
            if ($hotel->qrcode_image_payment && file_exists(public_path($hotel->qrcode_image_payment))) {
                unlink(public_path($hotel->qrcode_image_payment));
            }

            $image = $request->file('qrcode_image');
            $imageName = time() . '_qr_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/hotels/qrcodes'), $imageName);

            $hotel->update(['qrcode_image_payment' => '/uploads/hotels/qrcodes/' . $imageName]);
        }

        return back()->with('success', 'QR Code updated successfully!');
    }
}
