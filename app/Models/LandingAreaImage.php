<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingAreaImage extends Model
{
    protected $fillable = [
        'landing_area_id',
        'image_path',
        'caption',
        'order',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'order' => 'integer',
    ];

    public function landingArea()
    {
        return $this->belongsTo(LandingArea::class);
    }
}
