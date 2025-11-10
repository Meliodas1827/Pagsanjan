<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentQrCodeController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get the hotel assigned to this user
        $hotel = Hotel::where('id', $user->hotelid)
            ->where('isdeleted', 0)
            ->first();

        if (!$hotel) {
            return redirect()->route('dashboard')
                ->with('error', 'No hotel assigned to your account. Please contact administrator.');
        }

        return Inertia::render('hotel/PaymentQrCode', [
            'hotel' => [
                'id' => $hotel->id,
                'hotel_name' => $hotel->hotel_name,
                'qrcode_image_payment' => $hotel->qrcode_image_payment,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $hotel = Hotel::where('id', $user->hotelid)
            ->where('isdeleted', 0)
            ->first();

        if (!$hotel) {
            return back()->withErrors(['error' => 'No hotel assigned to your account.']);
        }

        $validated = $request->validate([
            'qrcode_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle QR code upload
        if ($request->hasFile('qrcode_image')) {
            // Delete old QR code if exists
            if ($hotel->qrcode_image_payment && file_exists(public_path($hotel->qrcode_image_payment))) {
                unlink(public_path($hotel->qrcode_image_payment));
            }

            $image = $request->file('qrcode_image');
            $imageName = time() . '_qr_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/hotels/qrcodes'), $imageName);

            $hotel->update(['qrcode_image_payment' => '/uploads/hotels/qrcodes/' . $imageName]);
        }

        return back()->with('success', 'Payment QR Code updated successfully!');
    }
}
