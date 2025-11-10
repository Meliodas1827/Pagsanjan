<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        // id, place, sched, no_of_guest, guest_name, price, payment_method, payment_status booking_status for resort/hotel/landing-area/restaurant
        //resort 
        return Inertia::render('admin/Reservation');
    }


    public function getReservationData()
    {
        $ReservationData = Booking::select(
            'bookings.id',
            'bookings.reference_id',
            'bookings.check_in_date',
            'bookings.check_out_date',
            'bookings.total_price',
            'bookings.booking_status',
            'bookings.no_of_adults',
            'bookings.no_of_children',
            'hotels.hotel_name',
            'rooms.room_name',
            'users.name as guest_name',
            'users.email as guest_email'
        )
            ->join('users', 'bookings.userid', '=', 'users.id')
            ->join('hotels', 'bookings.hotelid', '=', 'hotels.id')
            ->join('rooms', 'bookings.roomid', '=', 'rooms.id')
            ->orderBy('bookings.created_at', 'desc')
            ->get();

        return response()->json($ReservationData);
    }
}
