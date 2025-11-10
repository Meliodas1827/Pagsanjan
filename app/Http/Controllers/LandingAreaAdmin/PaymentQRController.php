<?php

namespace App\Http\Controllers\LandingAreaAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentQRController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $landingArea = $user->landingArea;

        return Inertia::render('landing-area-admin/PaymentQR', [
            'landingArea' => $landingArea,
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'payment_qr' => 'required|image|mimes:jpeg,png,jpg|max:4096',
        ]);

        $user = auth()->user();
        $landingArea = $user->landingArea;

        if (!$landingArea) {
            return redirect()->back()->with('error', 'No landing area assigned to your account');
        }

        // Delete old QR code if exists
        if ($landingArea->payment_qr) {
            Storage::disk('public')->delete($landingArea->payment_qr);
        }

        // Upload new QR code
        $path = $request->file('payment_qr')->store('payment-qr', 'public');

        $landingArea->update([
            'payment_qr' => $path,
        ]);

        return redirect()->back()->with('success', 'Payment QR code uploaded successfully');
    }

    public function delete()
    {
        $user = auth()->user();
        $landingArea = $user->landingArea;

        if (!$landingArea) {
            return redirect()->back()->with('error', 'No landing area assigned to your account');
        }

        if (!$landingArea->payment_qr) {
            return redirect()->back()->with('error', 'No payment QR code to delete');
        }

        // Delete QR code from storage
        Storage::disk('public')->delete($landingArea->payment_qr);

        // Update database
        $landingArea->update([
            'payment_qr' => null,
        ]);

        return redirect()->back()->with('success', 'Payment QR code deleted successfully');
    }
}
