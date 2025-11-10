<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomInventory extends Model
{
    use HasFactory;

    protected $table = 'room_inventory';

    protected $fillable = [
        'room_id',
        'room_number',
        'room_code',
        'status',
        'notes',
        'last_maintenance_date',
        'next_maintenance_date',
        'status_changed_at',
        'status_changed_by',
    ];

    protected $casts = [
        'last_maintenance_date' => 'datetime',
        'next_maintenance_date' => 'datetime',
        'status_changed_at' => 'datetime',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}

