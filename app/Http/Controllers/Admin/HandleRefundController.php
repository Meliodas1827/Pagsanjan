<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Refund;
use Illuminate\Http\Request;

class HandleRefundController extends Controller
{
    public function handleRefund(Request $request)
    {
        $validated = $request->validate([
            'refund_id' => 'required|integer',
            // 'amount' => 'required|integer' 
        ]);

        try {
            $refund = Refund::find($validated['refund_id']);

            if (!$refund) {
                return redirect()->back()->with('error', 'Refund not found.');
            }

            $refund->update([
                'approved_at' => now(),
                'status' => 'completed'
            ]);

            return redirect()->back()->with('ok', true);

        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
