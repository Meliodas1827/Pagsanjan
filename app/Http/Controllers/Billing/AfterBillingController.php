<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\PaymentService;

class AfterBillingController extends Controller
{

   public function paymentReturn(Request $request, PaymentService $paymentService)
{
    $secret = config('services.paymongo.secret_key');
    $client = new Client();

    $paymentIntentId = $request->query('payment_intent') ?? session('payment_intent_id');
    $bookingId = session('booking_id');

    if (!$paymentIntentId || !$bookingId) {
        abort(400, 'Payment intent ID or Booking ID not found.');
    }

    try {
        // Fetch payment intent
        $response = $client->request('GET', "https://api.paymongo.com/v1/payment_intents/{$paymentIntentId}", [
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode($secret . ':'),
                'Accept' => 'application/json',
            ]
        ]);

        $paymentIntent = json_decode($response->getBody(), true);
        $status = $paymentIntent['data']['attributes']['status'] ?? null;
        $amount = $paymentIntent['data']['attributes']['amount'] / 100;

        // Save payment
        $paymentService->savePayment([
            'booking_id'     => $bookingId,
            'amount'         => $amount,
            'payment_method' => 'gcash',
            'payment_type'   => 'down_payment',
            'payment_status' => match ($status) {
                'succeeded' => 'completed',
                'canceled', 'failed' => 'failed',
                default => 'pending'
            },
        ]);

        // Update booking status if payment succeeded
        if ($status === 'succeeded') {
            $booking = \App\Models\Booking::find($bookingId);
            if ($booking) {
                $booking->update(['booking_status' => 'confirmed']);
            }
        }

        // Redirect based on status
        return match ($status) {
            'succeeded' => redirect()->route('payment.success'),
            'canceled', 'failed' => redirect()->route('payment.cancel'),
            default => redirect()->route('payment.pending')
        };

    } catch (\GuzzleHttp\Exception\ClientException $e) {
        return redirect()->route('payment.error')
            ->with('error', 'Unable to verify payment.');
    }

}

    public function successPage()
    {
        return Inertia::render('billing/payment-status/SuccessPayment');
    }

    public function cancelPage()
    {
        return Inertia::render('billing/payment-status/CancelPayment');
    }
}
