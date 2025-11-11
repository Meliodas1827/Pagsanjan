<?php

namespace App\Http\Controllers\Auth\Concerns;

use App\Models\User;

trait RedirectsBasedOnRole
{
    /**
     * Get the redirect path based on user role.
     *
     * @param  \App\Models\User  $user
     * @return string
     */
    protected function redirectPath(User $user): string
    {
        return match ($user->role_id) {
            1 => '/dashboard',                  // Admin
            3 => '/welcome',                    // Customer
            4 => '/resort-bookings',            // Resort
            5 => '/ubaap-dashboard',            // UBAAP (Boat operator)
            6 => '/booking-management',         // Hotel
            7 => '/restaurant-portal',          // Restaurant
            8 => '/landing-area-dashboard',     // Landing Area Admin
            default => '/dashboard',            // Default fallback
        };
    }
}
