<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Mail\LandingAreaRequestNotification;
use App\Models\LandingArea;
use App\Models\LandingAreaRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class LandingAreaBookingController extends Controller
{
    public function show($id)
    {
        $landingArea = LandingArea::findOrFail($id);

        if (!$landingArea->is_active) {
            abort(404);
        }

        // Get user and guest data for pre-filling form
        $user = auth()->user();
        $guest = $user ? $user->guest : null;

        return Inertia::render('customer/LandingAreaBooking', [
            'landingArea' => [
                'id' => $landingArea->id,
                'name' => $landingArea->name,
                'description' => $landingArea->description,
                'location' => $landingArea->location,
                'address' => $landingArea->address,
                'capacity' => $landingArea->capacity,
                'image' => $landingArea->image,
                'payment_qr' => $landingArea->payment_qr,
                'price' => $landingArea->price,
            ],
            'userData' => [
                'name' => $user?->name ?? '',
                'email' => $user?->email ?? '',
                'phone' => $guest?->phone ?? '',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'landing_area_id' => 'required|exists:landing_areas,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'number_of_adults' => 'required|integer|min:1',
            'number_of_children' => 'required|integer|min:0',
            'pickup_date' => 'required|date|after_or_equal:today',
            'pickup_time' => 'required',
            'payment_proof' => 'nullable|image|max:2048', // Max 2MB
        ]);

        // Check landing area capacity
        $landingArea = LandingArea::where('id', $validated['landing_area_id'])
            ->where('is_active', true)
            ->firstOrFail();

        $totalPeople = $validated['number_of_adults'] + $validated['number_of_children'];
        if ($landingArea->capacity && $totalPeople > $landingArea->capacity) {
            return back()->withErrors([
                'number_of_adults' => 'Total number of people exceeds landing area capacity (' . $landingArea->capacity . ' people)',
            ]);
        }

        // Handle payment proof upload
        $paymentProofPath = null;
        if ($request->hasFile('payment_proof')) {
            $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'public');
        }

        // Create booking request
        $booking = LandingAreaRequest::create([
            'landing_area_id' => $validated['landing_area_id'],
            'user_id' => auth()->id(),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'number_of_adults' => $validated['number_of_adults'],
            'number_of_children' => $validated['number_of_children'],
            'pickup_date' => $validated['pickup_date'],
            'pickup_time' => $validated['pickup_time'],
            'status' => 'pending',
            'is_paid' => false, // Payment unconfirmed initially
            'payment_proof' => $paymentProofPath,
        ]);

        // Load the landing area relationship for the email
        $booking->load('landingArea');

        // Send email notification to all admins of this landing area
        $admins = User::whereHas('role', function ($query) {
            $query->where('role_name', 'landing_area');
        })
        ->where('landing_area_id', $validated['landing_area_id'])
        ->get();

        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new LandingAreaRequestNotification($booking));
        }

        return redirect()->route('dashboard')->with('success', 'Landing area booking submitted successfully! Waiting for confirmation.');
    }

    public function myBookings()
    {
        $bookings = LandingAreaRequest::with(['landingArea'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('customer/MyLandingAreaBookings', [
            'bookings' => $bookings,
        ]);
    }

    public function cancel($id)
    {
        $booking = LandingAreaRequest::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Only allow cancellation if not confirmed
        if ($booking->is_confirmed) {
            return back()->withErrors([
                'message' => 'Cannot cancel a confirmed booking. Please contact us directly.',
            ]);
        }

        // Update status to cancelled
        $booking->update(['status' => 'cancelled']);

        return back()->with('success', 'Booking cancelled successfully.');
    }
}
