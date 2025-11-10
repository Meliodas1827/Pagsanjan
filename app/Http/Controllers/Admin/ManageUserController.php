<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\LandingArea;
use App\Models\Resort;
use App\Models\Resto;
use App\Models\User;
use App\Services\EmailAccountService;
use Illuminate\Http\Request; // Fixed import
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class ManageUserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = User::with('role')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('role', function ($q) use ($search) {
                        $q->where('role_name', 'like', "%{$search}%");
                    });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $hotels = Hotel::where('isdeleted', 0)->get(['id', 'hotel_name']);
        $restaurants = Resto::where('deleted', 0)->get(['id', 'resto_name']);
        $landingAreas = LandingArea::where('is_active', 1)->get(['id', 'name']);
        $resorts = Resort::where('deleted', 0)->get(['id', 'resort_name']);

        return Inertia::render('admin/ManageUser', [
            'users' => $users,
            'hotels' => $hotels,
            'restaurants' => $restaurants,
            'landingAreas' => $landingAreas,
            'resorts' => $resorts,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request, EmailAccountService $accountMailer)
    {
        // Determine if entity fields are required based on role
        $isEntityRole = in_array($request->role, ['4', '5', '6']);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,id',
            'entity_name' => $isEntityRole ? 'required|string|max:255' : 'nullable|string|max:255',
            'entity_description' => 'nullable|string|max:1000',
            'location' => $isEntityRole ? 'required|string|max:255' : 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // use password from request
        $password = $validated['password'];

        // store image (if provided)
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }

        // create user with verified email
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role'],
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        // role-based entity creation
        $convertedRole = (int) $validated['role'];
        switch ($convertedRole) {
            case 4:
                // something
                break;

            case 5:
                // something
                break;

            case 6:
                Hotel::create([
                    'hotel_name' => $validated['entity_name'],
                    'location' => $validated['location'],
                    'description' => $validated['entity_description'],
                    'image_url' => $imagePath,
                    'user_id' => $user->id,
                ]);
                break;

            case 7:
                // Restaurant role
                Resto::create([
                    'resto_name' => $validated['entity_name'],
                    'user_id' => $user->id,
                ]);
                break;
        }

        // send credentials
        $accountMailer->sendAccountCredentials($user->email, $password);

        return redirect()->back()->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|exists:roles,id',
            'resort_id' => 'nullable|exists:resorts,id',
            'hotelid' => 'nullable|exists:hotels,id',
            'restoid' => 'nullable|exists:resto,id',
            'landing_area_id' => 'nullable|exists:landing_areas,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role'],
        ];

        // Only set resort_id if role is Resort (4)
        if ($validated['role'] == '4') {
            $updateData['resort_id'] = $validated['resort_id'] ?? null;
            $updateData['hotelid'] = null;
            $updateData['restoid'] = null;
            $updateData['landing_area_id'] = null;
        }
        // Only set hotelid if role is Hotel (6)
        elseif ($validated['role'] == '6') {
            $updateData['hotelid'] = $validated['hotelid'] ?? null;
            $updateData['resort_id'] = null;
            $updateData['restoid'] = null;
            $updateData['landing_area_id'] = null;
        }
        // Only set restoid if role is Restaurant (7)
        elseif ($validated['role'] == '7') {
            $updateData['restoid'] = $validated['restoid'] ?? null;
            $updateData['resort_id'] = null;
            $updateData['hotelid'] = null;
            $updateData['landing_area_id'] = null;
        }
        // Only set landing_area_id if role is Landing Area (8)
        elseif ($validated['role'] == '8') {
            $updateData['landing_area_id'] = $validated['landing_area_id'] ?? null;
            $updateData['resort_id'] = null;
            $updateData['hotelid'] = null;
            $updateData['restoid'] = null;
        }
        else {
            $updateData['resort_id'] = null;
            $updateData['hotelid'] = null;
            $updateData['restoid'] = null;
            $updateData['landing_area_id'] = null;
        }

        $user->update($updateData);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        // Check if user is trying to delete themselves
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account');
        }

        // Delete user
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }
}