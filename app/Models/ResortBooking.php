<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResortBooking extends Model
{
    protected $fillable = [
        'booking_id',
        'resort_room_id',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function resortRoom()
    {
        return $this->belongsTo(ResortRoom::class);
    }
}
