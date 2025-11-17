<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class MyProfileController extends Controller
{
    public function index(Request $request)
    {
        // return data
        $guest = $request->user()->guest;
        return Inertia::render('customer/Account', ['data' => $guest]);
    }

    public function create()
    {
        return Inertia::render('customer/MyProfile');
    }



    public function store(Request $request)
    {
        // Debug: Log incoming request data
        \Log::info('Profile submission received', [
            'all_data' => $request->all(),
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'address' => $request->input('address'),
            'phone' => $request->input('phone'),
        ]);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:40', 'min:2'],
            'last_name'  => ['required', 'string', 'max:40', 'min:2'],
            'address'    => ['required', 'string', 'max:100', 'min:5'],
            'phone'      => ['required', 'string', 'max:40', 'min:7'],
        ], [
            'first_name.required' => 'First name is required.',
            'first_name.min' => 'First name must be at least 2 characters.',
            'first_name.max' => 'First name cannot exceed 40 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.min' => 'Last name must be at least 2 characters.',
            'last_name.max' => 'Last name cannot exceed 40 characters.',
            'address.required' => 'Address is required.',
            'address.min' => 'Address must be at least 5 characters.',
            'address.max' => 'Address cannot exceed 100 characters.',
            'phone.required' => 'Phone number is required.',
            'phone.min' => 'Phone number must be at least 7 characters.',
            'phone.max' => 'Phone number cannot exceed 40 characters.',
        ]);

        // Add logged-in user_id
        $validated['user_id'] = Auth::id();

        try {
            Guest::create($validated);

            // Also update user table with phone and address for consistency
            $user = Auth::user();
            $user->update([
                'phone' => $validated['phone'],
                'address' => $validated['address'],
            ]);

            \Log::info('Guest profile created and user table updated', ['user_id' => $user->id]);

            // Redirect to welcome page after successful profile creation
            return redirect('/welcome')->with('success', 'Profile completed successfully! You can now make bookings.');
        } catch (\Throwable $th) {
            \Log::error('Profile creation error: ' . $th->getMessage());
            return back()->withErrors(['error' => 'An error occurred while saving your profile. Please try again.']);
        }
    }
};
