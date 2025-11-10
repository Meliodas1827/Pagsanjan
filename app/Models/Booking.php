<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{


    protected $fillable = [
        'reference_id',
        'userid',
        'hotelid',
        'roomid',
        'requested_date',
        'no_of_adults',
        'no_of_children',
        'check_in_date',
        'check_out_date',
        'total_price',
        'booking_status',
        'check_in_time',
        'check_out_time',
        'notes',
    ];


    // App\Models\Booking.php
    protected $casts = [
        'requested_date' => 'datetime',
        'check_in_date'  => 'datetime',
        'check_out_date' => 'datetime',
        'check_in_time'  => 'datetime',
        'check_out_time' => 'datetime',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'userid');
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotelid');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'roomid');
    }

    public function reservationType()
    {
        return $this->belongsTo(ReservationType::class);
    }

    public function resortBookings()
    {
        return $this->hasMany(ResortBooking::class);
    }

    // Alternative: Many-to-many relationship with ResortRoom through pivot table
    public function resortRooms()
    {
        return $this->belongsToMany(ResortRoom::class, 'resort_bookings', 'booking_id', 'resort_room_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'id');
    }


    public function refund()
    {
        return $this->hasOne(Refund::class);
    }

    // Scope to filter bookings by hotel
    public function scopeForHotel($query, $hotelId)
    {
        return $query->where('hotelid', $hotelId);
    }
}
