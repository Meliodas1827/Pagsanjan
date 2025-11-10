<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Boat;
use App\Models\BoatBooking;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\Payment;
use App\Models\ResortBooking;
use App\Models\RestoBooking;
use App\Models\LandingAreaRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerBookingController extends Controller
{
    public function myBookingPage(Request $request)
    {
        $guestId = $request->user()->id;
        $resortBookings = Booking::select([
            'id',
            'reference_id',
            'booking_status',
            'check_in_date',
            'check_out_date',
            'total_price',
            'created_at',
            'no_of_adults',
            'no_of_children'

        ])
            ->where('userid', $guestId)
            ->get();

        // Add expiration info for each booking
        foreach ($resortBookings as $booking) {
            $bookingCreatedAt = Carbon::parse($booking->created_at);
            $bookingScheduleDate = Carbon::parse($booking->check_in_date);
            $now = Carbon::now();

            // Policy rules
            $hoursUntilSchedule = $bookingCreatedAt->diffInHours($bookingScheduleDate);
            if ($hoursUntilSchedule <= 12) {
                $expirationHours = 6;
            } elseif ($hoursUntilSchedule <= 24) {
                $expirationHours = 12;
            } else {
                $expirationHours = 48;
            }

            // Compute expiration
            $expirationTime = $bookingCreatedAt->copy()->addHours($expirationHours);

            if ($now->lessThan($expirationTime)) {
                $diff = $now->diff($expirationTime);
                $hours = $diff->h + ($diff->days * 24); // include days in hours
                $minutes = $diff->i;

                $booking->remaining_time = "{$hours}hrs and {$minutes}mins";
            } else {
                $booking->remaining_time = "Expired";
            }

            $booking->expiration_time = $expirationTime->format('Y-m-d H:i:s');
        }


        $boatBookingInformation = BoatBooking::select(
            'boat_bookings.id',
            'boat_bookings.status',
            'boat_bookings.date_of_booking',
            'boats.boat_no',
            'boats.price_per_adult',
            'boats.price_per_child',
            'boat_bookings.ride_time',
            'boat_bookings.no_of_adults',
            'boat_bookings.no_of_children',
            'boat_bookings.total_amount',
            'boat_bookings.created_at'
        )
            ->leftJoin('boats', 'boats.id', '=', 'boat_bookings.boat_id')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        // Get restaurant bookings for this user
        $restaurantBookings = RestoBooking::where('user_id_booker', $request->user()->id)
            ->where('deleted', 0)
            ->with(['resto', 'restoTable'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get landing area bookings for this user
        $landingAreaBookings = LandingAreaRequest::where('user_id', $request->user()->id)
            ->with(['landingArea'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('customer/BookingPage', [
            'resortbookings' => $resortBookings,
            'boat_ride_data' => $boatBookingInformation,
            'restaurantBookings' => $restaurantBookings,
            'landingAreaBookings' => $landingAreaBookings
        ]);
    }




    public function myBookingDetails(Request $request)
    {
        $guestId = Guest::where('user_id', $request->user()->id)->value('id');
        $booking = Booking::where('guest_id', $guestId)
            ->latest()
            ->first();

        if (!$booking) {
            return Inertia::render('customer/ViewDetails', [
                'message' => 'No bookings found.'
            ]);
        }

        // Auto-expire if overdue
        $booking->checkAndExpire();

        // --- Cancellation & Refund Eligibility ---
        $canCancel = false;
        $canRefund = false;
        $refundDeadline = null;

        if (!in_array($booking->booking_status, ['expired', 'cancelled', 'declined'])) {
            $createdAt = $booking->created_at;
            $serviceDate = Carbon::parse($booking->service_date);
            $hoursUntilSchedule = $createdAt->diffInHours($serviceDate);

            if ($hoursUntilSchedule <= 12) {
                $refundPeriodHours = 6;
            } elseif ($hoursUntilSchedule <= 24) {
                $refundPeriodHours = 12;
            } else {
                $refundPeriodHours = 48;
            }

            $refundDeadline = $createdAt->copy()->addHours($refundPeriodHours);
            $isPaid = $booking->payments()->where('payment_status', 'completed')->exists();

            // User can cancel if service date not passed
            if (Carbon::now()->lessThan($serviceDate)) {
                $canCancel = true;

                if ($isPaid && Carbon::now()->lessThanOrEqualTo($refundDeadline)) {
                    $canRefund = true;
                }
            }
        }

        // --- Entity Details ---
        $details = [
            'reservation_type' => 'Resort',
            'resort_name' => null,
            'image_url' => null,
            'contact' => null,
            'amenities' => null,
            'booking_status' => $booking->booking_status
        ];

        if ($booking->reservation_type_id) {
            $resortBooking = ResortBooking::where('booking_id', $booking->id)->first();
            if ($resortBooking && $resortBooking->ResortRoom) {
                $resortDetails = $resortBooking->ResortRoom;
                $details = [
                    'reservation_type' => 'Resort',
                    'resort_name' => $resortDetails->resort_name,
                    'image_url' => $resortDetails->image_url,
                    'contact' => $resortDetails->contact,
                    'email' => $resortDetails->resort_email,
                    'amenities' => $resortDetails->amenities,
                    'booking_status' => $booking->booking_status
                ];
            }
        }

        // --- Boat Ride Status ---
        $boatRideStatus = BoatBooking::select('status')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first();

        // --- Booking Information ---

        $paymentDetails = Payment::where('booking_id', $booking->id)->latest()->first();

        $bookingInformation = [
            'id' => $booking->id,
            'created_at' => $booking->created_at,
            'updated_at' => $booking->updated_at,
            'reference_id' => $booking->reference_id,
            'service_date' => $booking->service_date,
            'check_in_date' => $booking->check_in_date,
            'check_out_date' => $booking->check_out_date,
            'total_price' => $booking->total_price,
            'payment_status' => $paymentDetails->payment_status,
            'payment_type' => $paymentDetails->payment_type,
            'no_of_nights' => Carbon::parse($booking->check_in_date)
                ->diffInDays(Carbon::parse($booking->check_out_date))
        ];

        return Inertia::render('customer/ViewDetails', [
            'entity_details' => $details,
            'boat_ride_status' => $boatRideStatus,
            'booking_information' => $bookingInformation,
            'cancellation_options' => [
                'can_cancel' => $canCancel,
                'can_refund' => $canRefund,
                'refund_deadline' => $refundDeadline ? $refundDeadline->format('Y-m-d H:i:s') : null
            ]
        ]);
    }

    public function manageMyBookings()
    {

        return Inertia::render('customer/ManageBookingPage');
    }
}
