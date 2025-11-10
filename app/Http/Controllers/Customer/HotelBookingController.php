<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\BoatBooking;
use App\Models\Hotel;
use App\Models\HotelBooking;
use App\Models\HotelReferenceNumberCounter;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class HotelBookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'adults' => 'required|integer|min:1',
            'children' => 'required|integer|min:0',
            'include_boat' => 'required|boolean',
            'boat_date' => 'nullable|date|after_or_equal:today',
            'boat_time' => 'nullable',
            'boat_adults' => 'nullable|integer|min:1',
            'boat_children' => 'nullable|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            $room = Room::with('currentPrice')->findOrFail($validated['room_id']);
            $user = Auth::user();

            $referenceNumber = $this->generateRefNum($room->hotelid);
            $boatBookingId = null;

            // Calculate total price for room
            $checkIn = new \DateTime($validated['check_in']);
            $checkOut = new \DateTime($validated['check_out']);
            $nights = $checkOut->diff($checkIn)->days;
            $pricePerNight = $room->currentPrice ? $room->currentPrice->price_per_night : 0;
            $roomTotal = $nights * $pricePerNight;

            // Calculate 50% of room total as the final price to pay
            $finalPrice = $roomTotal * 0.5;

            // Create boat booking if boat is included (no specific boat, UBAAP will assign)
            if ($validated['include_boat']) {
                $boatAdults = $validated['boat_adults'] ?? 1;
                $boatChildren = $validated['boat_children'] ?? 0;
                $boatDate = $validated['boat_date'] ?? $validated['check_in'];
                $boatTime = $validated['boat_time'] ?? null;

                $boatBooking = BoatBooking::create([
                    'user_id' => $user->id,
                    'date_of_booking' => $boatDate,
                    'ride_time' => $boatTime,
                    'boat_id' => null, // Will be assigned by UBAAP Admin
                    'total_amount' => 0, // Will be calculated when boat is assigned
                    'no_of_adults' => $boatAdults,
                    'no_of_children' => $boatChildren,
                    'is_walk_in' => false,
                    'status' => 'pending',
                    'created_by' => $user->id,
                ]);

                $boatBookingId = $boatBooking->id;

                // Send email notification to UBAAP admins
                $this->notifyUbaapAdmins($boatBooking, $user);
            }

            // Create Booking record
            \Log::info('Attempting to create booking', [
                'reference_id' => $referenceNumber,
                'user_id' => $user->id,
                'hotel_id' => $room->hotelid,
                'room_id' => $validated['room_id'],
            ]);

            $booking = \App\Models\Booking::create([
                'reference_id' => $referenceNumber,
                'userid' => $user->id,
                'hotelid' => $room->hotelid,
                'roomid' => $validated['room_id'],
                'requested_date' => now(),
                'no_of_adults' => $validated['adults'],
                'no_of_children' => $validated['children'],
                'check_in_date' => $validated['check_in'],
                'check_out_date' => $validated['check_out'],
                'total_price' => $finalPrice,
                'booking_status' => 'pending',
            ]);

            \Log::info('Booking created successfully', ['booking_id' => $booking->id]);

            DB::commit();

            \Log::info('Transaction committed');

            $this->notifyHotelManager($room->hotelid, $user, $room, $validated, $boatBookingId, $referenceNumber, $finalPrice);

            return redirect()->route('my.bookings');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Booking creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Failed to create booking: ' . $e->getMessage()]);
        }
    }

    public function generateRefNum($hotelId)
    {
        $referenceCounter = HotelReferenceNumberCounter::find(1);

        $todayFormatted = date('Y-m-d'); // For database storage
        $todayForReference = date('mdY'); // For reference ID

        if ($referenceCounter->datetoday !== $todayFormatted) {
            $referenceCounter->update([
                'counter' => 0,
                'datetoday' => $todayFormatted,
            ]);
            $count = 0;
        } else {
            $count = $referenceCounter->counter + 1;
            $referenceCounter->update(['counter' => $count]);
        }

        // Pad the counter to 4 digits with leading zeros
        $counterPadded = str_pad($count, 4, '0', STR_PAD_LEFT);

        // Compose the reference ID
        $referenceID = "HR" . $todayForReference . $hotelId . $counterPadded;
        return $referenceID;
    }

    private function notifyHotelManager($hotelId, $customer, $room, $bookingData, $boatBookingId, $referenceNumber, $totalAmount)
    {
        try {
            // Get hotel details
            $hotel = Hotel::find($hotelId);
            if (!$hotel) {
                return;
            }

            // Find hotel manager (user with role 6 and matching hotelid)
            $hotelManager = User::where('role_id', 6)
                ->where('hotelid', $hotelId)
                ->first();

            if (!$hotelManager) {
                \Log::warning("No hotel manager found for hotel ID: {$hotelId}");
                return;
            }

            // Calculate booking details
            $checkIn = new \DateTime($bookingData['check_in']);
            $checkOut = new \DateTime($bookingData['check_out']);
            $nights = $checkOut->diff($checkIn)->days;

            // Prepare email data
            $emailData = [
                'hotel_name' => $hotel->hotel_name,
                'customer_name' => $customer->name,
                'customer_email' => $customer->email,
                'room_name' => $room->room_name,
                'check_in' => $checkIn->format('F d, Y'),
                'check_out' => $checkOut->format('F d, Y'),
                'nights' => $nights,
                'adults' => $bookingData['adults'],
                'children' => $bookingData['children'],
                'has_boat' => $boatBookingId ? 'Yes' : 'No',
                'booking_date' => now()->format('F d, Y h:i A'),
                'reference_id' => $referenceNumber,
                'total_amount' => number_format($totalAmount, 2),
            ];

            // Send email
            Mail::send('emails.hotel-booking-notification', $emailData, function ($message) use ($hotelManager, $hotel) {
                $message->to($hotelManager->email, $hotelManager->name)
                    ->subject('New Booking for ' . $hotel->hotel_name);
            });
        } catch (\Exception $e) {
            \Log::error('Failed to send hotel booking notification: ' . $e->getMessage());
        }
    }

    private function notifyUbaapAdmins($boatBooking, $user)
    {
        try {
            // Get all UBAAP admin users (role_id = 4)
            $ubaapAdmins = User::where('role_id', 4)->get();

            if ($ubaapAdmins->isEmpty()) {
                \Log::warning('No UBAAP admins found to notify about boat booking');
                return;
            }

            // Format date and time
            $rideDate = \Carbon\Carbon::parse($boatBooking->date_of_booking)->format('F d, Y');
            $rideTime = $boatBooking->ride_time ? \Carbon\Carbon::parse($boatBooking->ride_time)->format('h:i A') : 'Not specified';

            $emailData = [
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'ride_date' => $rideDate,
                'ride_time' => $rideTime,
                'no_of_adults' => $boatBooking->no_of_adults,
                'no_of_children' => $boatBooking->no_of_children,
                'booking_id' => $boatBooking->id,
            ];

            foreach ($ubaapAdmins as $admin) {
                Mail::send('emails.boat-request-notification', $emailData, function ($message) use ($admin) {
                    $message->to($admin->email, $admin->name)
                        ->subject('New Boat Ride Request - Action Required');
                });
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send UBAAP boat booking notification: ' . $e->getMessage());
        }
    }
}
