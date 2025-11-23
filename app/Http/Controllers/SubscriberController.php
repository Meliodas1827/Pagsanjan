<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriberController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid email address.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if email already exists
            $existingSubscriber = Subscriber::where('email', $request->email)->first();

            if ($existingSubscriber) {
                if ($existingSubscriber->is_active) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This email is already subscribed to our newsletter.'
                    ], 409);
                } else {
                    // Reactivate if previously unsubscribed
                    $existingSubscriber->update(['is_active' => true]);
                    return response()->json([
                        'success' => true,
                        'message' => 'Welcome back! Your subscription has been reactivated.'
                    ]);
                }
            }

            // Create new subscriber
            Subscriber::create([
                'email' => $request->email,
                'is_active' => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you for subscribing! You will receive exclusive deals and updates.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your subscription. Please try again later.'
            ], 500);
        }
    }
}
