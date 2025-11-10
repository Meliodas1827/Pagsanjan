import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UpdateBookingStatusDialog from '@/components/hotel/update-booking-status-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Booking {
    id: number;
    reference_id: string;
    userid: number;
    hotelid: number;
    roomid: number;
    requested_date: string;
    no_of_adults: number;
    no_of_children: number;
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    booking_status: string;
    notes: string | null;
    user: {
        name: string;
        email: string;
    } | null;
    room: {
        room_name: string;
        room_type: string;
    } | null;
}

interface PageProps {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    hotel: {
        hotel_name: string;
    } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Bookings', href: '/booking-management' },
];

export default function BookingManagement() {
    const { bookings, hotel } = usePage<PageProps>().props;
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'secondary';
            case 'accepted':
                return 'default';
            case 'done':
                return 'default';
            case 'declined':
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const handleEditClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Management" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Hotel Booking Management</h1>
                <p className="text-muted-foreground">
                    {hotel ? `Manage bookings for ${hotel.hotel_name}` : 'Manage hotel bookings'}
                </p>
            </div>

            <div className="mx-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Hotel Bookings</CardTitle>
                        <CardDescription>
                            {hotel ? `All room bookings for ${hotel.hotel_name}` : 'All room bookings'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference ID</TableHead>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Check-In</TableHead>
                                    <TableHead>Check-Out</TableHead>
                                    <TableHead>Guests</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.data.length > 0 ? (
                                    bookings.data.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.reference_id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {booking.user?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {booking.user?.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {booking.room?.room_name || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {booking.room?.room_type || 'N/A'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(booking.check_in_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(booking.check_out_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{booking.no_of_adults} Adults</div>
                                                    <div className="text-muted-foreground">
                                                        {booking.no_of_children} Children
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>₱{booking.total_price ? Number(booking.total_price).toFixed(2) : '0.00'}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(booking.booking_status)}>
                                                    {booking.booking_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditClick(booking)}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                                            No bookings yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {selectedBooking && (
                <UpdateBookingStatusDialog
                    bookingId={selectedBooking.id}
                    currentStatus={selectedBooking.booking_status}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}
        </AppLayout>
    );
}
