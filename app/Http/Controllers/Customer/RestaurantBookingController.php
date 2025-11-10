<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Mail\RestaurantBookingNotification;
use App\Models\Resto;
use App\Models\RestoBooking;
use App\Models\RestoTable;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class RestaurantBookingController extends Controller
{
    public function show($id)
    {
        $restaurant = Resto::with(['restoTables' => function ($query) {
            $query->where('deleted', 0);
        }])->findOrFail($id);

        if ($restaurant->deleted == 1) {
            abort(404);
        }

        $activeTables = $restaurant->restoTables->where('deleted', 0);

        return Inertia::render('customer/RestaurantBooking', [
            'restaurant' => [
                'id' => $restaurant->id,
                'resto_name' => $restaurant->resto_name,
                'img' => $restaurant->img,
                'payment_qr' => $restaurant->payment_qr,
                'deleted' => $restaurant->deleted,
                'resto_tables' => $activeTables->map(function ($table) {
                    return [
                        'id' => $table->id,
                        'resto_id' => $table->resto_id,
                        'status' => $table->status,
                        'no_of_chairs' => $table->no_of_chairs,
                        'price' => $table->price,
                        'deleted' => $table->deleted,
                    ];
                })->values(),
                'available_tables_count' => $activeTables->where('status', 'available')->count(),
                'total_capacity' => $activeTables->sum('no_of_chairs'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resto_id' => 'required|exists:resto,id',
            'resto_table_id' => 'required|exists:resto_tables,id',
            'no_of_guest' => 'required|integer|min:1',
            'payment_proof' => 'nullable|image|max:2048', // Max 2MB
        ]);

        // Check if table is available
        $table = RestoTable::where('id', $validated['resto_table_id'])
            ->where('status', 'available')
            ->where('deleted', 0)
            ->firstOrFail();

        // Check if number of guests exceeds table capacity
        if ($validated['no_of_guest'] > $table->no_of_chairs) {
            return back()->withErrors([
                'no_of_guest' => 'Number of guests exceeds table capacity (' . $table->no_of_chairs . ' seats)',
            ]);
        }

        // Handle payment proof upload
        $paymentProofPath = null;
        if ($request->hasFile('payment_proof')) {
            $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'public');
        }

        // Create booking
        $booking = RestoBooking::create([
            'resto_id' => $validated['resto_id'],
            'resto_table_id' => $validated['resto_table_id'],
            'user_id_booker' => auth()->id(),
            'no_of_guest' => $validated['no_of_guest'],
            'is_book_confirmed' => false,
            'is_paid' => false, // Payment unconfirmed initially
            'payment_proof' => $paymentProofPath,
            'deleted' => 0,
        ]);

        // Update table status to reserved
        $table->update(['status' => 'reserved']);

        // Load relationships for the email
        $booking->load(['resto', 'restoTable', 'booker']);

        // Send email notification to all admins of this restaurant
        $admins = User::whereHas('role', function ($query) {
            $query->where('role_name', 'restaurant');
        })
        ->where('restoid', $validated['resto_id'])
        ->get();

        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new RestaurantBookingNotification($booking));
        }

        return redirect()->route('dashboard')->with('success', 'Table reservation submitted successfully! Waiting for restaurant confirmation.');
    }

    public function myBookings()
    {
        $bookings = RestoBooking::with(['resto', 'restoTable', 'confirmedBy'])
            ->where('user_id_booker', auth()->id())
            ->where('deleted', 0)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('customer/MyRestaurantBookings', [
            'bookings' => $bookings,
        ]);
    }

    public function cancel($id)
    {
        $booking = RestoBooking::where('id', $id)
            ->where('user_id_booker', auth()->id())
            ->where('deleted', 0)
            ->firstOrFail();

        // Only allow cancellation if not confirmed
        if ($booking->is_book_confirmed) {
            return back()->withErrors([
                'message' => 'Cannot cancel a confirmed booking. Please contact the restaurant.',
            ]);
        }

        // Soft delete the booking
        $booking->update(['deleted' => 1]);

        // Update table status back to available
        $booking->restoTable->update(['status' => 'available']);

        return back()->with('success', 'Booking cancelled successfully.');
    }
}
