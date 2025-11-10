<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'transaction_ref',
        'amount_paid',
        'payment_date',
        'payment_method',
        'payment_type',
        'payment_status'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function refund()
    {
        return $this->hasOne(Refund::class);
    }

    protected static function booted()
    {
        static::creating(function ($payment) {
            $lastPayment = self::latest('id')->first();
            $nextNumber = $lastPayment ? $lastPayment->id + 1 : 1;
            $year = now()->year;
            $prefix = 'PGSJN';
            $payment->transaction_ref = sprintf("%s%s-%06d", $prefix, $year, $nextNumber);
        });
    }
}
