<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResortBooking extends Model
{
    protected $fillable = [
        'resort_room_id',
        'user_booker',
        'resort_id',
        'status',
        'payment_proof',
        'date_checkin',
        'date_checkout',
        'adults',
        'children',
        'pwd',
        'senior',
        'amount',
    ];

    protected $casts = [
        'date_checkin' => 'date',
        'date_checkout' => 'date',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function resortRoom()
    {
        return $this->belongsTo(ResortRoom::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_booker');
    }

    public function resort()
    {
        return $this->belongsTo(Resort::class);
    }
}
