import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import AssignBoatModal  from './components/assign-boat-btn'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Assign Boat', href: '/assign-boat' },
];

  interface availableBoat { id: string | number; boat_no: string; capacity: number }[];

  type Booking = {
        id: number;
        date_of_booking: string;
        ride_time: string;
        guest_name: string;
        guest_email: string;
        no_of_adults: number;
        no_of_children: number;
        total_amount: number;
        status: string;
        boat_no: string | null;
    };

const AssignBoat = () => {
    const { props } = usePage<{ data: Booking[] }>();
    // console.log(props.data)
    const availableBoats = props.boats as availableBoat[];
    
  

    const formatDateTime = (dateStr: string, timeStr: string) => {
        const date = new Date(`${dateStr}T${timeStr}`);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assign Boat" />
            <div className="my-4 mx-4">
                <div
                    className="overflow-auto shadow-lg p-4 rounded-xl"
                    style={{ minHeight: '71vh', maxHeight: '71vh' }}
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Guest Name</TableHead>
                                <TableHead>No. of Guests</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Boat Assigned</TableHead>
                                <TableHead className='text-center'>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {props.data && props.data.length > 0 ? (
                                props.data.map((booking, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {booking.ride_time ? formatDateTime(booking.date_of_booking, booking.ride_time) : new Date(booking.date_of_booking).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                                        </TableCell>
                                        <TableCell>
                                            {booking.guest_name}
                                        </TableCell>
                                        <TableCell>
                                            {(booking.no_of_adults) + (booking.no_of_children)}
                                        </TableCell>

                                        <TableCell>₱{booking.total_amount.toLocaleString()}</TableCell>
                                        <TableCell className="capitalize">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                booking.status === 'boat_assigned' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </TableCell>
                                        <TableCell className='text-center'>{booking.boat_no ? booking.boat_no : '-'}</TableCell>

                                        <TableCell className='text-center'>
                                            <AssignBoatModal bookingId={booking.id} availableBoats={availableBoats}  />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center py-8 text-gray-400'>
                                        No boat bookings found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
};

export default AssignBoat;
