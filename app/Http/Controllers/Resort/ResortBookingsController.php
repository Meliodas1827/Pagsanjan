<?php

namespace App\Http\Controllers\Resort;

use App\Http\Controllers\Controller;
use App\Mail\ResortBookingStatusUpdated;
use App\Models\Booking;
use App\Models\ResortBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ResortBookingsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $resortId = $user->resort_id;

        if (!$resortId) {
            return redirect()->back()->with('error', 'No resort assigned to your account');
        }

        // Get bookings directly from resort_bookings table
        $bookingsQuery = ResortBooking::with(['resort', 'user', 'resortRoom'])
            ->where('resort_id', $resortId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Format bookings data for frontend
        $bookings = [
            'data' => $bookingsQuery->map(function ($booking) {
                $totalGuests = $booking->adults + $booking->children + $booking->pwd + $booking->senior;
                return [
                    'id' => $booking->id,
                    'booking_reference' => 'RB-' . str_pad($booking->id, 6, '0', STR_PAD_LEFT),
                    'user' => [
                        'name' => $booking->user->name ?? 'N/A',
                        'email' => $booking->user->email ?? 'N/A',
                    ],
                    'check_in' => $booking->date_checkin,
                    'check_out' => $booking->date_checkout,
                    'adults' => $booking->adults,
                    'children' => $booking->children,
                    'pwd' => $booking->pwd,
                    'senior' => $booking->senior,
                    'total_guests' => $totalGuests,
                    'total_amount' => $booking->amount,
                    'booking_status' => $booking->status,
                    'status' => $booking->status,
                    'payment_proof' => $booking->payment_proof,
                    'created_at' => $booking->created_at->toISOString(),
                ];
            })->toArray(),
            'current_page' => $bookingsQuery->currentPage(),
            'last_page' => $bookingsQuery->lastPage(),
            'per_page' => $bookingsQuery->perPage(),
            'total' => $bookingsQuery->total(),
        ];

        // Calculate statistics
        $totalBookings = ResortBooking::where('resort_id', $resortId)->count();

        $accepted = ResortBooking::where('resort_id', $resortId)
            ->where('status', 'accepted')
            ->count();

        $pending = ResortBooking::where('resort_id', $resortId)
            ->where('status', 'pending')
            ->count();

        $declined = ResortBooking::where('resort_id', $resortId)
            ->where('status', 'declined')
            ->count();

        $cancelled = ResortBooking::where('resort_id', $resortId)
            ->where('status', 'cancelled')
            ->count();

        return Inertia::render('resort/Bookings', [
            'bookings' => $bookings,
            'statistics' => [
                'total' => $totalBookings,
                'confirmed' => $accepted, // Frontend expects 'confirmed'
                'pending' => $pending,
                'completed' => $declined, // Map declined to completed for display
                'cancelled' => $cancelled,
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        // Verify that the booking belongs to the resort admin's resort
        $user = auth()->user();
        $resortId = $user->resort_id;

        if (!$resortId) {
            return back()->with('error', 'No resort assigned to your account');
        }

        $booking = ResortBooking::where('id', $id)
            ->where('resort_id', $resortId)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'accepted', 'declined', 'cancelled'])],
        ]);

        // Store old status for email notification
        $oldStatus = $booking->status;
        $newStatus = $validated['status'];

        // Update status
        $booking->update([
            'status' => $newStatus,
        ]);

        // Load relationships for email
        $booking->load(['resort', 'user']);

        // Send email notification to customer
        if ($booking->user && $booking->user->email) {
            Mail::to($booking->user->email)
                ->send(new ResortBookingStatusUpdated($booking, $oldStatus, $newStatus));
        }

        return back()->with('success', 'Booking status updated successfully and customer has been notified.');
    }
}
