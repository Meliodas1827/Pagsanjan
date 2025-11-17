<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        // Get phone and address from guest profile if available, otherwise from user table
        $phone = $user->phone;
        $address = $user->address;

        if ($user->guest) {
            $phone = $user->guest->phone ?? $user->phone;
            $address = $user->guest->address ?? $user->address;
        }

        return Inertia::render('customer/Profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $phone,
                'address' => $address,
                'created_at' => $user->created_at->format('F d, Y'),
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        // Debug logging
        \Log::info('Account profile update attempt', [
            'user_id' => $user->id,
            'request_data' => $request->all(),
        ]);

        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'phone' => ['nullable', 'string', 'max:20'],
                'address' => ['nullable', 'string', 'max:500'],
            ], [
                'name.required' => 'Name is required.',
                'name.max' => 'Name cannot exceed 255 characters.',
                'email.required' => 'Email is required.',
                'email.email' => 'Please provide a valid email address.',
                'email.unique' => 'This email is already in use.',
                'phone.max' => 'Phone number cannot exceed 20 characters.',
                'address.max' => 'Address cannot exceed 500 characters.',
            ]);

            $user->update($validated);

            // Also update guest table if guest profile exists
            if ($user->guest) {
                $user->guest->update([
                    'phone' => $validated['phone'],
                    'address' => $validated['address'],
                ]);
            }

            \Log::info('Account profile updated successfully', ['user_id' => $user->id]);

            return redirect()->back()->with('success', 'Profile updated successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Account profile validation failed', [
                'user_id' => $user->id,
                'errors' => $e->errors(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Account profile update error', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->back()->withErrors(['error' => 'An error occurred while updating your profile. Please try again.']);
        }
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = Auth::user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password changed successfully!');
    }

    public function deleteAccount(Request $request)
    {
        $validated = $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = Auth::user();

        // Check if user has pending bookings
        $hasPendingBookings = $user->boatBookings()
            ->whereIn('status', ['pending', 'boat_assigned', 'confirmed'])
            ->exists();

        if ($hasPendingBookings) {
            return back()->withErrors([
                'password' => 'Cannot delete account with pending bookings. Please cancel or complete all bookings first.',
            ]);
        }

        // Logout and delete
        Auth::logout();
        $user->delete();

        return redirect()->route('welcome')->with('success', 'Your account has been deleted successfully.');
    }
}
