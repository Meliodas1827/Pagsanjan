<?php

namespace App\Http\Controllers\Ubaap;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BoatBooking;
use App\Models\Boat;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UbaapScheduleController extends Controller
{
    public function index(){
        // Get analytics data
        $analytics = $this->getAnalytics();

        // Get upcoming boat rides (future bookings)
        $upcomingRides = BoatBooking::select(
            'boat_bookings.id',
            'boat_bookings.date_of_booking',
            'boat_bookings.ride_time',
            'boat_bookings.no_of_adults',
            'boat_bookings.no_of_children',
            'boat_bookings.status',
            'boats.boat_no',
            'users.name as guest_name'
        )
            ->join('boats', 'boat_bookings.boat_id', '=', 'boats.id')
            ->join('users', 'boat_bookings.user_id', '=', 'users.id')
            ->where('boat_bookings.date_of_booking', '>=', now()->toDateString())
            ->whereIn('boat_bookings.status', ['pending', 'boat_assigned'])
            ->orderBy('boat_bookings.date_of_booking', 'asc')
            ->orderBy('boat_bookings.ride_time', 'asc')
            ->limit(10)
            ->get();

        // Get boat rides history (past bookings)
        $ridesHistory = BoatBooking::select(
            'boat_bookings.id',
            'boat_bookings.date_of_booking',
            'boat_bookings.ride_time',
            'boat_bookings.no_of_adults',
            'boat_bookings.no_of_children',
            'boat_bookings.status',
            'boats.boat_no',
            'users.name as guest_name'
        )
            ->join('boats', 'boat_bookings.boat_id', '=', 'boats.id')
            ->join('users', 'boat_bookings.user_id', '=', 'users.id')
            ->where('boat_bookings.date_of_booking', '<', now()->toDateString())
            ->whereIn('boat_bookings.status', ['completed', 'cancelled'])
            ->orderBy('boat_bookings.date_of_booking', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('ubaap/Schedule', [
            'analytics' => $analytics,
            'upcomingRides' => $upcomingRides,
            'ridesHistory' => $ridesHistory,
        ]);
    }

    private function getAnalytics()
    {
        $today = now()->startOfDay();
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        // Total bookings today
        $todayBookings = BoatBooking::whereDate('date_of_booking', $today)->count();

        // Total bookings this month
        $monthBookings = BoatBooking::whereBetween('date_of_booking', [$startOfMonth, $endOfMonth])->count();

        // Total guests today
        $todayGuests = BoatBooking::whereDate('date_of_booking', $today)
            ->sum(DB::raw('no_of_adults + no_of_children'));

        // Total guests this month
        $monthGuests = BoatBooking::whereBetween('date_of_booking', [$startOfMonth, $endOfMonth])
            ->sum(DB::raw('no_of_adults + no_of_children'));

        // Available boats
        $availableBoats = Boat::where('status', 'available')->count();

        // Total boats
        $totalBoats = Boat::count();

        // Pending assignments (bookings without boat assigned)
        $pendingAssignments = BoatBooking::where('status', 'pending')
            ->where('date_of_booking', '>=', $today)
            ->count();

        // Bookings by status for this month
        $bookingsByStatus = BoatBooking::select('status', DB::raw('count(*) as count'))
            ->whereBetween('date_of_booking', [$startOfMonth, $endOfMonth])
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Daily bookings for the last 7 days
        $dailyBookings = BoatBooking::select(
                DB::raw('DATE(date_of_booking) as date'),
                DB::raw('count(*) as count')
            )
            ->where('date_of_booking', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'count' => $item->count
                ];
            });

        // Most active boats (boats with most bookings this month)
        $mostActiveBoats = BoatBooking::select(
                'boats.boat_no',
                DB::raw('count(*) as booking_count')
            )
            ->join('boats', 'boat_bookings.boat_id', '=', 'boats.id')
            ->whereBetween('boat_bookings.date_of_booking', [$startOfMonth, $endOfMonth])
            ->groupBy('boats.id', 'boats.boat_no')
            ->orderBy('booking_count', 'desc')
            ->limit(5)
            ->get();

        return [
            'today_bookings' => $todayBookings,
            'month_bookings' => $monthBookings,
            'today_guests' => $todayGuests,
            'month_guests' => $monthGuests,
            'available_boats' => $availableBoats,
            'total_boats' => $totalBoats,
            'pending_assignments' => $pendingAssignments,
            'bookings_by_status' => $bookingsByStatus,
            'daily_bookings' => $dailyBookings,
            'most_active_boats' => $mostActiveBoats,
        ];
    }
}
