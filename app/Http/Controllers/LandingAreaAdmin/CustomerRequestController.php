<?php

namespace App\Http\Controllers\LandingAreaAdmin;

use App\Http\Controllers\Controller;
use App\Mail\LandingAreaStatusUpdated;
use App\Models\LandingAreaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomerRequestController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $landingAreaId = $user->landing_area_id;

        // Get customer requests for this landing area
        $requests = LandingAreaRequest::with(['user', 'boat', 'landingArea'])
            ->forLandingArea($landingAreaId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('landing-area-admin/CustomerRequests', [
            'requests' => $requests,
            'landingArea' => $user->landingArea,
        ]);
    }

    public function updateStatus(Request $request, LandingAreaRequest $landingAreaRequest)
    {
        // Verify that the request belongs to the landing area admin's landing area
        $user = auth()->user();
        if ($landingAreaRequest->landing_area_id !== $user->landing_area_id) {
            return back()->with('error', 'Unauthorized action');
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'confirmed', 'assigned', 'completed', 'cancelled'])],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Store old status for email notification
        $oldStatus = $landingAreaRequest->status;
        $newStatus = $validated['status'];

        $landingAreaRequest->update([
            'status' => $newStatus,
            'admin_notes' => $validated['admin_notes'] ?? $landingAreaRequest->admin_notes,
        ]);

        // Load relationships for email
        $landingAreaRequest->load(['landingArea', 'boat']);

        // Send email notification to customer
        if ($landingAreaRequest->customer_email) {
            Mail::to($landingAreaRequest->customer_email)
                ->send(new LandingAreaStatusUpdated($landingAreaRequest, $oldStatus, $newStatus));
        } elseif ($landingAreaRequest->user && $landingAreaRequest->user->email) {
            Mail::to($landingAreaRequest->user->email)
                ->send(new LandingAreaStatusUpdated($landingAreaRequest, $oldStatus, $newStatus));
        }

        return back()->with('success', 'Request status updated successfully');
    }
}
