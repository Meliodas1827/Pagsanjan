<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Refund;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RefundController extends Controller
{
    public function index()
    {
        $refundData = Refund::select(
            'payments.transaction_ref',
            'bookings.service_date',
            'bookings.total_price as original_amount',
            'refunds.id',
            'refunds.refund_amount as refunded_amount',
            'refunds.created_at',
            'refunds.approved_at',
            'refunds.status',

            DB::raw("
                COALESCE(
                    resort_rooms.resort_name
                ) as booked_place
            "),
            //   hotels.hotel_name,
            //         restaurants.restaurant_name,
            //         landing_areas.area_name
            DB::raw("CONCAT(guests.first_name, ' ', guests.last_name) as guest_name"),
            'guests.phone'
        )
            ->join('payments', 'refunds.payment_id', '=', 'payments.id')
            ->join('bookings', 'payments.booking_id', '=', 'bookings.id')
            ->join('guests', 'bookings.guest_id', '=', 'guests.id')

            // joins for each type
            ->leftJoin('resort_bookings', 'bookings.id', '=', 'resort_bookings.booking_id')
            ->leftJoin('resort_rooms', 'resort_bookings.resort_room_id', '=', 'resort_rooms.id')

            // ->leftJoin('hotel_bookings', 'bookings.id', '=', 'hotel_bookings.booking_id')
            // ->leftJoin('hotels', 'hotel_bookings.hotel_id', '=', 'hotels.id')

            // ->leftJoin('restaurant_bookings', 'bookings.id', '=', 'restaurant_bookings.booking_id')
            // ->leftJoin('restaurants', 'restaurant_bookings.restaurant_id', '=', 'restaurants.id')

            // ->leftJoin('landing_area_bookings', 'bookings.id', '=', 'landing_area_bookings.booking_id')
            // ->leftJoin('landing_areas', 'landing_area_bookings.landing_area_id', '=', 'landing_areas.id')

            ->get();
            
        return Inertia::render('admin/RefundPage', [
            'refunds' => $refundData
        ]);
    }


    public function acceptRefund() {}
}
