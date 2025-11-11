<?php

use App\Http\Controllers\Admin\AcceptBookingController;
use App\Http\Controllers\Admin\BookingReportController;
use App\Http\Controllers\Admin\FeedbackReportController;
use App\Http\Controllers\Admin\GeneralReportController;
use App\Http\Controllers\Admin\HandleRefundController;
use App\Http\Controllers\Admin\LandingAreaController;
use App\Http\Controllers\Admin\ManageBoatsController;
use App\Http\Controllers\Admin\ManageUserController;
use App\Http\Controllers\Admin\RefundController;
use App\Http\Controllers\Admin\ReservationController;
use App\Http\Controllers\Admin\RevenueReportController;
use App\Http\Controllers\Admin\TouristTrendController;
use App\Http\Controllers\Admin\UbaapRevenueController;
use App\Http\Controllers\EmailConfigurationController;
use App\Http\Controllers\Billing\BillingController;
use App\Http\Controllers\Hotel\BookingManageController;
use App\Http\Controllers\Hotel\GeneralReportController as HotelGeneralReportController;
use App\Http\Controllers\Hotel\GuestInfoController as HotelGuestInfoController;
use App\Http\Controllers\Hotel\PaymentQrCodeController;
use App\Http\Controllers\Hotel\RoomManageController;
use App\Http\Controllers\Hotel\RoomsController;
use App\Http\Controllers\Billing\AfterBillingController;
use App\Http\Controllers\Customer\AvailabilityController;
use App\Http\Controllers\Customer\CancelBookingController;
use App\Http\Controllers\Customer\CustomerBookingController;
use App\Http\Controllers\Customer\MyProfileController;
use App\Http\Controllers\Hotel\RoomTypeController;
use App\Http\Controllers\Admin\HotelController;
use App\Http\Controllers\Admin\ResortController;
use App\Http\Controllers\Admin\RestaurantController;
use App\Http\Controllers\Restaurant\RestaurantPortalController;
use App\Http\Controllers\Landing\LandingFormsController;
use App\Http\Controllers\Customer\HotelDetailsController;
use App\Http\Controllers\Customer\RoomBookingController;
use App\Http\Controllers\Customer\HotelBookingController;
use App\Http\Controllers\Customer\RestaurantListController;
use App\Http\Controllers\HotelList;
use App\Http\Controllers\Resort\BookingInfoController;
use App\Http\Controllers\Resort\GuestInfoController;
use App\Http\Controllers\Resort\ResortPaymentController;
use App\Http\Controllers\Resort\ResortReservationController;
use App\Http\Controllers\Resort\ResortScheduleController;
use App\Http\Controllers\Resort\RevenueController;
use App\Http\Controllers\Resort\ResortBookingsController;
use App\Http\Controllers\Resort\ResortPaymentQRController;
use App\Http\Controllers\Resort\ResortEntranceFeeController;
use App\Http\Controllers\Customer\CustomerResortBookingController;
use App\Http\Controllers\Shared\DashboardController;
use App\Http\Controllers\Ubaap\BoatAssignController;
use App\Http\Controllers\Ubaap\MessageController;
use App\Http\Controllers\Ubaap\UbaapScheduleController;
use App\Http\Controllers\LandingAreaAdmin\DashboardController as LandingAreaDashboardController;
use App\Http\Controllers\LandingAreaAdmin\CustomerRequestController;
use App\Http\Controllers\LandingAreaAdmin\PaymentQRController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::group([], function () {
    Route::get('/', function () {
        $hotels = \App\Models\Hotel::where('isdeleted', 0)
            ->limit(6)
            ->get()
            ->map(function ($hotel) {
                return [
                    'id' => $hotel->id,
                    'hotel_name' => $hotel->hotel_name,
                    'location' => $hotel->location,
                    'description' => $hotel->description,
                    'image_url' => $hotel->image_url,
                ];
            });

        $boats = \App\Models\Boat::where('status', 'available')
            ->limit(6)
            ->get()
            ->map(function ($boat) {
                return [
                    'id' => $boat->id,
                    'boat_no' => $boat->boat_no,
                    'bankero_name' => $boat->bankero_name,
                    'capacity' => $boat->capacity,
                    'price_per_adult' => $boat->price_per_adult,
                    'price_per_child' => $boat->price_per_child,
                    'image' => $boat->image,
                ];
            });

        $restaurants = \App\Models\Resto::where('deleted', 0)
            ->with(['restoTables' => function ($query) {
                $query->where('deleted', 0);
            }])
            ->limit(6)
            ->get()
            ->map(function ($restaurant) {
                $activeTables = $restaurant->restoTables->where('deleted', 0);

                return [
                    'id' => $restaurant->id,
                    'resto_name' => $restaurant->resto_name,
                    'img' => $restaurant->img,
                    'payment_qr' => $restaurant->payment_qr,
                    'deleted' => $restaurant->deleted,
                    'resto_tables' => $activeTables->values(),
                    'available_tables_count' => $activeTables->where('status', 'available')->count(),
                    'total_capacity' => $activeTables->sum('no_of_chairs'),
                ];
            });

        $landingAreas = \App\Models\LandingArea::where('is_active', true)
            ->limit(6)
            ->get()
            ->map(function ($landingArea) {
                return [
                    'id' => $landingArea->id,
                    'name' => $landingArea->name,
                    'description' => $landingArea->description,
                    'location' => $landingArea->location,
                    'address' => $landingArea->address,
                    'capacity' => $landingArea->capacity,
                    'image' => $landingArea->image,
                    'payment_qr' => $landingArea->payment_qr,
                    'price' => $landingArea->price,
                ];
            });

        $resorts = \App\Models\Resort::where('deleted', 0)
            ->limit(6)
            ->get()
            ->map(function ($resort) {
                return [
                    'id' => $resort->id,
                    'resort_name' => $resort->resort_name,
                    'img' => $resort->img,
                    'payment_qr' => $resort->payment_qr,
                    'deleted' => $resort->deleted,
                ];
            });

        return Inertia::render('welcome', [
            'hotels' => $hotels,
            'boats' => $boats,
            'restaurants' => $restaurants,
            'landingAreas' => $landingAreas,
            'resorts' => $resorts,
        ]);
    })->name('home');

    Route::get('/room/{id}', [\App\Http\Controllers\Customer\RoomDetailsController::class, 'show'])
        ->name('room.details');

    Route::get('/data-privacy', function () {
        return Inertia::render('landing-page/DataPrivacy', [
            'role' => auth()->check() ? auth()->user()->role_id : null
        ]);
    })->name('data-privacy');

    Route::get('/terms-conditions', function () {
        return Inertia::render('landing-page/TermsConditionsPage', [
            'role' => auth()->check() ? auth()->user()->role_id : null
        ]);
    })->name('terms-conditions');

    Route::get('/hotel/{id}', [HotelDetailsController::class, 'show'])
        ->name('hotel.details');

    Route::get('/restaurant-list', [RestaurantListController::class, 'index'])
        ->name('restaurant-list');
});




Route::middleware(['auth', 'verified', 'role:admin,resort,customer,ubaap,hotel,restaurant'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});




// admin only
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('manage-users', [ManageUserController::class, 'index'])->name('manage-users.index');
    Route::put('manage-users/{user}', [ManageUserController::class, 'update'])->name('manage-users.update');
    Route::delete('manage-users/{user}', [ManageUserController::class, 'destroy'])->name('manage-users.destroy');

    Route::get('reservation', [ReservationController::class, 'index']);
    Route::get('api/reservation', [ReservationController::class, 'getReservationData']);

    Route::get('refund-request', [RefundController::class, 'index']);
    Route::post('refund-completed', [HandleRefundController::class, 'handleRefund'])->name('refund.completed');

    // creat entity user
    Route::post('create-enity-users', [ManageUserController::class, 'store'])->name('admin.users.store');


    Route::get('general-report', [GeneralReportController::class, 'index']);
    Route::get('tourist-arrival-trend', [TouristTrendController::class, 'index']);
    Route::get('booking-report', [BookingReportController::class, 'index']);
    Route::get('revenue-report', [RevenueReportController::class, 'index']);
    Route::get('ubaap-revenue', [UbaapRevenueController::class, 'index']);
    Route::post('booking/accept', [AcceptBookingController::class, 'acceptBookingRequest'])
        ->name('admin.booking.accept');

    Route::post('booking/decline', [AcceptBookingController::class, 'declineBookingRequest'])
        ->name('admin.booking.decline');

    //Hotel Management
    Route::get('manage-hotels', [HotelController::class, 'index'])->name('manage-hotel.index');
    Route::post('manage-hotels', [HotelController::class, 'store'])->name('manage-hotel.store');
    Route::post('manage-hotels/{hotel}', [HotelController::class, 'update'])->name('manage-hotel.update');
    Route::delete('manage-hotels/{hotel}', [HotelController::class, 'destroy'])->name('manage-hotel.destroy');
    Route::post('manage-hotels/{hotel}/toggle-status', [HotelController::class, 'toggleStatus'])->name('manage-hotel.toggle-status');
    Route::post('manage-hotels/{hotel}/images', [HotelController::class, 'storeImages'])->name('manage-hotel.store-images');
    Route::delete('manage-hotels/{hotel}/images', [HotelController::class, 'deleteImage'])->name('manage-hotel.delete-image');
    Route::post('manage-hotels/{hotel}/qrcode', [HotelController::class, 'updateQrCode'])->name('manage-hotel.update-qrcode');

    //Resort Management
    Route::get('manage-resorts', [ResortController::class, 'index'])->name('manage-resort.index');
    Route::post('manage-resorts', [ResortController::class, 'store'])->name('manage-resort.store');
    Route::post('manage-resorts/{resort}', [ResortController::class, 'update'])->name('manage-resort.update');
    Route::delete('manage-resorts/{resort}', [ResortController::class, 'destroy'])->name('manage-resort.destroy');
    Route::post('manage-resorts/{resort}/toggle-status', [ResortController::class, 'toggleStatus'])->name('manage-resort.toggle-status');

    //Restaurant Management
    Route::get('manage-restaurants', [RestaurantController::class, 'index'])->name('manage-restaurant.index');
    Route::post('manage-restaurants', [RestaurantController::class, 'store'])->name('manage-restaurant.store');
    Route::post('manage-restaurants/{restaurant}', [RestaurantController::class, 'update'])->name('manage-restaurant.update');
    Route::delete('manage-restaurants/{restaurant}', [RestaurantController::class, 'destroy'])->name('manage-restaurant.destroy');
    Route::post('manage-restaurants/{restaurant}/toggle-status', [RestaurantController::class, 'toggleStatus'])->name('manage-restaurant.toggle-status');

    // Restaurant Table Management
    Route::post('manage-restaurants/{restaurant}/tables', [RestaurantController::class, 'storeTable'])->name('manage-restaurant.store-table');
    Route::post('manage-restaurants/tables/{table}', [RestaurantController::class, 'updateTable'])->name('manage-restaurant.update-table');
    Route::delete('manage-restaurants/tables/{table}', [RestaurantController::class, 'destroyTable'])->name('manage-restaurant.destroy-table');
    Route::post('manage-restaurants/tables/{table}/toggle-status', [RestaurantController::class, 'toggleTableStatus'])->name('manage-restaurant.toggle-table-status');

    // Landing Area Management
    Route::get('manage-landing-areas', [LandingAreaController::class, 'index'])->name('manage-landing-area.index');
    Route::post('manage-landing-areas', [LandingAreaController::class, 'store'])->name('manage-landing-area.store');
    Route::post('manage-landing-areas/{landingArea}', [LandingAreaController::class, 'update'])->name('manage-landing-area.update');
    Route::delete('manage-landing-areas/{landingArea}', [LandingAreaController::class, 'destroy'])->name('manage-landing-area.destroy');

    // Email Configuration
    Route::get('email-configuration', [EmailConfigurationController::class, 'index'])->name('email-configuration.index');
    Route::post('email-configuration', [EmailConfigurationController::class, 'store'])->name('email-configuration.store');
    Route::put('email-configuration/{emailConfiguration}', [EmailConfigurationController::class, 'update'])->name('email-configuration.update');

    //Room Configuration
    Route::get('email-configuration', [EmailConfigurationController::class, 'index'])->name('email-configuration.index');
});

// ubaap
Route::middleware(['auth', 'verified', 'role:ubaap'])->group(function () {
    Route::get('ubaap-dashboard', [UbaapScheduleController::class, 'index']);
    Route::get('boat-bookings', [BoatAssignController::class, 'index']);
    Route::post('boat-assign', [BoatAssignController::class, 'assignBoat'])->name('assign.boat');

    // Boat Management
    Route::get('manage-boats', [ManageBoatsController::class, 'index'])->name('manage-boats.index');
    Route::post('manage-boats', [ManageBoatsController::class, 'store'])->name('manage-boats.store');
    Route::post('manage-boats/{boat}', [ManageBoatsController::class, 'update'])->name('manage-boats.update');
    Route::delete('manage-boats/{boat}', [ManageBoatsController::class, 'destroy'])->name('manage-boats.destroy');

    // Landing Area Requests Management
    Route::get('ubaap-landing-area-requests', [\App\Http\Controllers\Ubaap\LandingAreaRequestController::class, 'index'])->name('ubaap.landing-area-requests');
    Route::post('ubaap-landing-area-requests/{landingAreaRequest}/assign-boat', [\App\Http\Controllers\Ubaap\LandingAreaRequestController::class, 'assignBoat'])->name('ubaap.landing-area-requests.assign-boat');
    Route::put('ubaap-landing-area-requests/{landingAreaRequest}/status', [\App\Http\Controllers\Ubaap\LandingAreaRequestController::class, 'updateStatus'])->name('ubaap.landing-area-requests.update-status');
});

// resort
Route::middleware(['auth', 'verified', 'role:resort'])->group(function () {
    Route::get('resort-schedule', [ResortScheduleController::class, 'index']);
    Route::get('resort-revenue', [RevenueController::class, 'index']);
    Route::get('resort-reservation', [ResortReservationController::class, 'index']);
    Route::get('resort-payment', [ResortPaymentController::class, 'index']);
    Route::get('resort-guest-information', [GuestInfoController::class, 'index']);
    Route::get('resort-booking-information', [BookingInfoController::class, 'index']);

    // New Resort Pages
    Route::get('resort-bookings', [ResortBookingsController::class, 'index'])->name('resort.bookings');
    Route::get('resort-payment-qr', [ResortPaymentQRController::class, 'index'])->name('resort.payment-qr');
    Route::post('resort/{resort}/qrcode', [ResortPaymentQRController::class, 'updateQrCode'])->name('resort.update-qrcode');
    Route::get('resort-entrance-fee', [ResortEntranceFeeController::class, 'index'])->name('resort.entrance-fee');
    Route::put('resort/entrance-fee/{fee}', [ResortEntranceFeeController::class, 'update'])->name('resort.entrance-fee.update');
});

// Feedbacks - accessible to all roles
Route::middleware(['auth', 'verified', 'role:admin,resort,ubaap,hotel,restaurant,landing_area'])->group(function () {
    Route::get('feedbacks', [\App\Http\Controllers\FeedbackController::class, 'index'])->name('feedbacks.index');
    Route::post('feedbacks', [\App\Http\Controllers\FeedbackController::class, 'store'])->name('feedbacks.store');
    Route::delete('feedbacks/{feedback}', [\App\Http\Controllers\FeedbackController::class, 'destroy'])->name('feedbacks.destroy');
});

// landing area admin
Route::middleware(['auth', 'verified', 'role:landing_area'])->group(function () {
    Route::get('landing-area-dashboard', [LandingAreaDashboardController::class, 'index'])->name('landing-area.dashboard');
    Route::get('landing-area-requests', [CustomerRequestController::class, 'index'])->name('landing-area.requests');
    Route::put('landing-area-requests/{landingAreaRequest}/status', [CustomerRequestController::class, 'updateStatus'])->name('landing-area.requests.update-status');
    Route::get('landing-area-payment-qr', [PaymentQRController::class, 'index'])->name('landing-area.payment-qr');
    Route::post('landing-area-payment-qr/upload', [PaymentQRController::class, 'upload'])->name('landing-area.payment-qr.upload');
    Route::delete('landing-area-payment-qr/delete', [PaymentQRController::class, 'delete'])->name('landing-area.payment-qr.delete');
});

// restaurant portal
Route::middleware(['auth', 'verified', 'role:restaurant'])->group(function () {
    Route::get('restaurant-portal', [RestaurantPortalController::class, 'index'])->name('restaurant-portal.index');
    Route::post('restaurant-portal/qrcode', [RestaurantPortalController::class, 'updateQrCode'])->name('restaurant-portal.update-qrcode');

    // Table Management
    Route::post('restaurant-portal/tables', [RestaurantPortalController::class, 'storeTable'])->name('restaurant-portal.store-table');
    Route::post('restaurant-portal/tables/{table}', [RestaurantPortalController::class, 'updateTable'])->name('restaurant-portal.update-table');
    Route::delete('restaurant-portal/tables/{table}', [RestaurantPortalController::class, 'destroyTable'])->name('restaurant-portal.destroy-table');
    Route::post('restaurant-portal/tables/{table}/toggle-status', [RestaurantPortalController::class, 'toggleTableStatus'])->name('restaurant-portal.toggle-table-status');

    // Booking Management
    Route::get('restaurant-bookings', [RestaurantPortalController::class, 'bookings'])->name('restaurant-bookings.index');
    Route::post('restaurant-bookings/{booking}/confirm', [RestaurantPortalController::class, 'confirmBooking'])->name('restaurant-bookings.confirm');
    Route::delete('restaurant-bookings/{booking}', [RestaurantPortalController::class, 'cancelBooking'])->name('restaurant-bookings.cancel');
});

// Message route
Route::middleware(['auth', 'verified', 'role:ubaap,resort,hotel,restaurant'])->group(function () {
    Route::get('message', [MessageController::class, 'index']);
});


// hotel
Route::middleware(['auth', 'verified', 'role:hotel,admin'])->group(function () {
    Route::get('booking-management', [BookingManageController::class, 'index']);
    Route::put('hotel-bookings/{booking}/status', [BookingManageController::class, 'updateStatus'])->name('hotel.bookings.update-status');
    Route::delete('hotel-bookings/{booking}', [BookingManageController::class, 'cancel'])->name('hotel.bookings.cancel');

    Route::get('room-management', [RoomsController::class, 'index']);
    Route::get('hotel-guest-information', [HotelGuestInfoController::class, 'index']);
    Route::get('hotel-general-report', [HotelGeneralReportController::class, 'index']);
    Route::post('hotel-add-rooms', [RoomsController::class, 'store'])->name('add.rooms');

    // Room Management Routes
    Route::post('hotel-rooms/{room}', [RoomsController::class, 'update'])->name('hotel.rooms.update');
    Route::delete('hotel-rooms/{room}', [RoomsController::class, 'destroy'])->name('hotel.rooms.destroy');
    Route::post('hotel-rooms/{room}/toggle-bookable', [RoomsController::class, 'toggleBookable'])->name('hotel.rooms.toggle-bookable');
    Route::post('hotel-rooms/{room}/toggle-active', [RoomsController::class, 'toggleActive'])->name('hotel.rooms.toggle-active');
    Route::post('hotel-rooms/{room}/toggle-post', [RoomsController::class, 'toggleBookable'])->name('hotel.rooms.toggle');

    // Room Type Routes
    Route::get('hotel-room-type', [RoomTypeController::class, 'index']);
    Route::post('hotel-room-type', [RoomTypeController::class, 'store'])->name('hotel.room-type.store');
    Route::post('hotel-room-type/{roomType}', [RoomTypeController::class, 'update'])->name('hotel.room-type.update');
    Route::delete('hotel-room-type/{roomType}', [RoomTypeController::class, 'destroy'])->name('hotel.room-type.destroy');
});

// hotel only (not admin)
Route::middleware(['auth', 'verified', 'role:hotel'])->group(function () {
    Route::get('payment-qrcode', [PaymentQrCodeController::class, 'index'])->name('hotel.payment-qrcode.index');
    Route::post('payment-qrcode', [PaymentQrCodeController::class, 'update'])->name('hotel.payment-qrcode.update');
});


Route::middleware(['auth', 'verified', 'role:customer'])->group(function () {
    Route::get('my-profile', [MyProfileController::class, 'create']);
    Route::post('my-profile-post', [MyProfileController::class, 'store'])->name('profile.post');

    // Account Management
    Route::get('account', [\App\Http\Controllers\Customer\ProfileController::class, 'show'])->name('profile.account');
    Route::put('account/profile', [\App\Http\Controllers\Customer\ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::put('account/password', [\App\Http\Controllers\Customer\ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::delete('account', [\App\Http\Controllers\Customer\ProfileController::class, 'deleteAccount'])->name('profile.delete');
});

// landing form (user);
Route::middleware(['auth', 'verified', 'guest-profile', 'role:admin,resort,customer,ubaap,hotel'])->group(function () {
    // resort
    Route::get('welcome', [LandingFormsController::class, 'index'])->name('welcome');
    Route::get('my-bookings', [CustomerBookingController::class, 'myBookingPage'])->name('my.bookings');
    Route::get('my-booking-details', [CustomerBookingController::class, 'myBookingDetails'])->name('my.booking-details');
    Route::get('manage-my-bookings', [CustomerBookingController::class, 'manageMyBookings'])->name('manage. my-bookings');

    // Resort Booking
    Route::get('resort/{id}', [CustomerResortBookingController::class, 'show'])->name('customer.resort.show');
    Route::post('resort/book', [CustomerResortBookingController::class, 'book'])->name('customer.resort.book');

    // room dashboard
    Route::get('room-booking/{id}', [RoomBookingController::class, 'show'])->name('room.booking');
    Route::get('boat-availability/{hotelId}/{date}', [RoomBookingController::class, 'getBoatAvailability'])->name('boat.availability');
    Route::post('hotel-booking', [HotelBookingController::class, 'store'])->name('hotel.booking.store');

    // boat booking
    Route::get('boat-booking/{boat}', [\App\Http\Controllers\Customer\BoatBookingController::class, 'show'])->name('boat.booking');
    Route::get('boat-availability-single/{boatId}/{date}', [\App\Http\Controllers\Customer\BoatBookingController::class, 'getBoatAvailability'])->name('boat.availability.single');
    Route::post('boat-booking', [\App\Http\Controllers\Customer\BoatBookingController::class, 'store'])->name('boat.booking.store');
    Route::post('boat-request', [\App\Http\Controllers\Customer\BoatBookingController::class, 'requestBoat'])->name('boat.request');

    // restaurant booking
    Route::get('restaurant/{id}', [\App\Http\Controllers\Customer\RestaurantBookingController::class, 'show'])->name('restaurant.show');
    Route::post('restaurant-booking', [\App\Http\Controllers\Customer\RestaurantBookingController::class, 'store'])->name('restaurant.booking.store');
    Route::get('my-restaurant-bookings', [\App\Http\Controllers\Customer\RestaurantBookingController::class, 'myBookings'])->name('my.restaurant.bookings');
    Route::delete('restaurant-booking/{id}', [\App\Http\Controllers\Customer\RestaurantBookingController::class, 'cancel'])->name('restaurant.booking.cancel');

    // landing area booking
    Route::get('landing-area/{id}/book', [\App\Http\Controllers\Customer\LandingAreaBookingController::class, 'show'])->name('landing-area.booking.show');
    Route::post('landing-area-booking', [\App\Http\Controllers\Customer\LandingAreaBookingController::class, 'store'])->name('landing-area.booking.store');
    Route::get('my-landing-area-bookings', [\App\Http\Controllers\Customer\LandingAreaBookingController::class, 'myBookings'])->name('my.landing-area.bookings');
    Route::delete('landing-area-booking/{id}', [\App\Http\Controllers\Customer\LandingAreaBookingController::class, 'cancel'])->name('landing-area.booking.cancel');

    // cancel
    Route::post('cancel-my-bookings/{reference_id}', [CancelBookingController::class, 'cancelBooking'])->name('cancel.bookings');


    // refund
    Route::post('refund-my-bookings/{booking_id}', [CancelBookingController::class, 'refundBooking'])->name('refund.bookings');

    Route::get('hotel-list', [HotelList::class, 'index'])->name('hotel.list');
    Route::get('restaurant-list', [RestaurantListController::class, 'index'])->name('restaurant-list.customer');

    // check availability
    Route::get('/availability/{reservation_type}/{id}', [AvailabilityController::class, 'AvailabilityCheck'])
        ->where('reservation_type', 'landing-area|resort|hotel|restaurant')
        ->name('availability.check');

    // API endpoints for availability
    Route::get('/api/available-resorts', [AvailabilityController::class, 'getAvailableResorts'])
        ->name('api.available-resorts');





    Route::get('resort-form', [LandingFormsController::class, 'resortForm']);
    Route::get('hotel-form', [LandingFormsController::class, 'hotelForm']);
    Route::get('boat-form', [LandingFormsController::class, 'boatForm']);
    Route::get('restaurant-form', [LandingFormsController::class, 'restoForm']);
    Route::post('booking-request', [LandingFormsController::class, 'addBooking'])->name('resort.request.book');
});

// Billing
Route::middleware(['auth', 'verified', 'role:customer,admin,resort,ubaap,hotel'])->group(function () {
    Route::get('billing', [BillingController::class, 'index'])->name('billing.now');
    Route::post('paynow', [BillingController::class, 'create'])->name('payment.now');
    Route::get('payment-return', [AfterBillingController::class, 'paymentReturn'])->name('payment.return');
    Route::get('payment-success', [AfterBillingController::class, 'successPage'])->name('payment.success');
    Route::get('payment-cancel', [AfterBillingController::class, 'cancelPage'])->name('payment.cancel');
});




// share route (revenue, message, feedback, dashboard)
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// page/landing-page/user
// populate the details of the customer booking page
   // once accepted, show alert showing expiration of the booking, show payment btn and //cancel btn and if theres no boat ride booked yet show booked boat ride modal

// if user id does not exist in the guest table redirect to the account section first

// display to the super admin reservation page,
// make actions functionl for accept, decline
// once accept reflect to the dashboard of the enity
// once accept reflect to the customer Bookings Module
// once accepted mark the entity room as booked
// lastly, once accepted a modal pops proceed to payment, so the booking wont expire, after payment, summary info return.
// include the addtion of the boat ride
// once accepted mark the entity boat as booked 
// 1. in the landing-form add the boat ride input,
// 2. once accept reflect to the Ubaap dashboard
// 3. reflect the assigned boat to the customer side
// 4. once the service done, all booked became available
// 5. relfect to the customer that the booking was done, and pops ratings dialog for reviews

// cron job, remove the time in boat booking, assign boat and time check in only