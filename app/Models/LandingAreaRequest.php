<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LandingAreaRequest extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'landing_area_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'pickup_date',
        'pickup_time',
        'number_of_adults',
        'number_of_children',
        'boat_id',
        'total_amount',
        'landing_area_fee',
        'status',
        'special_requirements',
        'admin_notes',
        'is_paid',
        'payment_proof',
    ];

    protected $casts = [
        'pickup_date' => 'date',
        'pickup_time' => 'datetime',
        'total_amount' => 'decimal:2',
        'landing_area_fee' => 'decimal:2',
        'is_paid' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function landingArea()
    {
        return $this->belongsTo(LandingArea::class);
    }

    public function boat()
    {
        return $this->belongsTo(Boat::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeForLandingArea($query, $landingAreaId)
    {
        return $query->where('landing_area_id', $landingAreaId);
    }

    // Accessors
    public function getTotalPeopleAttribute()
    {
        return $this->number_of_adults + $this->number_of_children;
    }

    public function getStatusBadgeColorAttribute()
    {
        return match($this->status) {
            'pending' => 'yellow',
            'confirmed' => 'blue',
            'assigned' => 'purple',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray',
        };
    }
}
