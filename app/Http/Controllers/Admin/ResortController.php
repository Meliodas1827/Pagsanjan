<?php

namespace App\Http\Controllers\Admin;

use App\Models\Resort;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResortController extends Controller
{
    public function index()
    {
        $resorts = Resort::getResorts();

        return Inertia::render('resort/ResortManagement', [
            'resorts' => $resorts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resort_name' => 'required|string|max:255',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'payment_qr' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/resorts'), $imageName);
            $validated['img'] = '/uploads/resorts/' . $imageName;
        }

        // Handle QR code upload
        if ($request->hasFile('payment_qr')) {
            $qrImage = $request->file('payment_qr');
            $qrImageName = time() . '_qr_' . $qrImage->getClientOriginalName();
            $qrImage->move(public_path('uploads/resorts/qrcodes'), $qrImageName);
            $validated['payment_qr'] = '/uploads/resorts/qrcodes/' . $qrImageName;
        }

        Resort::create($validated);

        return redirect()->route('manage-resort.index')->with('success', 'Resort created successfully!');
    }

    public function update(Request $request, Resort $resort)
    {
        $validated = $request->validate([
            'resort_name' => 'required|string|max:255',
            'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'payment_qr' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('img')) {
            // Delete old image if exists
            if ($resort->img && file_exists(public_path($resort->img))) {
                unlink(public_path($resort->img));
            }

            $image = $request->file('img');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/resorts'), $imageName);
            $validated['img'] = '/uploads/resorts/' . $imageName;
        }

        // Handle QR code upload
        if ($request->hasFile('payment_qr')) {
            // Delete old QR code if exists
            if ($resort->payment_qr && file_exists(public_path($resort->payment_qr))) {
                unlink(public_path($resort->payment_qr));
            }

            $qrImage = $request->file('payment_qr');
            $qrImageName = time() . '_qr_' . $qrImage->getClientOriginalName();
            $qrImage->move(public_path('uploads/resorts/qrcodes'), $qrImageName);
            $validated['payment_qr'] = '/uploads/resorts/qrcodes/' . $qrImageName;
        }

        $resort->update($validated);

        return redirect()->route('manage-resort.index')->with('success', 'Resort updated successfully!');
    }

    public function destroy(Resort $resort)
    {
        $resort->update(['deleted' => 1]);

        return redirect()->route('manage-resort.index')->with('success', 'Resort deleted successfully!');
    }

    public function toggleStatus(Resort $resort)
    {
        $resort->update(['deleted' => $resort->deleted ? 0 : 1]);

        return redirect()->route('manage-resort.index')->with('success', $resort->deleted ? 'Resort disabled successfully!' : 'Resort enabled successfully!');
    }
}
