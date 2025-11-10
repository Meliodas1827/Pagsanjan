<?php

namespace App\Http\Controllers\Ubaap;

use App\Http\Controllers\Controller;
use App\Models\Boat;
use App\Models\BoatBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class BoatAssignController extends Controller
{
    public function index()
    {
        // Date & Time	Guest Name	No. of guest	Total Amount	Payment Status	Boat Assigned
        $data = BoatBooking::select(
            'boat_bookings.id',
            'boat_bookings.date_of_booking',
            'boat_bookings.ride_time',
            'boat_bookings.total_amount',
            'boat_bookings.status',
            'boat_bookings.no_of_adults',
            'boat_bookings.no_of_children',
            'users.name as guest_name',
            'users.email as guest_email',
            'boats.boat_no'
        )
            ->join('users', 'users.id', '=', 'boat_bookings.user_id')
            ->leftJoin('boats', 'boats.id', '=', 'boat_bookings.boat_id')
            ->whereIn('boat_bookings.status', ['pending', 'boat_assigned'])
            ->orderBy('boat_bookings.date_of_booking', 'asc')
            ->get();

        // boat available data
        $boats = Boat::where('status', 'available')->select('id', 'boat_no', 'capacity')->get();

        return Inertia::render('ubaap/AssignBoat', ['data' => $data, 'boats' => $boats]);
    }

    public function AssignBoat(Request $request)
    {
        $validated = $request->validate([
            'boatBookingId' => 'required|integer',
            'boat_id' => 'required|integer'

        ]);
        $boatBookingId = $validated['boatBookingId'];

        try {
            // Get the booking details with user relationship
            $booking = BoatBooking::with('user')->findOrFail($boatBookingId);
            $totalGuests = $booking->no_of_adults + $booking->no_of_children;

            // Get the boat
            $boat = Boat::findOrFail($validated['boat_id']);

            // Check if boat has enough available slots
            if ($boat->available_slot < $totalGuests) {
                return back()->withErrors(['error' => 'Not enough available slots on this boat.']);
            }

            // Calculate total amount based on boat pricing
            $totalAmount = ($booking->no_of_adults * $boat->price_per_adult) +
                          ($booking->no_of_children * $boat->price_per_child);

            // Update booking status and assign boat
            BoatBooking::where('id', $boatBookingId)->update([
                 'boat_id' => $validated['boat_id'],
                 'total_amount' => $totalAmount,
                 'status' => 'boat_assigned'
            ]);

            // Decrease available slots on the boat
            $boat->decrement('available_slot', $totalGuests);

            // Update boat status if no slots available
            if ($boat->available_slot - $totalGuests <= 0) {
                $boat->update(['status' => 'booked']);
            }

            // Send email notification to customer
            $this->sendBoatAssignedEmail($booking, $boat, $totalAmount);

            return redirect()->back()->with(['ok' => true]);

        } catch (\Throwable $th) {
            return back()->withErrors(['error' => $th->getMessage()]);
        }
    }

    private function sendBoatAssignedEmail($booking, $boat, $totalAmount)
    {
        $customer = $booking->user;

        if (!$customer) {
            return;
        }

        // Format date and time
        $rideDate = \Carbon\Carbon::parse($booking->date_of_booking)->format('F d, Y');
        $rideTime = \Carbon\Carbon::parse($booking->ride_time)->format('h:i A');

        $emailData = [
            'customer_name' => $customer->name,
            'boat_no' => $boat->boat_no,
            'bankero_name' => $boat->bankero_name,
            'capacity' => $boat->capacity,
            'ride_date' => $rideDate,
            'ride_time' => $rideTime,
            'no_of_adults' => $booking->no_of_adults,
            'no_of_children' => $booking->no_of_children,
            'total_amount' => $totalAmount,
            'price_per_adult' => $boat->price_per_adult,
            'price_per_child' => $boat->price_per_child,
        ];

        try {
            Mail::send('emails.boat-assigned-notification', $emailData, function ($message) use ($customer) {
                $message->to($customer->email, $customer->name)
                    ->subject('Boat Assigned - Your Ride is Confirmed!');
            });
        } catch (\Exception $e) {
            // Log error but don't stop the assignment process
            \Log::error('Failed to send boat assignment email to customer: ' . $e->getMessage());
        }
    }
}
