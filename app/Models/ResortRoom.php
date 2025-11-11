<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResortRoom extends Model
{
       use HasFactory;
    protected $fillable = [
        'resort_id',
        'resort_name',
        'description',
        'capacity',
        'price_per_day',
        'image_url',
        'contact',
        'resort_email',
        'status',
        'pax',
        'amenities',
    ];

    protected $casts = [
        'amenities' => 'array',
        'price_per_day' => 'decimal:2',
    ];

    public function resort()
    {
        return $this->belongsTo(Resort::class);
    }

    public function resortBookings()
    {
        return $this->hasMany(ResortBooking::class);
    }
}
