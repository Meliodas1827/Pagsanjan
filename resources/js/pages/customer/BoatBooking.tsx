import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ArrowLeft, LogOut, NotebookTabs, PhilippinePeso, User, UserRoundCog, Users } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

interface Boat {
    id: number;
    boat_no: string;
    bankero_name: string;
    capacity: number;
    available_slot: number;
    price_per_adult: number;
    price_per_child: number;
    status: 'onride' | 'booked' | 'available';
    image: string | null;
}

interface BookedDate {
    date: string;
    total_reserved: number;
}

interface BoatAvailability {
    capacity: number;
    reserved: number;
    available: number;
}

interface PageProps {
    boat: Boat;
    bookedDates: BookedDate[];
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
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-opacity-20 flex h-12 w-13 items-center justify-center rounded">
                            <img src="/images/logo.png" alt="logo" title="logo" />
                        </div>
                        <div className="font-bold text-white">
                            <div className="text-lg leading-tight">PAGSANJAN</div>
                            <div className="text-sm leading-tight">FALLS RESORT</div>
                        </div>
                    </Link>

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

export default function BoatBooking() {
    const { auth } = usePage<SharedData>().props;
    const { boat, bookedDates } = usePage<PageProps>().props;
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [dateError, setDateError] = useState<string>('');
    const [capacityError, setCapacityError] = useState<string>('');
    const [boatAvailability, setBoatAvailability] = useState<BoatAvailability | null>(null);
    const user = auth?.user?.role_id ?? 0;
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        boat_id: boat.id,
        date_of_booking: '',
        ride_time: '',
        no_of_adults: 1,
        no_of_children: 0,
    });

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Fetch boat availability for a specific date
    const fetchBoatAvailability = async (date: string) => {
        if (!date) return;

        try {
            const response = await fetch(`/boat-availability-single/${boat.id}/${date}`);
            const availability = await response.json();
            setBoatAvailability(availability);
        } catch (error) {
            console.error('Failed to fetch boat availability:', error);
        }
    };

    // Check if date is fully booked
    const isDateFullyBooked = (date: string): boolean => {
        const bookedDate = bookedDates.find((bd) => bd.date === date);
        return bookedDate ? bookedDate.total_reserved >= boat.capacity : false;
    };

    // Get booked dates message
    const getBookedDatesMessage = (): string => {
        if (bookedDates.length === 0) return '';

        const upcomingBookings = bookedDates
            .filter((booking) => new Date(booking.date) >= new Date())
            .slice(0, 3);

        if (upcomingBookings.length === 0) return '';

        return upcomingBookings
            .map((booking) => {
                const date = new Date(booking.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                });
                return `${date} (${booking.total_reserved}/${boat.capacity} seats)`;
            })
            .join(', ');
    };

    // Validate capacity
    const validateCapacity = (adults: number, children: number) => {
        const totalGuests = adults + children;

        // Check if total exceeds boat's maximum capacity
        if (totalGuests > boat.capacity) {
            setCapacityError(`Total guests (${totalGuests}) exceeds boat capacity (${boat.capacity})`);
            return false;
        }

        // Check if available seats are sufficient
        if (boatAvailability && totalGuests > boatAvailability.available) {
            setCapacityError(
                `Only ${boatAvailability.available} seat(s) available on this date. ${boatAvailability.reserved} seat(s) already reserved.`
            );
            return false;
        }

        setCapacityError('');
        return true;
    };

    // Handle date change
    const handleDateChange = (newDate: string) => {
        setData('date_of_booking', newDate);
        setDateError('');

        // Fetch boat availability for the new date
        fetchBoatAvailability(newDate);

        // Check if date is fully booked
        if (isDateFullyBooked(newDate)) {
            setDateError('This date is fully booked. Please select another date.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if date is fully booked
        if (isDateFullyBooked(data.date_of_booking)) {
            setDateError('This date is fully booked. Please select another date.');
            return;
        }

        // Check capacity
        if (!validateCapacity(data.no_of_adults, data.no_of_children)) {
            return;
        }

        // Show payment dialog
        setShowPaymentDialog(true);
    };

    const handleConfirmPayment = () => {
        post(route('boat.booking.store'), {
            onSuccess: () => {
                setShowPaymentDialog(false);
                setOpen(true);
            },
            onError: (errors) => {
                console.error('Booking failed:', errors);
                alert('Failed to create booking. Please try again.');
            },
        });
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // Calculate totals
    const totalAmount = data.no_of_adults * boat.price_per_adult + data.no_of_children * boat.price_per_child;

    return (
        <>
            <Head title={`Book Boat ${boat.boat_no}`} />
            <PublicNavBar role={user} />
            <Snackbar autoHideDuration={4000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Boat Booked Successfully
                </Alert>
            </Snackbar>
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link href={route('welcome')} className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>

                    {/* Boat Image */}
                    {boat.image && (
                        <Card className="mb-8">
                            <CardContent className="p-0">
                                <img
                                    src={`/storage/${boat.image}`}
                                    alt={boat.boat_no}
                                    className="h-96 w-full rounded-t-lg object-cover"
                                />
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left Column - Boat Details */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Boat {boat.boat_no}</CardTitle>
                                    {boat.bankero_name && <p className="text-sm text-gray-600">Bankero: {boat.bankero_name}</p>}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Boat Specs */}
                                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="mr-2 h-5 w-5 text-green-600" />
                                            <span>Capacity: {boat.capacity} guests</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                                boat.status === 'available' ? 'bg-green-100 text-green-800' :
                                                boat.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {boat.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex items-center">
                                            <PhilippinePeso className="me-1 h-5 w-5 text-green-600" />
                                            <span className="text-2xl font-bold text-gray-900">{boat.price_per_adult}</span>
                                            <span className="ml-2 text-gray-500">/ adult</span>
                                        </div>
                                        <div className="flex items-center">
                                            <PhilippinePeso className="me-1 h-5 w-5 text-green-600" />
                                            <span className="text-2xl font-bold text-gray-900">{boat.price_per_child}</span>
                                            <span className="ml-2 text-gray-500">/ child</span>
                                        </div>
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
                                                <p className="text-xs font-semibold text-yellow-800 mb-1">Booked Dates:</p>
                                                <p className="text-xs text-yellow-700">{getBookedDatesMessage()}</p>
                                            </div>
                                        )}

                                        {/* Date Error */}
                                        {dateError && (
                                            <div className="rounded-md bg-red-50 p-3 border border-red-200">
                                                <p className="text-sm font-semibold text-red-800">{dateError}</p>
                                            </div>
                                        )}

                                        {/* Date and Time */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="date_of_booking">Date</Label>
                                                <Input
                                                    id="date_of_booking"
                                                    type="date"
                                                    value={data.date_of_booking}
                                                    min={getTodayDate()}
                                                    onChange={(e) => handleDateChange(e.target.value)}
                                                    required
                                                />
                                                {errors.date_of_booking && <p className="text-sm text-red-500">{errors.date_of_booking}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="ride_time">Time</Label>
                                                <Input
                                                    id="ride_time"
                                                    type="time"
                                                    value={data.ride_time}
                                                    onChange={(e) => setData('ride_time', e.target.value)}
                                                    required
                                                />
                                                {errors.ride_time && <p className="text-sm text-red-500">{errors.ride_time}</p>}
                                            </div>
                                        </div>

                                        {/* Guests */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="no_of_adults">Adults</Label>
                                                <Input
                                                    id="no_of_adults"
                                                    type="number"
                                                    min="1"
                                                    max={boatAvailability?.available || boat.capacity}
                                                    value={data.no_of_adults}
                                                    onChange={(e) => {
                                                        const newAdults = parseInt(e.target.value);
                                                        setData('no_of_adults', newAdults);
                                                        validateCapacity(newAdults, data.no_of_children);
                                                    }}
                                                    required
                                                />
                                                {errors.no_of_adults && <p className="text-sm text-red-500">{errors.no_of_adults}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="no_of_children">Children</Label>
                                                <Input
                                                    id="no_of_children"
                                                    type="number"
                                                    min="0"
                                                    max={boatAvailability?.available ? boatAvailability.available - data.no_of_adults : boat.capacity - data.no_of_adults}
                                                    value={data.no_of_children}
                                                    onChange={(e) => {
                                                        const newChildren = parseInt(e.target.value);
                                                        setData('no_of_children', newChildren);
                                                        validateCapacity(data.no_of_adults, newChildren);
                                                    }}
                                                />
                                                {errors.no_of_children && <p className="text-sm text-red-500">{errors.no_of_children}</p>}
                                            </div>
                                        </div>

                                        {/* Availability Display */}
                                        {boatAvailability && data.date_of_booking && (
                                            <div className="rounded bg-gray-100 p-3 text-sm">
                                                <p className="text-gray-700">
                                                    Available seats: {boatAvailability.available} / {boatAvailability.capacity}
                                                    {boatAvailability.reserved > 0 && ` (${boatAvailability.reserved} reserved)`}
                                                </p>
                                            </div>
                                        )}

                                        {/* Capacity Error */}
                                        {capacityError && (
                                            <div className="rounded-md bg-red-50 p-3 border border-red-200">
                                                <p className="text-sm font-semibold text-red-800">{capacityError}</p>
                                            </div>
                                        )}

                                        {/* Pricing Summary */}
                                        <div className="border-t pt-4">
                                            <h3 className="mb-3 font-semibold text-gray-900">Booking Summary</h3>
                                            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Adults ({data.no_of_adults} × ₱{boat.price_per_adult.toLocaleString()})
                                                    </span>
                                                    <span className="font-semibold text-gray-900">
                                                        ₱{(data.no_of_adults * boat.price_per_adult).toLocaleString()}
                                                    </span>
                                                </div>
                                                {data.no_of_children > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            Children ({data.no_of_children} × ₱{boat.price_per_child.toLocaleString()})
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            ₱{(data.no_of_children * boat.price_per_child).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between border-t pt-2 text-base font-bold">
                                                    <span className="text-gray-900">Total Amount</span>
                                                    <span className="text-green-600">₱{totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full bg-[#18371e] hover:bg-[#2a5230]"
                                            disabled={processing || !data.date_of_booking || !data.ride_time || !!dateError || !!capacityError}
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

            {/* Payment Confirmation Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Booking</DialogTitle>
                        <DialogDescription>Review your booking details before confirming</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Booking Details */}
                        <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Boat:</span>
                                <span className="text-gray-900">{boat.boat_no}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Date:</span>
                                <span className="text-gray-900">
                                    {new Date(data.date_of_booking).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Time:</span>
                                <span className="text-gray-900">{data.ride_time}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Guests:</span>
                                <span className="text-gray-900">
                                    {data.no_of_adults} adult(s), {data.no_of_children} child(ren)
                                </span>
                            </div>
                            <div className="flex justify-between border-t pt-2 text-base">
                                <span className="font-semibold text-gray-900">Total Amount:</span>
                                <span className="font-bold text-green-600">₱{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Note */}
                        <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-3">
                            <p className="text-sm font-medium text-yellow-800">
                                <strong>Note:</strong> Your booking will be confirmed after payment verification.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2 sm:justify-between">
                        <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleConfirmPayment} disabled={processing} className="bg-[#18371e] hover:bg-[#2a5230]">
                            {processing ? 'Processing...' : 'Confirm Booking'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
