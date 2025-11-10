<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class AcceptBookingController extends Controller
{
    public function acceptBookingRequest(Request $request)
    {

        if ($request->user()->role_id !== 1) {
            return back()->withErrors(['error' => 'Unauthorized action']);
        }

        $validated = $request->validate([
            'booking_id' => 'required|integer|exists:bookings,id',

        ]);

        try {
            $booking = Booking::with(['user'])->findOrFail($request->booking_id);

            // Update booking status
            $booking->update(['booking_status' => 'accepted']);

            // Send email notification
            $this->sendAcceptanceEmail($booking);

            return back()->with('success', 'Booking request accepted successfully.');
        } catch (\Throwable $th) {
            \Log::error('Failed to accept booking: ' . $th->getMessage());
            return back()->withErrors(['error' => $th->getMessage()]);
        }
    }

    public function declineBookingRequest(Request $request)
    {
      if ($request->user()->role_id !== 1) {
            return back()->withErrors(['error' => 'Unauthorized action']);
        }

        $validated = $request->validate([
            'booking_id' => 'required|integer|exists:bookings,id',

        ]);

        try {
            $booking = Booking::with(['user'])->findOrFail($request->booking_id);

            // Update booking status
            $booking->update(['booking_status' => 'declined']);

            // Send email notification
            $this->sendDeclineEmail($booking);

            return back()->with('success', 'Booking request declined successfully.');
        } catch (\Throwable $th) {
            \Log::error('Failed to decline booking: ' . $th->getMessage());
            return back()->withErrors(['error' => $th->getMessage()]);
        }
    }

    private function sendAcceptanceEmail($booking)
    {
        try {
            $customer = $booking->user;
            if (!$customer) {
                \Log::warning("No customer found for booking ID: {$booking->id}");
                return;
            }

            $hotel = Hotel::find($booking->hotelid);
            $room = Room::find($booking->roomid);

            $checkIn = new \DateTime($booking->check_in_date);
            $checkOut = new \DateTime($booking->check_out_date);
            $nights = $checkOut->diff($checkIn)->days;

            $emailData = [
                'customer_name' => $customer->name,
                'reference_id' => $booking->reference_id,
                'hotel_name' => $hotel->hotel_name ?? 'N/A',
                'room_name' => $room->room_name ?? 'N/A',
                'check_in' => $checkIn->format('F d, Y'),
                'check_out' => $checkOut->format('F d, Y'),
                'nights' => $nights,
                'adults' => $booking->no_of_adults,
                'children' => $booking->no_of_children,
                'total_amount' => number_format($booking->total_price, 2),
                'status' => 'accepted',
            ];

            Mail::send('emails.booking-status-notification', $emailData, function ($message) use ($customer, $booking) {
                $message->to($customer->email, $customer->name)
                    ->subject('Booking Accepted - ' . $booking->reference_id);
            });
        } catch (\Exception $e) {
            \Log::error('Failed to send acceptance email: ' . $e->getMessage());
        }
    }

    private function sendDeclineEmail($booking)
    {
        try {
            $customer = $booking->user;
            if (!$customer) {
                \Log::warning("No customer found for booking ID: {$booking->id}");
                return;
            }

            $hotel = Hotel::find($booking->hotelid);
            $room = Room::find($booking->roomid);

            $checkIn = new \DateTime($booking->check_in_date);
            $checkOut = new \DateTime($booking->check_out_date);
            $nights = $checkOut->diff($checkIn)->days;

            $emailData = [
                'customer_name' => $customer->name,
                'reference_id' => $booking->reference_id,
                'hotel_name' => $hotel->hotel_name ?? 'N/A',
                'room_name' => $room->room_name ?? 'N/A',
                'check_in' => $checkIn->format('F d, Y'),
                'check_out' => $checkOut->format('F d, Y'),
                'nights' => $nights,
                'adults' => $booking->no_of_adults,
                'children' => $booking->no_of_children,
                'total_amount' => number_format($booking->total_price, 2),
                'status' => 'declined',
            ];

            Mail::send('emails.booking-status-notification', $emailData, function ($message) use ($customer, $booking) {
                $message->to($customer->email, $customer->name)
                    ->subject('Booking Declined - ' . $booking->reference_id);
            });
        } catch (\Exception $e) {
            \Log::error('Failed to send decline email: ' . $e->getMessage());
        }
    }
}
