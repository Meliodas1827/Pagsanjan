<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestoImage extends Model
{
    protected $fillable = [
        'resto_id',
        'image_path',
        'caption',
        'order',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'order' => 'integer',
    ];

    public function resto()
    {
        return $this->belongsTo(Resto::class);
    }
}
