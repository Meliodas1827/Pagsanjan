<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\BoatBooking;
use App\Models\Booking;
use App\Models\Hotel;
use App\Models\ResortBooking;
use App\Models\RestoBooking;
use App\Models\LandingAreaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request){
        $user = $request->user();

        // Redirect restaurant users to restaurant portal
        if ($user->role_id === 7) {
            return redirect()->route('restaurant-portal.index');
        }

        // Redirect customer users to my-bookings page
        if ($user->role_id === 3) {
            return redirect()->route('my.bookings');
        }

        // Initialize statistics
        $boatReservationStats = [];
        $roomReservationStats = [];
        $resortReservationStats = [];
        $restaurantReservationStats = [];
        $landingAreaReservationStats = [];
        $hotelMonthlyBookings = [];
        $hotelTotalBookings = 0;
        $hotelTotalGuests = 0;
        $adminTotalReservations = 0;
        $adminTotalRevenue = 0;
        $adminTodayReservations = 0;
        $adminTodayCheckIns = 0;
        $touristArrivalTrend = [];
        $recentReservations = [];

        // Admin Dashboard (role_id = 1)
        if ($user->role_id === 1) {
            // Boat reservation statistics - group by month
            $boatReservationStats = BoatBooking::select(
                DB::raw('MONTH(date_of_booking) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('date_of_booking', date('Y'))
            ->groupBy(DB::raw('MONTH(date_of_booking)'))
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('M', mktime(0, 0, 0, $item->month, 1)),
                    'count' => $item->count,
                ];
            });

            // Room reservation statistics per hotel
            $roomReservationStats = Booking::select(
                'hotels.hotel_name',
                DB::raw('COUNT(bookings.id) as count')
            )
            ->join('hotels', 'bookings.hotelid', '=', 'hotels.id')
            ->whereNotNull('bookings.hotelid')
            ->whereYear('bookings.check_in_date', date('Y'))
            ->groupBy('hotels.id', 'hotels.hotel_name')
            ->get()
            ->map(function ($item) {
                return [
                    'hotel_name' => $item->hotel_name,
                    'count' => $item->count,
                ];
            });

            // Resort reservation statistics per resort
            $resortReservationStats = ResortBooking::select(
                'resorts.resort_name',
                DB::raw('COUNT(resort_bookings.id) as count')
            )
            ->join('resorts', 'resort_bookings.resort_id', '=', 'resorts.id')
            ->whereYear('resort_bookings.date_checkin', date('Y'))
            ->groupBy('resorts.id', 'resorts.resort_name')
            ->get()
            ->map(function ($item) {
                return [
                    'resort_name' => $item->resort_name,
                    'count' => $item->count,
                ];
            });

            // Restaurant reservation statistics per restaurant
            $restaurantReservationStats = RestoBooking::select(
                'resto.resto_name',
                DB::raw('COUNT(resto_booking.id) as count')
            )
            ->join('resto', 'resto_booking.resto_id', '=', 'resto.id')
            ->whereYear('resto_booking.created_at', date('Y'))
            ->groupBy('resto.id', 'resto.resto_name')
            ->get()
            ->map(function ($item) {
                return [
                    'restaurant_name' => $item->resto_name,
                    'count' => $item->count,
                ];
            });

            // Landing area reservation statistics per landing area
            $landingAreaReservationStats = LandingAreaRequest::select(
                'landing_areas.name',
                DB::raw('COUNT(landing_area_requests.id) as count')
            )
            ->join('landing_areas', 'landing_area_requests.landing_area_id', '=', 'landing_areas.id')
            ->whereYear('landing_area_requests.pickup_date', date('Y'))
            ->groupBy('landing_areas.id', 'landing_areas.name')
            ->get()
            ->map(function ($item) {
                return [
                    'landing_area_name' => $item->name,
                    'count' => $item->count,
                ];
            });

            // KPI Statistics for Admin
            // Total Reservations (Boat + Hotel + Resort + Restaurant + Landing Area bookings for current year)
            $boatBookingsCount = BoatBooking::whereYear('date_of_booking', date('Y'))->count();
            $hotelBookingsCount = Booking::whereNotNull('hotelid')
                ->whereYear('check_in_date', date('Y'))
                ->count();
            $resortBookingsCount = ResortBooking::whereYear('date_checkin', date('Y'))->count();
            $restaurantBookingsCount = RestoBooking::whereYear('created_at', date('Y'))->count();
            $landingAreaBookingsCount = LandingAreaRequest::whereYear('pickup_date', date('Y'))->count();
            $adminTotalReservations = $boatBookingsCount + $hotelBookingsCount + $resortBookingsCount + $restaurantBookingsCount + $landingAreaBookingsCount;

            // Total Revenue (Boat + Hotel + Resort + Landing Area bookings)
            $boatRevenue = BoatBooking::whereYear('date_of_booking', date('Y'))->sum('total_amount');
            $hotelRevenue = Booking::whereNotNull('hotelid')
                ->whereYear('check_in_date', date('Y'))
                ->sum('total_price');
            $resortRevenue = ResortBooking::whereYear('date_checkin', date('Y'))->sum('amount');
            $landingAreaRevenue = LandingAreaRequest::whereYear('pickup_date', date('Y'))->sum('total_amount');
            $adminTotalRevenue = $boatRevenue + $hotelRevenue + $resortRevenue + $landingAreaRevenue;

            // Today's Reservations (created today)
            $todayBoatBookings = BoatBooking::whereDate('created_at', date('Y-m-d'))->count();
            $todayHotelBookings = Booking::whereNotNull('hotelid')
                ->whereDate('created_at', date('Y-m-d'))
                ->count();
            $todayResortBookings = ResortBooking::whereDate('created_at', date('Y-m-d'))->count();
            $todayRestaurantBookings = RestoBooking::whereDate('created_at', date('Y-m-d'))->count();
            $todayLandingAreaBookings = LandingAreaRequest::whereDate('created_at', date('Y-m-d'))->count();
            $adminTodayReservations = $todayBoatBookings + $todayHotelBookings + $todayResortBookings + $todayRestaurantBookings + $todayLandingAreaBookings;

            // Today's Check-ins
            $adminTodayCheckIns = Booking::whereNotNull('hotelid')
                ->whereDate('check_in_date', date('Y-m-d'))
                ->sum(DB::raw('no_of_adults + no_of_children'));

            // Tourist Arrival Trend - Total guests (adults + children) by month for current year
            $touristArrivalTrend = Booking::select(
                DB::raw('MONTH(check_in_date) as month'),
                DB::raw('SUM(no_of_adults + no_of_children) as value')
            )
            ->whereNotNull('hotelid')
            ->whereYear('check_in_date', date('Y'))
            ->groupBy(DB::raw('MONTH(check_in_date)'))
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('M', mktime(0, 0, 0, $item->month, 1)),
                    'value' => (int) $item->value,
                ];
            });

            // Recent Reservations - Last 10 bookings
            $recentReservations = Booking::select(
                'bookings.id',
                'bookings.check_in_date',
                'bookings.check_out_date',
                'bookings.no_of_adults',
                'bookings.no_of_children',
                'bookings.booking_status',
                'bookings.created_at',
                'users.name as guest_name',
                'hotels.hotel_name'
            )
            ->join('users', 'bookings.userid', '=', 'users.id')
            ->leftJoin('hotels', 'bookings.hotelid', '=', 'hotels.id')
            ->whereNotNull('bookings.hotelid')
            ->orderBy('bookings.created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'guest_name' => $booking->guest_name,
                    'hotel_name' => $booking->hotel_name,
                    'check_in' => $booking->check_in_date,
                    'guests' => $booking->no_of_adults + $booking->no_of_children,
                    'status' => $booking->booking_status,
                    'created_at' => $booking->created_at->format('M d, Y'),
                ];
            });
        }

        // Hotel Dashboard (role_id = 6)
        if ($user->role_id === 6 && $user->hotelid) {
            // Monthly bookings for this specific hotel
            $hotelMonthlyBookings = Booking::select(
                DB::raw('MONTH(check_in_date) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->where('hotelid', $user->hotelid)
            ->whereYear('check_in_date', date('Y'))
            ->groupBy(DB::raw('MONTH(check_in_date)'))
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('M', mktime(0, 0, 0, $item->month, 1)),
                    'count' => $item->count,
                ];
            });

            // Total bookings for this hotel (current year)
            $hotelTotalBookings = Booking::where('hotelid', $user->hotelid)
                ->whereYear('check_in_date', date('Y'))
                ->count();

            // Total guests for this hotel (current year)
            $hotelTotalGuests = Booking::where('hotelid', $user->hotelid)
                ->whereYear('check_in_date', date('Y'))
                ->sum(DB::raw('no_of_adults + no_of_children'));
        }

        return Inertia::render('dashboard', [
            'user' => $user,
            'boatReservationStats' => $boatReservationStats,
            'roomReservationStats' => $roomReservationStats,
            'resortReservationStats' => $resortReservationStats,
            'restaurantReservationStats' => $restaurantReservationStats,
            'landingAreaReservationStats' => $landingAreaReservationStats,
            'hotelMonthlyBookings' => $hotelMonthlyBookings,
            'hotelTotalBookings' => $hotelTotalBookings,
            'hotelTotalGuests' => $hotelTotalGuests,
            'adminTotalReservations' => $adminTotalReservations,
            'adminTotalRevenue' => $adminTotalRevenue,
            'adminTodayReservations' => $adminTodayReservations,
            'adminTodayCheckIns' => $adminTodayCheckIns,
            'touristArrivalTrend' => $touristArrivalTrend,
            'recentReservations' => $recentReservations,
        ]);
    }
}
