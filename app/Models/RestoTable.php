<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestoTable extends Model
{
    protected $table = 'resto_tables';

    protected $fillable = [
        'resto_id',
        'status',
        'no_of_chairs',
        'price',
        'deleted',
    ];

    public function resto()
    {
        return $this->belongsTo(Resto::class, 'resto_id');
    }

    public function restoBookings()
    {
        return $this->hasMany(RestoBooking::class, 'resto_table_id');
    }
}
