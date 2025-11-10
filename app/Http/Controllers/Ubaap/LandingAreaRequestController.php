<?php

namespace App\Http\Controllers\Ubaap;

use App\Http\Controllers\Controller;
use App\Mail\LandingAreaStatusUpdated;
use App\Models\Boat;
use App\Models\LandingAreaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LandingAreaRequestController extends Controller
{
    public function index()
    {
        // Get all confirmed landing area requests (status: confirmed)
        // UBAAP needs to see these to assign boats
        $requests = LandingAreaRequest::with(['user', 'boat', 'landingArea'])
            ->whereIn('status', ['confirmed', 'assigned', 'completed'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Get all available boats for assignment (status = 'available' and has available slots)
        $boats = Boat::where('status', 'available')
            ->where('available_slot', '>', 0)
            ->orderBy('boat_no')
            ->get();

        return Inertia::render('ubaap/LandingAreaRequests', [
            'requests' => $requests,
            'boats' => $boats,
        ]);
    }

    public function assignBoat(Request $request, LandingAreaRequest $landingAreaRequest)
    {
        $validated = $request->validate([
            'boat_id' => ['required', 'exists:boats,id'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Get the selected boat
        $boat = Boat::findOrFail($validated['boat_id']);

        // Calculate total guests
        $totalGuests = $landingAreaRequest->number_of_adults + $landingAreaRequest->number_of_children;

        // Check if boat has enough available slots
        if ($boat->available_slot < $totalGuests) {
            return back()->with('error', 'Boat does not have enough available slots for this booking.');
        }

        // If reassigning, restore the previous boat's slots
        if ($landingAreaRequest->boat_id) {
            $previousBoat = Boat::find($landingAreaRequest->boat_id);
            if ($previousBoat) {
                $previousTotalGuests = $landingAreaRequest->number_of_adults + $landingAreaRequest->number_of_children;
                $previousBoat->increment('available_slot', $previousTotalGuests);
            }
        }

        // Store old status for email notification
        $oldStatus = $landingAreaRequest->status;

        // Update the request
        $landingAreaRequest->update([
            'boat_id' => $validated['boat_id'],
            'status' => 'assigned',
            'admin_notes' => $validated['admin_notes'] ?? $landingAreaRequest->admin_notes,
        ]);

        // Decrease the boat's available slots
        $boat->decrement('available_slot', $totalGuests);

        // Load relationships for email
        $landingAreaRequest->load(['landingArea', 'boat']);

        // Send email notification to customer
        $newStatus = 'assigned';
        if ($landingAreaRequest->customer_email) {
            Mail::to($landingAreaRequest->customer_email)
                ->send(new LandingAreaStatusUpdated($landingAreaRequest, $oldStatus, $newStatus));
        } elseif ($landingAreaRequest->user && $landingAreaRequest->user->email) {
            Mail::to($landingAreaRequest->user->email)
                ->send(new LandingAreaStatusUpdated($landingAreaRequest, $oldStatus, $newStatus));
        }

        return back()->with('success', 'Boat assigned successfully');
    }

    public function updateStatus(Request $request, LandingAreaRequest $landingAreaRequest)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['confirmed', 'assigned', 'completed', 'cancelled'])],
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
