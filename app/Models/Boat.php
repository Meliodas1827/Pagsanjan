<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Boat extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'boat_no',
        'bankero_name',
        'capacity',
        'available_slot',
        'price_per_adult',
        'price_per_child',
        'status',
        'image',
    ];

    public function boatBookings()
    {
        return $this->hasMany(BoatBooking::class);
    }
}
