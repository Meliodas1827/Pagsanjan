import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { ArrowLeft, Bed, Check, LogOut, MapPin, NotebookTabs, PhilippinePeso, QrCode, User, UserRoundCog, Users, Waves } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import ImageGallery from '../landing-page/components/ImageGallery';

interface Amenity {
    name: string;
    available: boolean;
}

interface Room {
    id: number;
    hotelid: number;
    room_name: string;
    room_type: string;
    description: string;
    capacity: number;
    max_adults: number;
    max_children: number;
    price_per_night: number;
    amenities: Amenity[];
    room_size_sqm: number;
    number_of_beds: number;
    bed_type: string;
    view_type: string;
    main_image: string;
    image_gallery: string[];
}

interface Boat {
    id: number;
    boat_no: string;
    bankero_name: string;
    capacity: number;
    price_per_adult: number;
    price_per_child: number;
}

interface BookedDateRange {
    check_in: string;
    check_out: string;
}

interface BoatAvailability {
    capacity: number;
    reserved: number;
    available: number;
}

interface PageProps {
    room: Room;
    hotelQrCode: string | null;
    bookedDates: BookedDateRange[];
}

interface State extends SnackbarOrigin {
    open: boolean;
}

const PublicNavBar = ({ role }: { role: number }) => {
    const handleLogout = () => {
        router.post(route('logout'));
        router.flushAll();
    };

    return (
        <nav className="w-full bg-[#18371e] text-white">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-opacity-20 flex h-12 w-13 items-center justify-center rounded">
                            <img src="/images/logo.png" alt="logo" title="logo" />
                        </div>
                        <div className="font-bold text-white">
                            <div className="text-lg leading-tight">PAGSANJAN</div>
                            <div className="text-sm leading-tight">FALLS RESORT</div>
                        </div>
                    </Link>

                    {/* User Menu */}
                    {role > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hover:bg-opacity-10 flex items-center space-x-2 rounded-md px-3 py-2 text-white transition-colors hover:bg-white">
                                <User className="h-5 w-5" />
                                <span>Account</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href={route('dashboard')} className="flex w-full items-center">
                                        <NotebookTabs className="mr-2 h-4 w-4" />
                                        <span>My Bookings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')} className="flex w-full items-center">
                                        <UserRoundCog className="mr-2 h-4 w-4" />
                                        <span>Account</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="flex w-full items-center">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default function RoomBooking() {
    const { auth } = usePage<SharedData>().props;
    const { room, hotelQrCode, bookedDates } = usePage<PageProps>().props;
    const [includeBoatRental, setIncludeBoatRental] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [dateError, setDateError] = useState<string>('');
    const user = auth?.user?.role_id ?? 0;
    const [open, setOpen] = useState(false);
    const vertical = 'top';
    const horizontal = 'right';

    const { data, setData, post, processing, errors } = useForm({
        room_id: room.id,
        check_in: '',
        check_out: '',
        adults: 1,
        children: 0,
        // Boat rental fields (no boat selection, UBAAP will assign)
        include_boat: false,
        boat_date: '',
        boat_time: '',
        boat_adults: 1,
        boat_children: 0,
    });

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get minimum check-out date (check-in date + 1 day)
    const getMinCheckOutDate = () => {
        if (!data.check_in) return getTodayDate();
        const checkInDate = new Date(data.check_in);
        checkInDate.setDate(checkInDate.getDate() + 1);
        return checkInDate.toISOString().split('T')[0];
    };


    // Check if date range overlaps with any booked dates
    const isDateRangeBooked = (checkIn: string, checkOut: string): boolean => {
        if (!checkIn || !checkOut) return false;

        const newCheckIn = new Date(checkIn);
        const newCheckOut = new Date(checkOut);

        return bookedDates.some((booking) => {
            const bookedCheckIn = new Date(booking.check_in);
            const bookedCheckOut = new Date(booking.check_out);

            // Check if the date ranges overlap
            return (
                (newCheckIn >= bookedCheckIn && newCheckIn < bookedCheckOut) ||
                (newCheckOut > bookedCheckIn && newCheckOut <= bookedCheckOut) ||
                (newCheckIn <= bookedCheckIn && newCheckOut >= bookedCheckOut)
            );
        });
    };

    // Get disabled date ranges for display
    const getDisabledDatesMessage = (): string => {
        if (bookedDates.length === 0) return '';

        const upcomingBookings = bookedDates
            .filter(booking => new Date(booking.check_in) >= new Date())
            .slice(0, 3); // Show only next 3 bookings

        if (upcomingBookings.length === 0) return '';

        return upcomingBookings.map(booking => {
            const checkIn = new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const checkOut = new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `${checkIn} - ${checkOut}`;
        }).join(', ');
    };


    // Handle check-in date change
    const handleCheckInChange = (newCheckIn: string) => {
        setData('check_in', newCheckIn);
        setDateError('');

        // Auto-populate boat date with check-in date if boat rental is included
        if (includeBoatRental) {
            setData('boat_date', newCheckIn);
        }

        // If check-out is before or same as new check-in, clear it
        if (data.check_out && data.check_out <= newCheckIn) {
            setData('check_out', '');
        }

        // Check if new check-in overlaps with existing bookings
        if (data.check_out && isDateRangeBooked(newCheckIn, data.check_out)) {
            setDateError('Selected dates are not available. Room is already booked during this period.');
        }
    };

    // Handle check-out date change
    const handleCheckOutChange = (newCheckOut: string) => {
        setData('check_out', newCheckOut);
        setDateError('');

        // Check if the date range overlaps with existing bookings
        if (data.check_in && isDateRangeBooked(data.check_in, newCheckOut)) {
            setDateError('Selected dates are not available. Room is already booked during this period.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if dates are booked before showing payment dialog
        if (isDateRangeBooked(data.check_in, data.check_out)) {
            setDateError('Selected dates are not available. Room is already booked during this period.');
            return;
        }

        // Show payment dialog instead of directly submitting
        setShowPaymentDialog(true);
    };

    const handleConfirmPayment = () => {
        // Actually submit the booking
        post(route('hotel.booking.store'), {
            onSuccess: () => {
                setShowPaymentDialog(false);
                setOpen(true);  // Show success message only after successful save
            },
            onError: (errors) => {
                console.error('Booking failed:', errors);
                alert('Failed to create booking. Please try again.');
            },
        });
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // Optional: ignore clickaway reason to keep snackbar open if you want
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleBoatCheckboxChange = (checked: boolean) => {
        setIncludeBoatRental(checked);
        setData('include_boat', checked);
        if (checked && data.check_in) {
            // Auto-populate boat date with check-in date
            setData('boat_date', data.check_in);
        }
        if (!checked) {
            setData({
                ...data,
                include_boat: false,
                boat_date: '',
                boat_time: '',
                boat_adults: 1,
                boat_children: 0,
            });
        }
    };

    // Calculate number of nights
    const calculateNights = () => {
        if (!data.check_in || !data.check_out) return 0;
        const checkIn = new Date(data.check_in);
        const checkOut = new Date(data.check_out);
        const diffTime = checkOut.getTime() - checkIn.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Calculate totals
    const nights = calculateNights();
    const roomTotal = nights * room.price_per_night;
    // Final price is 50% of room total only (boat not included in payment)
    const finalPrice = roomTotal * 0.5;

    // Prepare images for gallery - controller already includes main_image at the beginning
    const allImages = (room.image_gallery || []).map((img, index) => ({
        id: index,
        image_url: img,
    }));

    return (
        <>
            <Head title={`Book ${room.room_name}`} />
            <PublicNavBar role={user} />
            <Snackbar
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Room Booked Succesfully
                </Alert>
            </Snackbar>
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link href={route('welcome')} className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Hotels
                    </Link>

                    {/* Room Image Gallery - Full Width */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Room Gallery</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {allImages.length > 0 ? (
                                <ImageGallery images={allImages.slice(1)} mainImage={allImages[0]?.image_url} />
                            ) : (
                                <div className="flex h-96 items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                                    <div className="text-center">
                                        <Bed className="mx-auto h-16 w-16 text-gray-500" />
                                        <p className="mt-2 text-sm text-gray-600">No Images Available</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left Column - Room Details */}
                        <div className="space-y-6">
                            {/* Room Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{room.room_name}</CardTitle>
                                    <p className="text-sm text-gray-600">{room.room_type}</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {room.description && <p className="text-gray-700">{room.description}</p>}

                                    {/* Room Specs */}
                                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="mr-2 h-5 w-5 text-green-600" />
                                            <span>Up to {room.capacity} guests</span>
                                        </div>
                                        {room.number_of_beds && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Bed className="mr-2 h-5 w-5 text-green-600" />
                                                <span>
                                                    {room.number_of_beds} {room.bed_type || 'bed(s)'}
                                                </span>
                                            </div>
                                        )}
                                        {room.room_size_sqm && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                                                <span>{room.room_size_sqm} sqm</span>
                                            </div>
                                        )}
                                        {room.view_type && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Waves className="mr-2 h-5 w-5 text-green-600" />
                                                <span>{room.view_type} view</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Amenities */}
                                    {room.amenities.length > 0 && (
                                        <div className="border-t pt-4">
                                            <h3 className="mb-3 font-semibold text-gray-900">Amenities</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {room.amenities.map((amenity, index) => (
                                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                                        <Check className="mr-2 h-4 w-4 text-green-600" />
                                                        <span>{amenity.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="flex items-center border-t pt-4">
                                        <PhilippinePeso className="me-1 h-6 w-6 text-green-600" />
                                        <span className="text-3xl font-bold text-gray-900">{room.price_per_night}</span>
                                        <span className="ml-2 text-gray-500">/ night</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Booking Form */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Booked Dates Notice */}
                                        {bookedDates.length > 0 && (
                                            <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200">
                                                <p className="text-xs font-semibold text-yellow-800 mb-1">Unavailable Dates:</p>
                                                <p className="text-xs text-yellow-700">
                                                    {getDisabledDatesMessage() || 'Some dates are already booked. Please select available dates.'}
                                                </p>
                                            </div>
                                        )}

                                        {/* Date Conflict Error */}
                                        {dateError && (
                                            <div className="rounded-md bg-red-50 p-3 border border-red-200">
                                                <p className="text-sm font-semibold text-red-800">{dateError}</p>
                                            </div>
                                        )}

                                        {/* Check-in/Check-out */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="check_in">Check-in</Label>
                                                <Input
                                                    id="check_in"
                                                    type="date"
                                                    value={data.check_in}
                                                    min={getTodayDate()}
                                                    onChange={(e) => handleCheckInChange(e.target.value)}
                                                    required
                                                />
                                                {errors.check_in && <p className="text-sm text-red-500">{errors.check_in}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="check_out">Check-out</Label>
                                                <Input
                                                    id="check_out"
                                                    type="date"
                                                    value={data.check_out}
                                                    min={getMinCheckOutDate()}
                                                    onChange={(e) => handleCheckOutChange(e.target.value)}
                                                    required
                                                />
                                                {errors.check_out && <p className="text-sm text-red-500">{errors.check_out}</p>}
                                            </div>
                                        </div>

                                        {/* Guests */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="adults">Adults</Label>
                                                <Input
                                                    id="adults"
                                                    type="number"
                                                    min="1"
                                                    max={room.max_adults}
                                                    value={data.adults}
                                                    onChange={(e) => setData('adults', parseInt(e.target.value))}
                                                    required
                                                />
                                                {errors.adults && <p className="text-sm text-red-500">{errors.adults}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="children">Children</Label>
                                                <Input
                                                    id="children"
                                                    type="number"
                                                    min="0"
                                                    max={room.max_children}
                                                    value={data.children}
                                                    onChange={(e) => setData('children', parseInt(e.target.value))}
                                                />
                                                {errors.children && <p className="text-sm text-red-500">{errors.children}</p>}
                                            </div>
                                        </div>

                                        {/* Boat Rental Section */}
                                        <div className="border-t pt-4">
                                            <div className="mb-4 flex items-center space-x-2">
                                                <Checkbox
                                                    id="include_boat"
                                                    checked={includeBoatRental}
                                                    onCheckedChange={handleBoatCheckboxChange}
                                                />
                                                <Label htmlFor="include_boat" className="cursor-pointer font-semibold">
                                                    Include Boat Rental
                                                </Label>
                                            </div>

                                            {/* Boat Rental Form - No boat selection, UBAAP will assign */}
                                            <div className={`space-y-4 ${!includeBoatRental ? 'opacity-50' : ''}`}>
                                                {/* Date and Time for boat ride */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="boat_date">Boat Ride Date</Label>
                                                        <Input
                                                            id="boat_date"
                                                            type="date"
                                                            value={data.boat_date}
                                                            min={getTodayDate()}
                                                            onChange={(e) => setData('boat_date', e.target.value)}
                                                            disabled={!includeBoatRental}
                                                            required={includeBoatRental}
                                                        />
                                                        {errors.boat_date && <p className="text-sm text-red-500">{errors.boat_date}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="boat_time">Boat Ride Time</Label>
                                                        <Input
                                                            id="boat_time"
                                                            type="time"
                                                            value={data.boat_time}
                                                            onChange={(e) => setData('boat_time', e.target.value)}
                                                            disabled={!includeBoatRental}
                                                            required={includeBoatRental}
                                                        />
                                                        {errors.boat_time && <p className="text-sm text-red-500">{errors.boat_time}</p>}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="boat_adults">Adults for Boat</Label>
                                                        <Input
                                                            id="boat_adults"
                                                            type="number"
                                                            min="1"
                                                            value={data.boat_adults}
                                                            onChange={(e) => setData('boat_adults', parseInt(e.target.value))}
                                                            disabled={!includeBoatRental}
                                                        />
                                                        {errors.boat_adults && <p className="text-sm text-red-500">{errors.boat_adults}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="boat_children">Children for Boat</Label>
                                                        <Input
                                                            id="boat_children"
                                                            type="number"
                                                            min="0"
                                                            value={data.boat_children}
                                                            onChange={(e) => setData('boat_children', parseInt(e.target.value))}
                                                            disabled={!includeBoatRental}
                                                        />
                                                        {errors.boat_children && <p className="text-sm text-red-500">{errors.boat_children}</p>}
                                                    </div>
                                                </div>

                                                {includeBoatRental && (
                                                    <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3">
                                                        <p className="text-sm font-medium text-blue-800">
                                                            <strong>Note:</strong> UBAAP Admin will assign an available boat for your reservation based on your requirements.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Pricing Summary */}
                                        <div className="border-t pt-4">
                                            <h3 className="mb-3 font-semibold text-gray-900">Booking Summary</h3>
                                            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                                                {nights > 0 && (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">
                                                                Room ({nights} {nights === 1 ? 'night' : 'nights'} × ₱
                                                                {room.price_per_night.toLocaleString()})
                                                            </span>
                                                            <span className="font-semibold text-gray-900">₱{roomTotal.toLocaleString()}</span>
                                                        </div>
                                                    </>
                                                )}
                                                {includeBoatRental && (
                                                    <div className="text-xs text-gray-600 italic">
                                                        * Boat rental included - UBAAP Admin will assign boat and pricing
                                                    </div>
                                                )}
                                                {nights > 0 && (
                                                    <div className="flex justify-between border-t pt-2 text-base font-bold">
                                                        <span className="text-gray-900">Amount to Pay (50% of Room Total)</span>
                                                        <span className="text-green-600">₱{finalPrice.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {nights === 0 && (
                                                    <p className="text-center text-sm text-gray-500">
                                                        Select check-in and check-out dates to see pricing
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full bg-[#18371e] hover:bg-[#2a5230]"
                                            disabled={processing || nights === 0 || !!dateError}
                                        >
                                            {processing ? 'Processing...' : 'Proceed to Booking'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment QR Code Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            Payment Details
                        </DialogTitle>
                        <DialogDescription>Scan the QR code below to complete your payment</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* QR Code Display */}
                        {hotelQrCode ? (
                            <div className="flex justify-center rounded-lg border bg-gray-50 p-4">
                                <img src={hotelQrCode} alt="Payment QR Code" className="h-64 w-64 rounded object-contain" />
                            </div>
                        ) : (
                            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed bg-gray-50">
                                <div className="text-center">
                                    <QrCode className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">QR Code not available</p>
                                </div>
                            </div>
                        )}

                        {/* Payment Summary */}
                        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Room Total ({nights} {nights === 1 ? 'night' : 'nights'}):</span>
                                <span className="font-bold text-gray-900">₱{roomTotal.toLocaleString()}</span>
                            </div>
                            {includeBoatRental && (
                                <div className="text-xs text-gray-600 italic">
                                    * Boat rental request submitted - UBAAP Admin will assign boat
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-2 text-base">
                                <span className="font-semibold text-gray-900">50% Payment Required:</span>
                                <span className="font-bold text-green-600">₱{finalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Note */}
                        <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-3">
                            <p className="text-sm font-medium text-yellow-800">
                                <strong>Note:</strong> Pay ₱{finalPrice.toLocaleString()} (50% of room total) to confirm your booking. The
                                remaining balance will be paid upon check-in. {includeBoatRental && 'Boat rental request will be processed separately by UBAAP Admin.'}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2 sm:justify-between">
                        <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleConfirmPayment} disabled={processing} className="bg-[#18371e] hover:bg-[#2a5230]">
                            {processing ? 'Processing...' : 'Confirm Payment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
