<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomImage extends Model
{
    use HasFactory;

    protected $table = 'room_images';

    protected $fillable = [
        'room_id',
        'image_path',
        'image_name',
        'caption',
        'alt_text',
        'image_type',
        'sort_order',
        'mime_type',
        'file_size',
        'width',
        'height',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}

