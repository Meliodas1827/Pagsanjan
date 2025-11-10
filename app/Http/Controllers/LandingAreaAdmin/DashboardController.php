<?php

namespace App\Http\Controllers\LandingAreaAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $landingArea = $user->landingArea;

        return Inertia::render('landing-area-admin/Dashboard', [
            'landingArea' => $landingArea,
        ]);
    }
}
