<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelImage extends Model
{
    protected $fillable = [
        'hotelid',
        'hotel_room_type_id',
        'image_url'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function roomType()
    {
        return $this->belongsTo(HotelRoomType::class, 'hotel_room_type_id');
    }
}
