<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelList extends Controller
{
    public function index()
    {
        return Inertia::render('customer/HotelList');
    }
}
