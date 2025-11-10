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
 
        // Only check if user is logged in and role is 'customer' (e.g. role_id = 3)
        if ($user && $user->role_id === 3 && !$user->guest) {
            return redirect('/my-profile')
                ->with('warning', 'Please complete your customer information.');
        }

        return $next($request);
    }
}
