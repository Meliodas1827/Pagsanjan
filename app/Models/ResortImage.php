<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResortImage extends Model
{
    protected $fillable = [
        'resort_id',
        'image_path',
        'caption',
        'order',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'order' => 'integer',
    ];

    public function resort()
    {
        return $this->belongsTo(Resort::class);
    }
}
