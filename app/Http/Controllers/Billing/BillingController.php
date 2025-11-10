<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function index(Request $request)
    {
        $guestId = $request->user()->guest->id;
        // Get resort bookings
        $resortBookings = Booking::select([
            'bookings.id',
            'bookings.reference_id',
            'bookings.booking_status',
            'bookings.check_in_date',
            'bookings.check_out_date',
            'bookings.total_price',
            'bookings.created_at',
            'bookings.no_of_adults',
            'bookings.no_of_children',
            'resort_rooms.resort_name as room_name',
            'resort_rooms.description',
            'resort_rooms.amenities',
            DB::raw("'resort' as booking_type"),
            'guests.first_name',
            'guests.last_name',
            'guests.address',
            'guests.phone',
        ])
            ->join('resort_bookings', 'bookings.id', '=', 'resort_bookings.booking_id')
            ->join('resort_rooms', 'resort_bookings.resort_room_id', '=', 'resort_rooms.id')
            ->join('guests', 'bookings.guest_id', '=', 'guests.id')
            ->where('bookings.guest_id', $guestId)
            ->get();

        // add expiration 
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

        return Inertia::render('billing/Billing', ['resortbookings' => $resortBookings]);
    }


    public function create(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'email' => 'required|email',
            'phone' => 'required|string',
            'payment_method' => 'required|string|in:gcash',
            'name' => 'sometimes|string', // optional
        ]);

        $client = new Client();
        $secret = config('services.paymongo.secret_key');
        $amount = intval($request->amount * 100); // Convert to cents

        // 1️⃣ Create Payment Method
        $paymentMethodBody = [
            "data" => [
                "attributes" => [
                    "billing" => [
                        "name" => $request->name ?? 'customer',
                        "email" => $request->email,
                        "phone" => $request->phone
                    ],
                    "type" => $request->payment_method
                ]
            ]
        ];

        $paymentMethodResponse = $client->request('POST', 'https://api.paymongo.com/v1/payment_methods', [
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                // 'Authorization' => 'Basic ' . base64_encode($secret . ':')
                // 'authorization' => 'Basic c2tfdGVzdF9MdTd1bTkxRmNFZkFldWZvN1gyWHVHREw6',
                'Authorization' => 'Basic ' . base64_encode($secret . ':'),

            ],
            'body' => json_encode($paymentMethodBody),
        ]);

        $paymentMethod = json_decode($paymentMethodResponse->getBody()->getContents(), true);
        $paymentMethodId = $paymentMethod['data']['id'];

        // 2️⃣ Create Payment Intent
        $paymentIntentBody = [
            "data" => [
                "attributes" => [
                    "amount" => $amount,
                    "currency" => "PHP",
                    "payment_method_allowed" => ["qrph", "card", "dob", "paymaya", "billease", "gcash", "grab_pay"],
                    "capture_type" => "automatic"
                ]
            ]
        ];

        $paymentIntentResponse = $client->request('POST', 'https://api.paymongo.com/v1/payment_intents', [
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                // 'Authorization' => 'Basic ' . base64_encode($secret . ':')
                // 'authorization' => 'Basic c2tfdGVzdF9MdTd1bTkxRmNFZkFldWZvN1gyWHVHREw6',
                'Authorization' => 'Basic ' . base64_encode($secret . ':'),

            ],
            'body' => json_encode($paymentIntentBody),
        ]);

        $paymentIntent = json_decode($paymentIntentResponse->getBody()->getContents(), true);
        $paymentIntentId = $paymentIntent['data']['id'];
        $clientKey = $paymentIntent['data']['attributes']['client_key'];

        // 3️⃣ Attach Payment Method
        $attachBody = [
            "data" => [
                "attributes" => [
                    "payment_method" => $paymentMethodId,
                    "client_key" => $clientKey,
                    "return_url" => route('payment.return'),
                ]
            ]
        ];

        $attachResponse = $client->request('POST', "https://api.paymongo.com/v1/payment_intents/{$paymentIntentId}/attach", [
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                // 'Authorization' => 'Basic ' . base64_encode($secret . ':')
                'Authorization' => 'Basic ' . base64_encode($secret . ':'),

                // 'authorization' => 'Basic c2tfdGVzdF9MdTd1bTkxRmNFZkFldWZvN1gyWHVHREw6',
            ],
            'body' => json_encode($attachBody),
        ]);

        $attached = json_decode($attachResponse->getBody()->getContents(), true);

        // 4️⃣ Get Checkout URL
        $checkoutUrl = $attached['data']['attributes']['next_action']['redirect']['url'] ?? null;
        session(['payment_intent_id' => $paymentIntentId, 'booking_id' => $request->booking_id]);
        //store in session

        if (!$checkoutUrl) {
            return Inertia::render('billing/Billing', [
                'error' => 'Unable to create checkout URL. Please try again.'
            ]);
        } 

            // 5️⃣ Redirect user to PayMongo hosted checkout
            return response()->json(['url' => $checkoutUrl]);
    }



}
