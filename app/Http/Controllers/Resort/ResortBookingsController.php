<?php

namespace App\Http\Controllers\Resort;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
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

        // Get bookings for this resort
        $bookings = Booking::with(['user', 'resortBooking.resortRoom'])
            ->whereHas('resortBooking.resortRoom', function ($query) use ($resortId) {
                $query->where('resort_id', $resortId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Calculate statistics
        $totalBookings = Booking::whereHas('resortBooking.resortRoom', function ($query) use ($resortId) {
            $query->where('resort_id', $resortId);
        })->count();

        $confirmed = Booking::whereHas('resortBooking.resortRoom', function ($query) use ($resortId) {
            $query->where('resort_id', $resortId);
        })->where('booking_status', 'confirmed')->count();

        $pending = Booking::whereHas('resortBooking.resortRoom', function ($query) use ($resortId) {
            $query->where('resort_id', $resortId);
        })->where('booking_status', 'pending')->count();

        $completed = Booking::whereHas('resortBooking.resortRoom', function ($query) use ($resortId) {
            $query->where('resort_id', $resortId);
        })->where('booking_status', 'completed')->count();

        $cancelled = Booking::whereHas('resortBooking.resortRoom', function ($query) use ($resortId) {
            $query->where('resort_id', $resortId);
        })->where('booking_status', 'cancelled')->count();

        return Inertia::render('resort/Bookings', [
            'bookings' => $bookings,
            'statistics' => [
                'total' => $totalBookings,
                'confirmed' => $confirmed,
                'pending' => $pending,
                'completed' => $completed,
                'cancelled' => $cancelled,
            ],
        ]);
    }
}
