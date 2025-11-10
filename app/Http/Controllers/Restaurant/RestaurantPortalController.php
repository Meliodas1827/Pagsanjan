<?php

namespace App\Http\Controllers\Restaurant;

use App\Models\Resto;
use App\Models\RestoTable;
use App\Models\RestoBooking;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantPortalController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get the restaurant associated with the logged-in user
        $restaurant = $user->restoid ? Resto::where('id', $user->restoid)
            ->with('restoTables')
            ->first() : null;

        if (!$restaurant) {
            return Inertia::render('restaurant/NoRestaurant');
        }

        return Inertia::render('restaurant/RestaurantPortal', [
            'restaurant' => $restaurant
        ]);
    }

    public function bookings()
    {
        $user = auth()->user();
        $restaurant = Resto::where('id', $user->restoid)->first();

        if (!$restaurant) {
            return Inertia::render('restaurant/NoRestaurant');
        }

        // Get bookings for this restaurant
        $bookings = RestoBooking::where('resto_id', $restaurant->id)
            ->where('deleted', 0)
            ->with(['restoTable', 'booker'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('restaurant/RestaurantBookings', [
            'bookings' => $bookings
        ]);
    }

    public function updateQrCode(Request $request)
    {
        $user = auth()->user();
        $restaurant = Resto::where('id', $user->restoid)->firstOrFail();

        $validated = $request->validate([
            'payment_qr' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle QR code upload
        if ($request->hasFile('payment_qr')) {
            // Delete old QR code if exists
            if ($restaurant->payment_qr && file_exists(public_path($restaurant->payment_qr))) {
                unlink(public_path($restaurant->payment_qr));
            }

            $qrImage = $request->file('payment_qr');
            $qrImageName = time() . '_qr_' . $qrImage->getClientOriginalName();
            $qrImage->move(public_path('uploads/restaurants/qrcodes'), $qrImageName);

            $restaurant->update(['payment_qr' => '/uploads/restaurants/qrcodes/' . $qrImageName]);
        }

        return redirect()->route('restaurant-portal.index')->with('success', 'Payment QR Code updated successfully!');
    }

    // Table Management
    public function storeTable(Request $request)
    {
        $user = auth()->user();
        $restaurant = Resto::where('id', $user->restoid)->firstOrFail();

        $validated = $request->validate([
            'no_of_chairs' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:available,reserved',
        ]);

        $validated['resto_id'] = $restaurant->id;

        RestoTable::create($validated);

        return redirect()->route('restaurant-portal.index')->with('success', 'Table added successfully!');
    }

    public function updateTable(Request $request, RestoTable $table)
    {
        $user = auth()->user();
        $restaurant = Resto::where('id', $user->restoid)->firstOrFail();

        // Ensure the table belongs to the user's restaurant
        if ($table->resto_id !== $restaurant->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'no_of_chairs' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:available,reserved',
        ]);

        $table->update($validated);

        return redirect()->route('restaurant-portal.index')->with('success', 'Table updated successfully!');
    }

    public function destroyTable(RestoTable $table)
    {
        $user = auth()->user();
        $restaurant = Resto::where('id', $user->restoid)->firstOrFail();

        // Ensure the table belongs to the user's restaurant
        if ($table->resto_id !== $restaurant->id) {
            abort(403, 'Unauthorized action.');
        }

        $table->update(['deleted' => 1]);

        return redirect()->route('restaurant-portal.index')->with('success', 'Table deleted successfully!');
    }

    public function toggleTableStatus(RestoTable $table)
    {
        $user = auth()->user();
        $restaurant = Resto::where('id', $user->restoid)->firstOrFail();

        // Ensure the table belongs to the user's restaurant
        if ($table->resto_id !== $restaurant->id) {
            abort(403, 'Unauthorized action.');
        }

        $table->update(['deleted' => $table->deleted ? 0 : 1]);

        return redirect()->route('restaurant-portal.index')->with('success', $table->deleted ? 'Table disabled successfully!' : 'Table enabled successfully!');
    }

    // Booking Management
    public function confirmBooking(RestoBooking $booking)
    {
        $user = auth()->user();
        $restaurant = Resto::where('id', $user->restoid)->firstOrFail();

        // Ensure the booking belongs to the user's restaurant
        if ($booking->resto_id !== $restaurant->id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->update([
            'is_book_confirmed' => 1,
            'confirmed_by' => $user->id
        ]);

        return redirect()->route('restaurant-portal.index')->with('success', 'Booking confirmed successfully!');
    }

    public function cancelBooking(RestoBooking $booking)
    {
        $user = auth()->user();
        $restaurant = Resto::where('id', $user->restoid)->firstOrFail();

        // Ensure the booking belongs to the user's restaurant
        if ($booking->resto_id !== $restaurant->id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->update(['deleted' => 1]);

        return redirect()->route('restaurant-portal.index')->with('success', 'Booking cancelled successfully!');
    }
}
