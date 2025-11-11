<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Mail\ResortBookingNotification;
use App\Models\EntranceFee;
use App\Models\Resort;
use App\Models\ResortBooking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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
            'adults' => 'required|integer|min:0',
            'children' => 'required|integer|min:0',
            'pwd' => 'required|integer|min:0',
            'senior' => 'required|integer|min:0',
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        // Store payment proof
        $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'public');

        // Create resort booking record only (no bookings table)
        $booking = ResortBooking::create([
            'resort_id' => $validated['resort_id'],
            'user_booker' => $user->id,
            'status' => 'pending',
            'payment_proof' => $paymentProofPath,
            'date_checkin' => $validated['date_checkin'],
            'date_checkout' => $validated['date_checkout'],
            'adults' => $validated['adults'],
            'children' => $validated['children'],
            'pwd' => $validated['pwd'],
            'senior' => $validated['senior'],
            'amount' => $validated['total_amount'],
        ]);

        // Load relationships for email
        $booking->load(['resort', 'user']);

        // Send email notification to resort admins only (not system admins)
        $resortAdmins = User::where('role_id', 4) // role_id 4 is 'resort'
            ->where('resort_id', $validated['resort_id'])
            ->get();

        foreach ($resortAdmins as $admin) {
            Mail::to($admin->email)->send(new ResortBookingNotification($booking));
        }

        return redirect()->route('my.bookings')->with('success', 'Resort reservation submitted successfully! Please wait for confirmation.');
    }
}
