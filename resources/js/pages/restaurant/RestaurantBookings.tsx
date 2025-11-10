import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Restaurant Bookings', href: '/restaurant-bookings' }];

interface RestoTable {
    id: number;
    resto_id: number;
    status: 'reserved' | 'available';
    no_of_chairs: number;
    price: number | string;
    deleted: number;
}

interface Booker {
    id: number;
    name: string;
    email: string;
}

interface RestoBooking {
    id: number;
    resto_id: number;
    resto_table_id: number;
    is_book_confirmed: boolean;
    confirmed_by: number | null;
    user_id_booker: number;
    no_of_guest: number;
    deleted: number;
    created_at: string;
    resto_table: RestoTable;
    booker: Booker;
}

export default function RestaurantBookings() {
    const { bookings } = usePage().props as { bookings: RestoBooking[] };

    const handleConfirmBooking = (booking: RestoBooking) => {
        if (confirm('Confirm this booking?')) {
            router.post(route('restaurant-bookings.confirm', booking.id), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Booking confirmed successfully!');
                },
                onError: (errors) => {
                    console.error('Confirm booking errors:', errors);
                    toast.error('Failed to confirm booking');
                },
            });
        }
    };

    const handleCancelBooking = (booking: RestoBooking) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            router.delete(route('restaurant-bookings.cancel', booking.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Booking cancelled successfully!');
                },
                onError: (errors) => {
                    console.error('Cancel booking errors:', errors);
                    toast.error('Failed to cancel booking');
                },
            });
        }
    };

    const activeBookings = bookings?.filter(b => !b.deleted) || [];
    const pendingBookings = activeBookings.filter(b => !b.is_book_confirmed);
    const confirmedBookings = activeBookings.filter(b => b.is_book_confirmed);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Restaurant Bookings" />

            <div className="mx-4 my-4 space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{activeBookings.length}</div>
                            <p className="text-xs text-muted-foreground">Total Bookings</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div>
                            <p className="text-xs text-muted-foreground">Pending Bookings</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">{confirmedBookings.length}</div>
                            <p className="text-xs text-muted-foreground">Confirmed Bookings</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Bookings */}
                {pendingBookings.length > 0 && (
                    <Card className="shadow-lg">
                        <CardTitle className="p-4 text-lg font-semibold">Pending Bookings</CardTitle>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Booking ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Table ID</TableHead>
                                        <TableHead>No. of Guests</TableHead>
                                        <TableHead>Date Booked</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingBookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>{booking.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.booker.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.booker.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{booking.resto_table_id}</TableCell>
                                            <TableCell>{booking.no_of_guest}</TableCell>
                                            <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleConfirmBooking(booking)}>
                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                    Confirm
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking)}>
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* All Bookings */}
                <Card className="shadow-lg">
                    <CardTitle className="p-4 text-lg font-semibold">All Bookings</CardTitle>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Table ID</TableHead>
                                    <TableHead>No. of Guests</TableHead>
                                    <TableHead>Date Booked</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeBookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                                            No bookings found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activeBookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>{booking.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.booker.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.booker.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{booking.resto_table_id}</TableCell>
                                            <TableCell>{booking.no_of_guest}</TableCell>
                                            <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                                                    booking.is_book_confirmed
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {booking.is_book_confirmed ? 'Confirmed' : 'Pending'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-2">
                                                {!booking.is_book_confirmed && (
                                                    <Button variant="outline" size="sm" onClick={() => handleConfirmBooking(booking)}>
                                                        <CheckCircle className="mr-1 h-4 w-4" />
                                                        Confirm
                                                    </Button>
                                                )}
                                                <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking)}>
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
