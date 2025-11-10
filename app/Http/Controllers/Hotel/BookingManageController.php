<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Mail\HotelBookingStatusUpdated;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BookingManageController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $hotelId = $user->hotelid;

        if (!$hotelId) {
            return Inertia::render('hotel/BookingManagement', [
                'bookings' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                ],
                'hotel' => null,
            ]);
        }

        // Get bookings for this hotel with relationships
        $bookings = Booking::with(['user', 'room', 'hotel'])
            ->where('hotelid', $hotelId)
            ->whereNotNull('hotelid')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Get hotel info
        $hotel = \App\Models\Hotel::find($hotelId);

        return Inertia::render('hotel/BookingManagement', [
            'bookings' => $bookings,
            'hotel' => $hotel ? ['hotel_name' => $hotel->hotel_name] : null,
        ]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        // Verify that the booking belongs to the hotel admin's hotel
        $user = auth()->user();
        if ($booking->hotelid !== $user->hotelid) {
            return back()->with('error', 'Unauthorized action');
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'accepted', 'declined', 'cancelled', 'expired', 'done'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Store old status for email notification
        $oldStatus = $booking->booking_status;
        $newStatus = $validated['status'];

        $booking->update([
            'booking_status' => $newStatus,
            'notes' => $validated['notes'] ?? $booking->notes,
        ]);

        // Load relationships for email
        $booking->load(['user', 'hotel', 'room']);

        // Send email notification to customer
        if ($booking->user && $booking->user->email) {
            Mail::to($booking->user->email)
                ->send(new HotelBookingStatusUpdated($booking, $oldStatus, $newStatus));
        }

        return back()->with('success', 'Booking status updated successfully');
    }

    public function cancel(Booking $booking)
    {
        // Verify that the booking belongs to the hotel admin's hotel
        $user = auth()->user();
        if ($booking->hotelid !== $user->hotelid) {
            return back()->with('error', 'Unauthorized action');
        }

        $booking->update([
            'booking_status' => 'cancelled',
        ]);

        return back()->with('success', 'Booking cancelled successfully');
    }
}
