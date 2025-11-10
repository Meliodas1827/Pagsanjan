<?php

namespace App\Http\Controllers\Admin;

use App\Models\Resto;
use App\Models\RestoTable;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    public function index()
    {
        $restaurants = Resto::getRestos();

        return Inertia::render('restaurant/RestaurantManagement', [
            'restaurants' => $restaurants
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resto_name' => 'required|string|max:255',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'payment_qr' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/restaurants'), $imageName);
            $validated['img'] = '/uploads/restaurants/' . $imageName;
        }

        // Handle QR code upload
        if ($request->hasFile('payment_qr')) {
            $qrImage = $request->file('payment_qr');
            $qrImageName = time() . '_qr_' . $qrImage->getClientOriginalName();
            $qrImage->move(public_path('uploads/restaurants/qrcodes'), $qrImageName);
            $validated['payment_qr'] = '/uploads/restaurants/qrcodes/' . $qrImageName;
        }

        Resto::create($validated);

        return redirect()->route('manage-restaurant.index')->with('success', 'Restaurant created successfully!');
    }

    public function update(Request $request, Resto $restaurant)
    {
        $validated = $request->validate([
            'resto_name' => 'required|string|max:255',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'payment_qr' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('img')) {
            // Delete old image if exists
            if ($restaurant->img && file_exists(public_path($restaurant->img))) {
                unlink(public_path($restaurant->img));
            }

            $image = $request->file('img');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/restaurants'), $imageName);
            $validated['img'] = '/uploads/restaurants/' . $imageName;
        }

        // Handle QR code upload
        if ($request->hasFile('payment_qr')) {
            // Delete old QR code if exists
            if ($restaurant->payment_qr && file_exists(public_path($restaurant->payment_qr))) {
                unlink(public_path($restaurant->payment_qr));
            }

            $qrImage = $request->file('payment_qr');
            $qrImageName = time() . '_qr_' . $qrImage->getClientOriginalName();
            $qrImage->move(public_path('uploads/restaurants/qrcodes'), $qrImageName);
            $validated['payment_qr'] = '/uploads/restaurants/qrcodes/' . $qrImageName;
        }

        $restaurant->update($validated);

        return redirect()->route('manage-restaurant.index')->with('success', 'Restaurant updated successfully!');
    }

    public function destroy(Resto $restaurant)
    {
        $restaurant->update(['deleted' => 1]);

        return redirect()->route('manage-restaurant.index')->with('success', 'Restaurant deleted successfully!');
    }

    public function toggleStatus(Resto $restaurant)
    {
        $restaurant->update(['deleted' => $restaurant->deleted ? 0 : 1]);

        return redirect()->route('manage-restaurant.index')->with('success', $restaurant->deleted ? 'Restaurant disabled successfully!' : 'Restaurant enabled successfully!');
    }

    // Table Management
    public function storeTable(Request $request, Resto $restaurant)
    {
        $validated = $request->validate([
            'no_of_chairs' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:available,reserved',
        ]);

        $validated['resto_id'] = $restaurant->id;

        RestoTable::create($validated);

        return redirect()->route('manage-restaurant.index')->with('success', 'Table added successfully!');
    }

    public function updateTable(Request $request, RestoTable $table)
    {
        $validated = $request->validate([
            'no_of_chairs' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:available,reserved',
        ]);

        $table->update($validated);

        return redirect()->route('manage-restaurant.index')->with('success', 'Table updated successfully!');
    }

    public function destroyTable(RestoTable $table)
    {
        $table->update(['deleted' => 1]);

        return redirect()->route('manage-restaurant.index')->with('success', 'Table deleted successfully!');
    }

    public function toggleTableStatus(RestoTable $table)
    {
        $table->update(['deleted' => $table->deleted ? 0 : 1]);

        return redirect()->route('manage-restaurant.index')->with('success', $table->deleted ? 'Table disabled successfully!' : 'Table enabled successfully!');
    }
}
