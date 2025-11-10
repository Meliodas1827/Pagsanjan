<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'hotelid',
        'room_name',
        'room_type',
        'promo_label',
        'description',
        'location_details',
        'max_adults',
        'max_children',
        'children_age_limit',
        'room_size_sqm',
        'number_of_beds',
        'bed_type',
        'view_type',
        'bathroom_sinks',
        'has_rain_shower',
        'has_premium_toiletries',
        'has_algotherm_toiletries',
        'has_tv',
        'has_movie_channels',
        'has_wifi',
        'has_welcome_drink',
        'has_bottled_water',
        'has_mini_refrigerator',
        'building_name',
        'floor_number',
        'full_address',
        'main_image',
        'image_gallery',
        'is_active',
        'is_bookable',
    ];

    protected $casts = [
        'image_gallery' => 'array',
        'is_active' => 'boolean',
        'is_bookable' => 'boolean',
        'has_rain_shower' => 'boolean',
        'has_premium_toiletries' => 'boolean',
        'has_algotherm_toiletries' => 'boolean',
        'has_tv' => 'boolean',
        'has_movie_channels' => 'boolean',
        'has_wifi' => 'boolean',
        'has_welcome_drink' => 'boolean',
        'has_bottled_water' => 'boolean',
        'has_mini_refrigerator' => 'boolean',
    ];

    public function pricing()
    {
        return $this->hasMany(RoomPricing::class);
    }

    public function currentPrice()
    {
        return $this->hasOne(RoomPricing::class)
            ->where('is_active', true)
            ->where('season', 'regular')
            ->latest('valid_from');
    }
}
