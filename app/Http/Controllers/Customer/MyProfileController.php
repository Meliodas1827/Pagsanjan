<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class MyProfileController extends Controller
{
    public function index(Request $request)
    {
        // return data
        $guest = $request->user()->guest;
        return Inertia::render('customer/Account', ['data' => $guest]);
    }

    public function create()
    {
        return Inertia::render('customer/MyProfile');
    }



    public function store(Request $request)
    {
        // dd($request);
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:40',
                'last_name'  => 'required|string|max:40',
                'address'    => 'required|string|max:100',
                'phone'      => 'required|string|max:40',
            ]);

            // Add logged-in user_id
            $validated['user_id'] = Auth::id();


            Guest::create($validated);

            return back()->with('message', 'Profile saved!');
        } catch (\Throwable $th) {
            dd($th->getMessage()); // For debugging
        }
    }
};
