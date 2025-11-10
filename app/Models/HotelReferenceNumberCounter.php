<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelReferenceNumberCounter extends Model
{
    protected $table = "hotel_reference_number_counter";
    protected $fillable = ['datetoday', 'counter'];
    public $timestamps = false;
}
