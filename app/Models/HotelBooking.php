<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelBooking extends Model
{
    protected $fillable = [
        'hotelid',
        'roomid',
        'boatbookingid',
        'status',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotelid');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'roomid');
    }

    public function boatBooking()
    {
        return $this->belongsTo(BoatBooking::class, 'boatbookingid');
    }
}
