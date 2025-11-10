<?php

namespace App\Http\Controllers\Resort;

use App\Http\Controllers\Controller;
use App\Models\Resort;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResortPaymentQRController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $resortId = $user->resort_id;

        if (!$resortId) {
            return redirect()->back()->with('error', 'No resort assigned to your account');
        }

        $resort = Resort::findOrFail($resortId);

        return Inertia::render('resort/PaymentQR', [
            'resort' => [
                'id' => $resort->id,
                'resort_name' => $resort->resort_name,
                'payment_qr' => $resort->payment_qr ? asset('storage/' . $resort->payment_qr) : null,
            ],
        ]);
    }

    public function updateQrCode(Request $request, Resort $resort)
    {
        $user = auth()->user();

        // Ensure user can only update their own resort
        if ($user->resort_id !== $resort->id) {
            return redirect()->back()->with('error', 'Unauthorized action');
        }

        $validated = $request->validate([
            'payment_qr' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old QR code if exists
        if ($resort->payment_qr && \Storage::disk('public')->exists($resort->payment_qr)) {
            \Storage::disk('public')->delete($resort->payment_qr);
        }

        // Store new QR code
        $path = $request->file('payment_qr')->store('qr_codes', 'public');

        $resort->update([
            'payment_qr' => $path,
        ]);

        return redirect()->back()->with('success', 'QR code updated successfully');
    }
}
