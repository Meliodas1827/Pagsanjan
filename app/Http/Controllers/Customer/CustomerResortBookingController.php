<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\EntranceFee;
use App\Models\Resort;
use App\Models\ResortBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerResortBookingController extends Controller
{
    public function show($id)
    {
        $resort = Resort::where('id', $id)
            ->where('deleted', 0)
            ->firstOrFail();

        $entranceFees = EntranceFee::where('resort_id', $id)
            ->orderBy('category')
            ->get();

        return Inertia::render('customer/ResortBooking', [
            'resort' => [
                'id' => $resort->id,
                'resort_name' => $resort->resort_name,
                'img' => $resort->img,
                'payment_qr' => $resort->payment_qr,
            ],
            'entrance_fees' => $entranceFees,
        ]);
    }

    public function book(Request $request)
    {
        $validated = $request->validate([
            'resort_id' => 'required|exists:resorts,id',
            'date_checkin' => 'required|date|after_or_equal:today',
            'date_checkout' => 'required|date|after:date_checkin',
            'guests' => 'required|json',
            'total_amount' => 'required|numeric|min:0',
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        // Store payment proof
        $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'public');

        // Create booking record
        $booking = Booking::create([
            'userid' => $user->id,
            'booking_status' => 'pending',
            'total_price' => $validated['total_amount'],
            'check_in_date' => $validated['date_checkin'],
            'check_out_date' => $validated['date_checkout'],
        ]);

        // Create resort booking record
        ResortBooking::create([
            'booking_id' => $booking->id,
            'resort_id' => $validated['resort_id'],
            'user_booker' => $user->id,
            'status' => 'pending',
            'payment_proof' => $paymentProofPath,
            'date_checkin' => $validated['date_checkin'],
            'date_checkout' => $validated['date_checkout'],
        ]);

        return redirect()->route('my.bookings')->with('success', 'Resort reservation submitted successfully! Please wait for confirmation.');
    }
}
