<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntranceFee extends Model
{
    protected $fillable = [
        'resort_id',
        'category',
        'description',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function resort()
    {
        return $this->belongsTo(Resort::class);
    }
}
