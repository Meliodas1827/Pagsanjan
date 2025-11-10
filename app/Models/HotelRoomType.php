<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelRoomType extends Model
{
    protected $fillable = [
       'room_type',
       'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function rooms()
    {
        return $this->hasMany(HotelRoom::class, 'room_type_id');
    }

    // Scope to get only active room types
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
