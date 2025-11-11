import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Booking {
    id: number;
    booking_reference: string;
    user: {
        name: string;
        email: string;
    };
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    pwd: number;
    senior: number;
    total_guests: number;
    total_amount: number;
    booking_status: string;
    status: string;
    created_at: string;
}

interface PageProps {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    statistics: {
        total: number;
        confirmed: number;
        pending: number;
        completed: number;
        cancelled: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Bookings', href: '/resort-bookings' }];

export default function ResortBookings() {
    const { bookings, statistics } = usePage<PageProps>().props;
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

    const handleStatusUpdate = (bookingId: number, newStatus: string) => {
        setUpdatingStatus(bookingId);

        router.put(
            `/resort-bookings/${bookingId}/status`,
            { status: newStatus },
            {
                onSuccess: () => {
                    toast.success('Booking status updated successfully');
                    setUpdatingStatus(null);
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Failed to update status');
                    setUpdatingStatus(null);
                },
            }
        );
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'declined':
                return 'destructive';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resort Bookings" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Resort Bookings</h1>
                <p className="text-muted-foreground">Manage all resort bookings</p>
            </div>

            {/* Statistics Cards */}
            <div className="mx-4 mb-4 grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{statistics.confirmed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{statistics.completed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{statistics.cancelled}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Bookings Table */}
            <div className="mx-4">
                <Card>
                    <CardHeader>
                        <CardTitle>All Bookings</CardTitle>
                        <CardDescription>List of all resort bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Check In</TableHead>
                                    <TableHead>Check Out</TableHead>
                                    <TableHead>Guest Details</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Booked Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.data.length > 0 ? (
                                    bookings.data.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{booking.user.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {formatDate(booking.check_in)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {formatDate(booking.check_out)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3 text-muted-foreground" />
                                                        <span className="font-medium">Total: {booking.total_guests}</span>
                                                    </div>
                                                    {booking.adults > 0 && <div>Adults: {booking.adults}</div>}
                                                    {booking.children > 0 && <div>Children: {booking.children}</div>}
                                                    {booking.pwd > 0 && <div>PWD: {booking.pwd}</div>}
                                                    {booking.senior > 0 && <div>Senior: {booking.senior}</div>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{formatCurrency(booking.total_amount)}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusColor(booking.booking_status)}>{booking.booking_status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={booking.status}
                                                    onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                                                    disabled={updatingStatus === booking.id}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="accepted">Accepted</SelectItem>
                                                        <SelectItem value="declined">Declined</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>{formatDate(booking.created_at)}</TableCell>
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
        </AppLayout>
    );
}
