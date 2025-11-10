<?php

namespace App\Http\Controllers;

use App\Models\EmailConfiguration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class EmailConfigurationController extends Controller
{
    public function index()
    {
        $config = EmailConfiguration::getActive();

        return Inertia::render('admin/email-configuration/index', [
            'emailConfig' => $config,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mail_host' => 'required|string',
            'mail_port' => 'required|integer',
            'mail_username' => 'required|string',
            'mail_password' => 'required|string',
            'mail_encryption' => 'required|in:tls,ssl',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Deactivate all existing configurations
        EmailConfiguration::query()->update(['is_active' => false]);

        // Create new configuration
        EmailConfiguration::create([
            'mail_mailer' => 'smtp',
            'mail_host' => $request->mail_host,
            'mail_port' => $request->mail_port,
            'mail_username' => $request->mail_username,
            'mail_password' => $request->mail_password,
            'mail_encryption' => $request->mail_encryption,
            'mail_from_address' => $request->mail_from_address,
            'mail_from_name' => $request->mail_from_name,
            'is_active' => true,
        ]);

        return redirect()->route('email-configuration.index')
            ->with('message', 'Email configuration saved successfully!');
    }

    public function update(Request $request, EmailConfiguration $emailConfiguration)
    {
        $validator = Validator::make($request->all(), [
            'mail_host' => 'required|string',
            'mail_port' => 'required|integer',
            'mail_username' => 'required|string',
            'mail_password' => 'nullable|string',
            'mail_encryption' => 'required|in:tls,ssl',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = [
            'mail_host' => $request->mail_host,
            'mail_port' => $request->mail_port,
            'mail_username' => $request->mail_username,
            'mail_encryption' => $request->mail_encryption,
            'mail_from_address' => $request->mail_from_address,
            'mail_from_name' => $request->mail_from_name,
        ];

        // Only update password if provided
        if ($request->filled('mail_password')) {
            $data['mail_password'] = $request->mail_password;
        }

        $emailConfiguration->update($data);

        return redirect()->route('email-configuration.index')
            ->with('message', 'Email configuration updated successfully!');
    }
}
