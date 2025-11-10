<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use App\Models\Boat;
use App\Models\BoatBooking;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\Payment;
use App\Models\ResortBooking;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;


class LandingFormsController extends Controller
{
    // Resort CRUD

    public function index()
    {
        $hotels = \App\Models\Hotel::where('isdeleted', 0)
            ->limit(6)
            ->get()
            ->map(function ($hotel) {
                return [
                    'id' => $hotel->id,
                    'hotel_name' => $hotel->hotel_name,
                    'location' => $hotel->location,
                    'description' => $hotel->description,
                    'image_url' => $hotel->image_url,
                ];
            });

        $boats = Boat::where('status', 'available')
            ->limit(6)
            ->get()
            ->map(function ($boat) {
                return [
                    'id' => $boat->id,
                    'boat_no' => $boat->boat_no,
                    'bankero_name' => $boat->bankero_name,
                    'capacity' => $boat->capacity,
                    'price_per_adult' => $boat->price_per_adult,
                    'price_per_child' => $boat->price_per_child,
                    'image' => $boat->image,
                ];
            });

        return Inertia::render('welcome', [
            'hotels' => $hotels,
            'boats' => $boats,
        ]);
    }
    // is where the resort data
    public function resortForm(Request $request)
    {

        $resort_data = DB::table('resort_rooms')->select(['id', 'resort_name', 'description', 'price_per_day', 'image_url', 'pax', 'amenities'])
            ->get();
        $guest_data = Guest::where('user_id', $request->user()->id)->first();

        // Get available boats with pricing
        $boats = Boat::where('status', 'available')->get();

        return Inertia::render('landing-page/ResortForm', [
            'data' => $resort_data,
            'guest_data' => $guest_data,
            'boats' => $boats

        ]);
    }


    // add bookings for resort only
    public function addBooking(Request $request)
    {
        DB::beginTransaction();

        try {
            // 1. Validate resort booking input
            $validated = $request->validate([
                'no_of_adults'     => 'required|integer|min:1',
                'no_of_children'   => 'required|integer|min:0',
                'check_in_date'    => 'required|date',
                'check_out_date'   => 'required|date|after:check_in_date',
                'price_per_day'    => 'required|numeric|min:1',
                'is_walkin'        => 'nullable|boolean',
                'resort_room_id'   => 'required|exists:resort_rooms,id',
            ]);

            // 2. Calculate total price
            $checkIn  = Carbon::parse($validated['check_in_date']);
            $checkOut = Carbon::parse($validated['check_out_date']);
            $numberOfNights = $checkOut->diffInDays($checkIn);
            $totalPrice = $validated['price_per_day'] * $numberOfNights;

            // 3. Prepare booking data
            $bookingData = [
                'guest_id'            => $request->user()->guest->id,
                'reservation_type_id' => 1, // Resort
                'requested_date'      => now(),
                'service_date'        => $validated['check_in_date'],
                'no_of_adults'        => $validated['no_of_adults'],
                'no_of_children'      => $validated['no_of_children'],
                'check_in_date'       => $validated['check_in_date'],
                'check_out_date'      => $validated['check_out_date'],
                'total_price'         => abs($totalPrice),
                'is_walkin'           => $validated['is_walkin'] ?? false,
                'booking_status'      => 'pending', // default
            ];

            // 4. Create booking
            $booking = Booking::create($bookingData);

            // 5. Link resort booking
            ResortBooking::create([
                'booking_id'     => $booking->id,
                'resort_room_id' => $validated['resort_room_id'],
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            // 6. If boat ride data exists
            if ($request->filled('boat_ride_data')) {
                $boatValidated = $request->validate([
                    'boat_ride_data.boat_id'         => 'required|exists:boats,id',
                    'boat_ride_data.date_of_booking' => 'required|date',
                    'boat_ride_data.time'            => 'required|date_format:H:i',
                    'boat_ride_data.no_of_adults'    => 'required|integer|min:0',
                    'boat_ride_data.no_of_children'  => 'required|integer|min:0',
                ]);

                $boatData = $request->input('boat_ride_data');

                // Get boat pricing from selected boat
                $boat = Boat::findOrFail($boatData['boat_id']);

                $total_amount = ($boatData['no_of_adults'] * $boat->price_per_adult)
                    + ($boatData['no_of_children'] * $boat->price_per_child);

                $boatBooking = BoatBooking::create([
                    'user_id'         => $request->user()->id,
                    'boat_id'         => $boatData['boat_id'],
                    'date_of_booking' => $boatData['date_of_booking'],
                    'ride_time'       => $boatData['time'],
                    'total_amount'    => $total_amount,
                    'no_of_adults'    => $boatData['no_of_adults'],
                    'no_of_children'  => $boatData['no_of_children'],
                    'is_walk_in'      => false,
                    'status'          => 'pending',
                    'created_by'      => $request->user()->id,
                ]);

                // Send email notification to UBAAP admins about the boat booking
                $this->sendBoatBookingEmailToUbaap($boatBooking, $boat, $request->user());
            }

            // 7. Initialize payment record
            Payment::create([
                'booking_id'     => $booking->id,
                'amount_paid'    => 0,
                'payment_status' => 'pending',
                'payment_type'   => 'down_payment',
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Booking created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage()); // for debugging
        }
    }


    public function hoteltForm()
    {
        return Inertia::render('landing-page/ResortForm');
    }
    public function boatForm()
    {
        return Inertia::render('landing-page/ResortForm');
    }
    public function restoForm()
    {
        return Inertia::render('landing-page/ResortForm');
    }

    private function sendBoatBookingEmailToUbaap($boatBooking, $boat, $user)
    {
        // Get all UBAAP admin users (role_id = 4)
        $ubaapAdmins = User::where('role_id', 4)->get();

        if ($ubaapAdmins->isEmpty()) {
            return;
        }

        // Format date and time
        $rideDate = Carbon::parse($boatBooking->date_of_booking)->format('F d, Y');
        $rideTime = Carbon::parse($boatBooking->ride_time)->format('h:i A');

        $emailData = [
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'boat_no' => $boat->boat_no,
            'bankero_name' => $boat->bankero_name,
            'ride_date' => $rideDate,
            'ride_time' => $rideTime,
            'no_of_adults' => $boatBooking->no_of_adults,
            'no_of_children' => $boatBooking->no_of_children,
            'total_amount' => $boatBooking->total_amount,
            'booking_id' => $boatBooking->id,
        ];

        foreach ($ubaapAdmins as $admin) {
            try {
                Mail::send('emails.boat-booking-ubaap-notification', $emailData, function ($message) use ($admin) {
                    $message->to($admin->email, $admin->name)
                        ->subject('New Boat Booking - Resort Reservation');
                });
            } catch (\Exception $e) {
                // Log error but don't stop the booking process
                Log::error('Failed to send boat booking email to UBAAP admin: ' . $e->getMessage());
            }
        }
    }
}
