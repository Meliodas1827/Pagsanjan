<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class EmailAccountService
{
    public function sendAccountCredentials(string $email, string $password)
    {
        // For now, log the credentials instead of sending
        Log::info("New account created", [
            'email' => $email,
            'password' => $password,
        ]);

        // Later, replace this with Mail::to($email)->send(new AccountCreatedMail(...));
    }
}
