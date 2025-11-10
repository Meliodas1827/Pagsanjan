<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomPricing extends Model
{
    use HasFactory;

    protected $table = 'room_pricing';

    protected $fillable = [
        'room_id',
        'season',
        'price_per_night',
        'currency',
        'valid_from',
        'valid_to',
        'weekend_price',
        'holiday_price',
        'early_bird_discount',
        'early_bird_days',
        'extended_stay_discount',
        'extended_stay_nights',
        'extra_adult_charge',
        'extra_child_charge',
        'is_active',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_to' => 'date',
        'is_active' => 'boolean',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}

