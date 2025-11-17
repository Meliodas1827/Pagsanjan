<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Auth\Concerns\RedirectsBasedOnRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    use RedirectsBasedOnRole;
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $userId = $request->route('id');
        $hash = $request->route('hash');

        // Find the user that needs verification
        $user = User::findOrFail($userId);

        // Verify the hash matches
        if (!hash_equals(sha1($user->getEmailForVerification()), (string) $hash)) {
            abort(403, 'Invalid verification link.');
        }

        // Check if URL signature is valid (signed middleware handles this)
        if (!$request->hasValidSignature()) {
            abort(403, 'Verification link has expired.');
        }

        // If user is already verified, redirect them
        if ($user->hasVerifiedEmail()) {
            // If logged in as wrong user, log them out and log in as correct user
            if (Auth::check() && Auth::id() !== $user->id) {
                Auth::logout();
                Auth::login($user);
            } elseif (!Auth::check()) {
                Auth::login($user);
            }

            // For customers without guest profile, redirect to profile completion
            if ($user->role_id === 3 && !$user->guest) {
                return redirect('/my-profile')->with('info', 'Please complete your profile to continue.');
            }

            return redirect()->intended($this->redirectPath($user).'?verified=1');
        }

        // If currently logged in as a different user, switch to the correct user
        if (Auth::check() && Auth::id() !== $user->id) {
            Auth::logout();
        }

        // Log in as the user who needs verification
        if (!Auth::check()) {
            Auth::login($user);
        }

        // Mark email as verified
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // For customers, redirect to profile completion page after verification
        if ($user->role_id === 3 && !$user->guest) {
            return redirect('/my-profile')->with('success', 'Email verified! Please complete your profile to continue.');
        }

        return redirect()->intended($this->redirectPath($user).'?verified=1');
    }
}
