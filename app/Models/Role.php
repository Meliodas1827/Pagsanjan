<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Role extends Model
{

    protected $fillable = [
        'role_name',
    ];
    
      public const ROLE_NAMES = [
         'admin' => 1,
         'staff' => 2,
         'customer' => 3,
         'resort' => 4,
         'ubaap' => 5,
         'hotel' => 6,
         'restaurant' => 7,
         'landing_area' => 8,
    ];

     public function users()
    {
        return $this->hasMany(User::class);
    }
}
