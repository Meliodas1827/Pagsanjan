<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\Refund;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CancelBookingController extends Controller
{
    public function cancelBooking(Request $request, $reference_id)
    {
        // Find booking by reference_id
        $booking = Booking::where('reference_id', $reference_id)->firstOrFail();

        // Get the authenticated user's guest ID
        $guestId = Guest::where('user_id', $request->user()->id)->value('id');

        // Check if the booking belongs to the authenticated user
        if ($booking->guest_id !== $guestId) {
            return back()->withErrors([
                'error' => 'Unauthorized to cancel this booking'
            ]);
        }

        // Check if booking can be cancelled
        if (in_array($booking->booking_status, ['expired', 'cancelled', 'declined'])) {
            return back()->withErrors([
                'error' => 'Booking cannot be cancelled as it is already ' . $booking->booking_status
            ]);
        }

        // Calculate refund eligibility
        $createdAt = $booking->created_at;
        $serviceDate = Carbon::parse($booking->service_date);
        $hoursUntilSchedule = $createdAt->diffInHours($serviceDate);

        // Determine refund period based on hours until schedule
        if ($hoursUntilSchedule <= 12) {
            $refundPeriodHours = 6;
        } elseif ($hoursUntilSchedule <= 24) {
            $refundPeriodHours = 12;
        } else {
            $refundPeriodHours = 48;
        }

        $refundDeadline = $createdAt->copy()->addHours($refundPeriodHours);
        $isPaid = $booking->payments()->where('payment_status', 'completed')->exists();

        DB::beginTransaction();

        try {
            // Check if booking is paid and within refund period
            if ($isPaid && Carbon::now()->lessThanOrEqualTo($refundDeadline)) {
                // Process refund
                $booking->payments()
                    ->where('payment_status', 'completed')
                    ->update([
                        'payment_status' => 'refunded',
                        'payment_date' => Carbon::now(),
                    ]);

                $booking->update([
                    'booking_status' => 'cancelled',
                    'expired_at' => Carbon::now(),
                ]);

                DB::commit();

                return redirect()->back()->with([
                    'success' => 'Booking successfully cancelled and payment refunded',
                    'refund' => true,
                    'ok' => true,
                    'booking_id' => $booking->id
                ]);
            }

            // Cancel booking without refund (either not paid or refund period expired)
            $booking->update([
                'booking_status' => 'cancelled',
                'expired_at' => Carbon::now(),
            ]);

            DB::commit();

            $message = $isPaid
                ? 'Booking cancelled. Refund period has expired, no refund will be processed'
                : 'Booking successfully cancelled';

            return redirect()->back()->with([
                'success' => $message,
                'refund' => false,
                'ok' => true,
                'booking_id' => $booking->id
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to cancel booking. Please try again later',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ]);
        }
    }

    public function refundBooking(Request $request, $booking_id)
    {
        try {
            // Find booking
            $booking = Booking::findOrFail($booking_id);

            // Check ownership
            $guestId = Guest::where('user_id', $request->user()->id)->value('id');
            if ($booking->guest_id !== $guestId) {
                return back()->withErrors(['error' => 'Unauthorized']);
            }

            // Check if already refunded
            if (Refund::where('booking_id', $booking->id)->exists()) {
                return back()->withErrors(['error' => 'Refund already requested']);
            }

            // Get payment
            $payment = $booking->payments()->where('payment_status', 'completed')->first();
            if (!$payment) {
                return back()->withErrors(['error' => 'No payment found']);
            }

            // Check refund deadline (same logic as cancel)
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

            if (Carbon::now()->greaterThan($refundDeadline)) {
                return back()->withErrors(['error' => 'Refund period expired']);
            }

            DB::beginTransaction();

            // Calculate 70% refund
            $refundAmount = Refund::calculateRefund($payment->amount_paid);

            // Create refund record
            Refund::create([
                'booking_id' => $booking->id,
                'payment_id' => $payment->id,
                'original_amount' => $payment->amount_paid,
                'refund_amount' => $refundAmount,
                'status' => 'pending',
                'reason' => 'Customer requested refund',
                
            ]);

            // Update booking status
            $booking->update([
                'booking_status' => 'cancelled',
                'cancelled_at' => Carbon::now(),
            ]);

            // Update payment status
            $payment->update(['payment_status' => 'refunded']);

            DB::commit();

            return redirect()->back()->with([
                'success' => 'Refund request submitted! You will receive $' . number_format($refundAmount, 2) . ' (70% of $' . number_format($payment->amount, 2) . ') within 3-5 business days.',
                'refund' => true,
                'refund_amount' => $refundAmount,
                'booking_id' => $booking->id
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Failed to process refund: ' . $e->getMessage(),
                'file' => $e->getFile() . ':' . $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}
