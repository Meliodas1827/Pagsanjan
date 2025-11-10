<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HotelRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'room_no',
        'description',
        'room_type',
        'capacity',
        'price_per_night',
        'image_url',
        'status',
        'amenities',
        'is_posted'
    ];

    /**
     * Relationship: A room belongs to a hotel
     */
    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
