<?php

namespace App\Http\Controllers\Ubaap;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;


class MessageController extends Controller
{
    public function index(){
        return Inertia::render('ubaap/Message');
    
    }
}
