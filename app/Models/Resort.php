<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resort extends Model
{
    protected $fillable = [
        'resort_name',
        'img',
        'payment_qr',
        'deleted',
    ];

    public static function getResorts()
    {
        return self::all();
    }
}
