<?php

namespace Database\Seeders;

use App\Models\EmailConfiguration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmailConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if email configuration already exists
        if (EmailConfiguration::count() > 0) {
            $this->command->info('Email configuration already exists. Skipping...');
            return;
        }

        // Create default email configuration
        // This uses Mailtrap for testing - update through admin panel for production
        EmailConfiguration::create([
            'mail_mailer' => 'smtp',
            'mail_host' => env('MAIL_HOST', 'sandbox.smtp.mailtrap.io'),
            'mail_port' => env('MAIL_PORT', 2525),
            'mail_username' => env('MAIL_USERNAME', ''),
            'mail_password' => env('MAIL_PASSWORD', ''),
            'mail_encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'mail_from_address' => env('MAIL_FROM_ADDRESS', 'noreply@pagsanjan.com'),
            'mail_from_name' => env('MAIL_FROM_NAME', 'Pagsanjan Falls Resort'),
            'is_active' => true,
        ]);

        $this->command->info('Default email configuration created successfully!');
        $this->command->warn('Please update the email configuration through the admin panel with your actual SMTP credentials.');
    }
}
