<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationType extends Model
{
    protected $fillable = [
        'reservation_type',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
