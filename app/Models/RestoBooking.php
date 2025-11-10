<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestoBooking extends Model
{
    protected $table = 'resto_booking';

    protected $fillable = [
        'resto_id',
        'resto_table_id',
        'is_book_confirmed',
        'confirmed_by',
        'user_id_booker',
        'no_of_guest',
        'is_paid',
        'payment_proof',
        'deleted',
    ];

    protected $casts = [
        'is_book_confirmed' => 'boolean',
        'is_paid' => 'boolean',
    ];

    public function resto()
    {
        return $this->belongsTo(Resto::class, 'resto_id');
    }

    public function restoTable()
    {
        return $this->belongsTo(RestoTable::class, 'resto_table_id');
    }

    public function booker()
    {
        return $this->belongsTo(User::class, 'user_id_booker');
    }

    public function confirmedBy()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}
