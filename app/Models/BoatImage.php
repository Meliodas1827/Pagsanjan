<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoatImage extends Model
{
    protected $fillable = [
        'boat_id',
        'image_path',
        'caption',
        'order',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'order' => 'integer',
    ];

    public function boat()
    {
        return $this->belongsTo(Boat::class);
    }
}
