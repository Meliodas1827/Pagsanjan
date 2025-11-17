<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            // If customer hasn't completed profile, redirect to profile page
            if ($user->role_id === 3 && !$user->guest) {
                return redirect('/my-profile')->with('info', 'Please complete your profile to continue.');
            }

            return redirect()->intended(route('dashboard', absolute: false));
        }

        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
