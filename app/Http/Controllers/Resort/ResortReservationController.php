<?php

namespace App\Http\Controllers\Resort;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResortReservationController extends Controller
{
     public function index(){
        return Inertia::render('resort/Reservation');
    
    }
}
