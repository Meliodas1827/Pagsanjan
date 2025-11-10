<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoatPricing extends Model
{
       protected $fillable = ['price_per_adult', 'price_per_child'];
}
