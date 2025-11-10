<?php

namespace App\Services;

use App\Models\Payment;

class PaymentService
{
    public function savePayment(array $data)
    {
        return Payment::updateOrCreate(
            ['booking_id' => $data['booking_id']], // condition to update existing
            [
                'amount_paid'   => $data['amount'],
                'payment_date'  => now(),
                'payment_method'=> $data['payment_method'],
                'payment_type'  => $data['payment_type'] ?? 'down_payment',
                'payment_status'=> $data['payment_status'] ?? 'completed',
            ]
        );
    }
}
