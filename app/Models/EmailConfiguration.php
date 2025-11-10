<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailConfiguration extends Model
{
    protected $fillable = [
        'mail_mailer',
        'mail_host',
        'mail_port',
        'mail_username',
        'mail_password',
        'mail_encryption',
        'mail_from_address',
        'mail_from_name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'mail_password',
    ];

    public static function getActive()
    {
        return self::where('is_active', true)->first();
    }
}
