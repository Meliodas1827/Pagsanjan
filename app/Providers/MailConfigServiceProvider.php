<?php

namespace App\Providers;

use App\Models\EmailConfiguration;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;

class MailConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            $emailConfig = EmailConfiguration::getActive();

            if ($emailConfig) {
                Config::set('mail.default', 'smtp');
                Config::set('mail.mailers.smtp.transport', 'smtp');
                Config::set('mail.mailers.smtp.host', $emailConfig->mail_host);
                Config::set('mail.mailers.smtp.port', $emailConfig->mail_port);
                Config::set('mail.mailers.smtp.encryption', $emailConfig->mail_encryption);
                Config::set('mail.mailers.smtp.username', $emailConfig->mail_username);
                Config::set('mail.mailers.smtp.password', $emailConfig->mail_password);
                Config::set('mail.from.address', $emailConfig->mail_from_address);
                Config::set('mail.from.name', $emailConfig->mail_from_name);

                \Log::info('Email configuration loaded from database', [
                    'host' => $emailConfig->mail_host,
                    'from' => $emailConfig->mail_from_address,
                ]);
            } else {
                \Log::warning('No active email configuration found in database');
            }
        } catch (\Exception $e) {
            \Log::error('Failed to load email configuration', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
