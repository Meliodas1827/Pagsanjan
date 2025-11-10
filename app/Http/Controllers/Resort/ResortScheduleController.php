<?php

namespace App\Http\Controllers\Resort;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ResortScheduleController extends Controller
{
    public function index(){
        return Inertia::render('resort/ResortSchedule');
    
    }
}
