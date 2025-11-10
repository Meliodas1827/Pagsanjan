<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoatBooking extends Model
{ //
    protected $fillable = [
        'user_id',
        // 'customer_name',
        'date_of_booking', //time and date
        'ride_time',
        'boat_id',
        'landing_area_id',
        'total_amount',
        'no_of_adults',
        'no_of_children',
        'is_walk_in',
        'status',
        'created_by',
    ];

     public function user()
    {
        return $this->belongsTo(User::class);
    }

      public function boat()
    {
        return $this->belongsTo(Boat::class);
    }

    public function landingArea()
    {
        return $this->belongsTo(LandingArea::class);
    }

    /**
     * Restore available slots to the boat when booking is completed
     */
    public function restoreBoatSlots()
    {
        if ($this->boat_id && in_array($this->status, ['completed', 'cancelled'])) {
            $boat = $this->boat;
            if ($boat) {
                $totalGuests = $this->no_of_adults + $this->no_of_children;

                // Restore available slots
                $boat->increment('available_slot', $totalGuests);

                // Update boat status to available if it was booked
                if ($boat->available_slot > 0 && $boat->status === 'booked') {
                    $boat->update(['status' => 'available']);
                }
            }
        }
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // When booking status is updated to completed or cancelled, restore slots
        static::updated(function ($booking) {
            if ($booking->isDirty('status') && in_array($booking->status, ['completed', 'cancelled'])) {
                $booking->restoreBoatSlots();
            }
        });
    }
}
