<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'category',
        'feature_name',
        'feature_value',
        'description',
        'sort_order',
        'icon',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
