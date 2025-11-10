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

        return Inertia::render('customer/Profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'created_at' => $user->created_at->format('F d, Y'),
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully!');
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
