<?php

namespace App\Http\Controllers\Resort;

use App\Http\Controllers\Controller;
use App\Models\EntranceFee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResortEntranceFeeController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $resortId = $user->resort_id;

        if (!$resortId) {
            return redirect()->back()->with('error', 'No resort assigned to your account');
        }

        // Get entrance fees for this resort
        $entranceFees = EntranceFee::where('resort_id', $resortId)
            ->orderBy('category')
            ->get();

        // If no fees exist, create default ones
        if ($entranceFees->isEmpty()) {
            $defaultFees = [
                ['category' => 'Adult', 'description' => 'Regular entrance fee for adults (13+ years)', 'amount' => 100.00],
                ['category' => 'Child', 'description' => 'Entrance fee for children (3-12 years)', 'amount' => 50.00],
                ['category' => 'Senior', 'description' => 'Discounted fee for senior citizens (60+ years)', 'amount' => 80.00],
                ['category' => 'PWD', 'description' => 'Discounted fee for persons with disability', 'amount' => 80.00],
            ];

            foreach ($defaultFees as $fee) {
                EntranceFee::create([
                    'resort_id' => $resortId,
                    'category' => $fee['category'],
                    'description' => $fee['description'],
                    'amount' => $fee['amount'],
                ]);
            }

            $entranceFees = EntranceFee::where('resort_id', $resortId)->get();
        }

        return Inertia::render('resort/EntranceFee', [
            'entrance_fees' => $entranceFees,
            'resort' => [
                'id' => $resortId,
                'resort_name' => $user->resort->resort_name ?? 'Resort',
            ],
        ]);
    }

    public function update(Request $request, EntranceFee $fee)
    {
        $user = auth()->user();

        // Ensure user can only update their own resort's fees
        if ($user->resort_id !== $fee->resort_id) {
            return redirect()->back()->with('error', 'Unauthorized action');
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $fee->update([
            'amount' => $validated['amount'],
        ]);

        return redirect()->back()->with('success', 'Entrance fee updated successfully');
    }
}
