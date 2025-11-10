<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resto extends Model
{
    protected $table = 'resto';

    protected $fillable = [
        'user_id',
        'resto_name',
        'img',
        'payment_qr',
        'deleted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function restoTables()
    {
        return $this->hasMany(RestoTable::class, 'resto_id');
    }

    public function restoBookings()
    {
        return $this->hasMany(RestoBooking::class, 'resto_id');
    }

    public static function getRestos()
    {
        return self::with('restoTables')->get();
    }
}
