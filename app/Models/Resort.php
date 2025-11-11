<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resort extends Model
{
    protected $fillable = [
        'resort_name',
        'location',
        'description',
        'image',
        'img',
        'payment_qr',
        'deleted',
    ];

    public function resortRooms()
    {
        return $this->hasMany(ResortRoom::class, 'resort_id');
    }

    public function resortBookings()
    {
        return $this->hasMany(ResortBooking::class);
    }

    public static function getResorts()
    {
        return self::all();
    }
}
