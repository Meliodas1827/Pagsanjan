<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Boat;
use App\Models\BoatBooking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class BoatBookingController extends Controller
{
    public function show(Boat $boat)
    {
        // Load images relationship
        $boat->load(['images' => function($query) {
            $query->orderBy('order');
        }]);

        // Get booked dates for the boat
        $bookedDates = BoatBooking::where('boat_id', $boat->id)
            ->whereIn('status', ['pending', 'boat_assigned'])
            ->select('date_of_booking as date', 'no_of_adults', 'no_of_children')
            ->get()
            ->groupBy('date')
            ->map(function ($bookings) {
                return [
                    'date' => $bookings->first()->date,
                    'total_reserved' => $bookings->sum('no_of_adults') + $bookings->sum('no_of_children'),
                ];
            })
            ->values();

        return Inertia::render('customer/BoatBooking', [
            'boat' => [
                'id' => $boat->id,
                'boat_no' => $boat->boat_no,
                'bankero_name' => $boat->bankero_name,
                'capacity' => $boat->capacity,
                'available_slot' => $boat->available_slot,
                'price_per_adult' => $boat->price_per_adult,
                'price_per_child' => $boat->price_per_child,
                'status' => $boat->status,
                'image' => $boat->image,
            ],
            'bookedDates' => $bookedDates,
            'boat_images' => $boat->images,
        ]);
    }

    public function getBoatAvailability($boatId, $date)
    {
        $boat = Boat::findOrFail($boatId);

        // Get total reserved seats for this date
        $totalReserved = BoatBooking::where('boat_id', $boatId)
            ->where('date_of_booking', $date)
            ->whereIn('status', ['pending', 'boat_assigned'])
            ->sum(DB::raw('no_of_adults + no_of_children'));

        $available = $boat->capacity - $totalReserved;

        return response()->json([
            'capacity' => $boat->capacity,
            'reserved' => $totalReserved,
            'available' => max(0, $available),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'boat_id' => 'required|exists:boats,id',
            'date_of_booking' => 'required|date|after_or_equal:today',
            'ride_time' => 'required',
            'no_of_adults' => 'required|integer|min:1',
            'no_of_children' => 'required|integer|min:0',
        ]);

        $boat = Boat::findOrFail($validated['boat_id']);
        $user = Auth::user();

        // Check total guests doesn't exceed capacity
        $totalGuests = $validated['no_of_adults'] + $validated['no_of_children'];

        // Get already reserved seats for this date
        $totalReserved = BoatBooking::where('boat_id', $boat->id)
            ->where('date_of_booking', $validated['date_of_booking'])
            ->whereIn('status', ['pending', 'boat_assigned'])
            ->sum(DB::raw('no_of_adults + no_of_children'));

        $availableSeats = $boat->capacity - $totalReserved;

        if ($totalGuests > $availableSeats) {
            return back()->withErrors([
                'capacity' => "Only {$availableSeats} seat(s) available on this date."
            ]);
        }

        // Calculate total amount
        $totalAmount = ($validated['no_of_adults'] * $boat->price_per_adult) +
                      ($validated['no_of_children'] * $boat->price_per_child);

        // Create booking
        $booking = BoatBooking::create([
            'user_id' => Auth::id(),
            'boat_id' => $boat->id,
            'date_of_booking' => $validated['date_of_booking'],
            'ride_time' => $validated['ride_time'],
            'no_of_adults' => $validated['no_of_adults'],
            'no_of_children' => $validated['no_of_children'],
            'total_amount' => $totalAmount,
            'is_walk_in' => false,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'created_by' => Auth::id(),
        ]);

        // Send confirmation email to customer
        $this->sendBookingConfirmationEmail($booking, $boat, $user);

        return redirect()->route('my.bookings')->with('success', 'Boat booking created successfully!');
    }

    private function sendBookingConfirmationEmail($booking, $boat, $user)
    {
        // Format date and time
        $rideDate = \Carbon\Carbon::parse($booking->date_of_booking)->format('F d, Y');
        $rideTime = \Carbon\Carbon::parse($booking->ride_time)->format('h:i A');

        $emailData = [
            'customer_name' => $user->name,
            'boat_no' => $boat->boat_no,
            'bankero_name' => $boat->bankero_name,
            'capacity' => $boat->capacity,
            'ride_date' => $rideDate,
            'ride_time' => $rideTime,
            'no_of_adults' => $booking->no_of_adults,
            'no_of_children' => $booking->no_of_children,
            'total_amount' => $booking->total_amount,
            'price_per_adult' => $boat->price_per_adult,
            'price_per_child' => $boat->price_per_child,
        ];

        try {
            Mail::send('emails.boat-booking-confirmation', $emailData, function ($message) use ($user) {
                $message->to($user->email, $user->name)
                    ->subject('Boat Booking Confirmation - Pagsanjan Falls Resort');
            });
        } catch (\Exception $e) {
            // Log error but don't stop the booking process
            \Log::error('Failed to send boat booking confirmation email: ' . $e->getMessage());
        }
    }

    public function requestBoat(Request $request)
    {
        $validated = $request->validate([
            'date_of_booking' => 'required|date|after_or_equal:today',
            'ride_time' => 'required',
            'no_of_adults' => 'required|integer|min:1',
            'no_of_children' => 'required|integer|min:0',
        ]);

        // Get current user
        $user = Auth::user();

        // Create booking without boat assignment (boat_id will be null)
        // Total amount will be 0 initially, UBAAP will assign boat and calculate price
        $booking = BoatBooking::create([
            'user_id' => Auth::id(),
            'boat_id' => null, // Will be assigned by UBAAP
            'date_of_booking' => $validated['date_of_booking'],
            'ride_time' => $validated['ride_time'],
            'no_of_adults' => $validated['no_of_adults'],
            'no_of_children' => $validated['no_of_children'],
            'total_amount' => 0, // Will be calculated when boat is assigned
            'is_walk_in' => false,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'created_by' => Auth::id(),
        ]);

        // Send email notification to all UBAAP admins
        $this->sendBoatRequestEmailToUbaap($booking, $user);

        return redirect()->back()->with('success', 'Boat ride request submitted successfully!');
    }

    private function sendBoatRequestEmailToUbaap($booking, $user)
    {
        // Get all UBAAP admin users (role_id = 4)
        $ubaapAdmins = User::where('role_id', 4)->get();

        if ($ubaapAdmins->isEmpty()) {
            return;
        }

        // Format date and time
        $rideDate = \Carbon\Carbon::parse($booking->date_of_booking)->format('F d, Y');
        $rideTime = \Carbon\Carbon::parse($booking->ride_time)->format('h:i A');

        $emailData = [
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'ride_date' => $rideDate,
            'ride_time' => $rideTime,
            'no_of_adults' => $booking->no_of_adults,
            'no_of_children' => $booking->no_of_children,
            'booking_id' => $booking->id,
        ];

        foreach ($ubaapAdmins as $admin) {
            try {
                Mail::send('emails.boat-request-notification', $emailData, function ($message) use ($admin) {
                    $message->to($admin->email, $admin->name)
                        ->subject('New Boat Ride Request - Action Required');
                });
            } catch (\Exception $e) {
                // Log error but don't stop the booking process
                \Log::error('Failed to send boat request email to UBAAP admin: ' . $e->getMessage());
            }
        }
    }
}
