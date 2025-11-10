<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;


class GeneralReportController extends Controller
{

    public function index(){
        return Inertia::render('hotel/GeneralReport');
    }
}
