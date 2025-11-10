<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LandingArea extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'location',
        'address',
        'is_active',
        'capacity',
        'image',
        'payment_qr',
        'price',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function boatBookings()
    {
        return $this->hasMany(BoatBooking::class, 'landing_area_id');
    }

    public function requests()
    {
        return $this->hasMany(LandingAreaRequest::class, 'landing_area_id');
    }
}
