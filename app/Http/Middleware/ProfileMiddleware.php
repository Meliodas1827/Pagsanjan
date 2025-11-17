<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ProfileMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Only check if user is logged in, role is 'customer' (role_id = 3),
        // email is verified, and guest profile is not completed
        if ($user &&
            $user->role_id === 3 &&
            $user->hasVerifiedEmail() &&
            !$user->guest &&
            !$request->is('my-profile', 'my-profile-post', 'logout', 'account', 'account/*')) {
            return redirect('/my-profile')
                ->with('warning', 'Please complete your customer information before continuing.');
        }

        return $next($request);
    }
}
