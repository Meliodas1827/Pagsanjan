<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'resort_id',
        'hotelid',
        'restoid',
        'landing_area_id',
        'phone',
        'address'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

     public function boatbookings()
    {
        return $this->hasMany(BoatBooking::class);
    }

    public function guest(){
        return $this->hasOne(Guest::class);
    }

    public function hotel(){
        return $this->belongsTo(Hotel::class, 'hotelid');
    }

    public function hotels(){
        return $this->hasMany(Hotel::class);
    }

    public function restaurant(){
        return $this->belongsTo(Resto::class, 'restoid');
    }

    public function landingArea(){
        return $this->belongsTo(LandingArea::class, 'landing_area_id');
    }

    public function resort(){
        return $this->belongsTo(Resort::class, 'resort_id');
    }
}
