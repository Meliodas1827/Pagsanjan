<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'hotel_name',
        'location',
        'description',
        'total_rooms',
        'image_url',
        'qrcode_image_payment',
        'isdeleted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function HotelRooms()
    {
        return $this->hasMany(HotelRoom::class);
    }

    public function hotelImages()
    {
        return $this->hasMany(HotelImage::class, 'hotelid');
    }

    public static function getHotels()
    {
        return self::with('hotelImages')->get();
    }
}
