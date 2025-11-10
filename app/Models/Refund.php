<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Refund extends Model
{
    protected $fillable = [
        'booking_id',
        'payment_id',
        'original_amount',
        'refund_amount',
        'status',
        'reason',
        'approved_at'
    ];

    protected $casts = [
        'original_amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    // Calculate 70% refund
    public static function calculateRefund($originalAmount)
    {
        return $originalAmount * 0.70;
    }
}