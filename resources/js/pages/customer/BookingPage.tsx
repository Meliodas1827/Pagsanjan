import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button as UIButton } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { MessageSquare, Star } from 'lucide-react';
import BoatBookingCard from './components/boat-ride-card';
import MyBookingPage from './components/my-booking-page';
import RestaurantBookingCard from './components/restaurant-booking-card';
import LandingAreaBookingCard from './components/landing-area-booking-card';
import { FeedbackDialog } from './components/feedback-dialog';
import CustomerLayout from './layout/layout';

interface Feedback {
    rating: number;
    comment: string;
}

interface HotelBooking {
    id: number;
    reference_id: string;
    booking_status: string;
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    no_of_adults: number;
    no_of_children: number;
    created_at: string;
    has_feedback: boolean;
    feedback: Feedback | null;
}

interface ResortBooking {
    id: number;
    status: string;
    date_checkin: string;
    date_checkout: string;
    payment_proof: string;
    resort_name: string;
    resort_image: string;
    created_at: string;
    has_feedback: boolean;
    feedback: Feedback | null;
}

function createData(
    id: string,
    reference_id: string,
    booking_status: string,
    check_in_date: string,
    check_out_date: string,
    total_price: number,
    no_of_adults: number,
    no_of_children: number,
    created_at: string,
) {
    return { id, reference_id, booking_status, check_in_date, check_out_date, total_price, no_of_adults, no_of_children, created_at };
}

export default function BookingUserPage() {
    const { props } = usePage<BookingPageProps>();
    const { hotelbookings = [], resortbookings = [] } = props;

    const [feedbackDialog, setFeedbackDialog] = useState<{
        open: boolean;
        bookingId: number;
        category: 'resort' | 'hotel' | 'ubaap' | 'restaurant' | 'landing_area';
        bookingReference?: string;
        existingFeedback?: Feedback | null;
    }>({
        open: false,
        bookingId: 0,
        category: 'resort',
        bookingReference: undefined,
        existingFeedback: null,
    });

    const hotelRows = hotelbookings.map((booking) =>
        createData(
            booking.id,
            booking.reference_id,
            booking.booking_status,
            booking.check_in_date,
            booking.check_out_date,
            booking.total_price,
            booking.no_of_adults,
            booking.no_of_children,
            booking.created_at,
        ),
    );

    return (
        <>
            <CustomerLayout>
                <div className="p-6 pb-0">
                    <div className="mb-4 flex-col items-center gap-4">
                        <h1 className="mb-1 text-3xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-sm text-gray-600 italic">Manage and track all your reservations</p>
                    </div>
                    <Tabs defaultValue="resortBookings" className="w-full">
                        <TabsList>
                            <TabsTrigger value="resortBookings" className="data-[state-active]:bg-white">
                                Resort Bookings
                            </TabsTrigger>
                            <TabsTrigger value="hotelBookings" className="data-[state-active]:bg-white">
                                Hotel Bookings
                            </TabsTrigger>
                            <TabsTrigger value="boatBookings" className="data-[state-active]:bg-white">
                                Boat Bookings
                            </TabsTrigger>
                            <TabsTrigger value="restaurantBookings" className="data-[state-active]:bg-white">
                                Restaurant Bookings
                            </TabsTrigger>
                            <TabsTrigger value="landingAreaBookings" className="data-[state-active]:bg-white">
                                Landing Area Bookings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="resortBookings" className="mt-0">
                            <div className="mt-6">
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="resort bookings table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    ID
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Resort Name
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Status
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Check In Date
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Check Out Date
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Created At
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Feedback
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {resortbookings.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{ fontSize: '11px', py: 4 }}>
                                                        No resort bookings found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                resortbookings.map((booking) => (
                                                    <TableRow key={booking.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row" sx={{ fontSize: '11px' }}>
                                                            {booking.id}
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                            {booking.resort_name}
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                            <Button
                                                                variant="contained"
                                                                color={
                                                                    booking.status === 'pending'
                                                                        ? 'warning'
                                                                        : booking.status === 'declined'
                                                                          ? 'error'
                                                                          : 'success'
                                                                }
                                                                size="small"
                                                                loadingPosition="center"
                                                                sx={{ fontSize: '11px', borderRadius: '50px' }}
                                                            >
                                                                {booking.status}
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                            {booking.date_checkin}
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                            {booking.date_checkout}
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                            {new Date(booking.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                            {booking.status !== 'pending' && booking.status !== 'declined' && (
                                                                <UIButton
                                                                    size="sm"
                                                                    variant={booking.has_feedback ? 'outline' : 'default'}
                                                                    onClick={() =>
                                                                        setFeedbackDialog({
                                                                            open: true,
                                                                            bookingId: booking.id,
                                                                            category: 'resort',
                                                                            existingFeedback: booking.feedback,
                                                                        })
                                                                    }
                                                                >
                                                                    {booking.has_feedback ? (
                                                                        <>
                                                                            <Star className="mr-1 h-3 w-3 fill-yellow-400" />
                                                                            View
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <MessageSquare className="mr-1 h-3 w-3" />
                                                                            Feedback
                                                                        </>
                                                                    )}
                                                                </UIButton>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </TabsContent>

                        <TabsContent value="hotelBookings" className="mt-0">
                            <MyBookingPage />
                            <div className="mt-6">
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="hotel bookings table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    ID
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Reference ID
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Status
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Check In Date
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Check Out Date
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Total Price
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    No of Adults
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    No of Children
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Created At
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                                    Feedback
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {hotelRows.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={10} align="center" sx={{ fontSize: '11px', py: 4 }}>
                                                        No hotel bookings found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                hotelRows.map((row) => {
                                                    const booking = hotelbookings.find(b => b.id === row.id);
                                                    return (
                                                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell component="th" scope="row" sx={{ fontSize: '11px' }}>
                                                                {row.id}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                {row.reference_id}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                <Button
                                                                    variant="contained"
                                                                    color={
                                                                        row.booking_status === 'pending'
                                                                            ? 'warning'
                                                                            : row.booking_status === 'declined'
                                                                              ? 'error'
                                                                              : 'success'
                                                                    }
                                                                    size="small"
                                                                    loadingPosition="center"
                                                                    sx={{ fontSize: '11px', borderRadius: '50px' }}
                                                                >
                                                                    {row.booking_status}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                {row.check_in_date}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                {row.check_out_date}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                {row.total_price}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                {row.no_of_adults}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                {row.no_of_children}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                {row.created_at}
                                                            </TableCell>
                                                            <TableCell align="left" sx={{ fontSize: '11px' }}>
                                                                {booking && row.booking_status !== 'pending' && row.booking_status !== 'declined' && (
                                                                    <UIButton
                                                                        size="sm"
                                                                        variant={booking.has_feedback ? 'outline' : 'default'}
                                                                        onClick={() =>
                                                                            setFeedbackDialog({
                                                                                open: true,
                                                                                bookingId: booking.id,
                                                                                category: 'hotel',
                                                                                bookingReference: booking.reference_id,
                                                                                existingFeedback: booking.feedback,
                                                                            })
                                                                        }
                                                                    >
                                                                        {booking.has_feedback ? (
                                                                            <>
                                                                                <Star className="mr-1 h-3 w-3 fill-yellow-400" />
                                                                                View
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <MessageSquare className="mr-1 h-3 w-3" />
                                                                                Feedback
                                                                            </>
                                                                        )}
                                                                    </UIButton>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </TabsContent>
                        <TabsContent value="boatBookings" className="mt-0">
                            <BoatBookingCard />
                        </TabsContent>
                        <TabsContent value="restaurantBookings" className="mt-0">
                            <RestaurantBookingCard />
                        </TabsContent>
                        <TabsContent value="landingAreaBookings" className="mt-0">
                            <LandingAreaBookingCard />
                        </TabsContent>
                    </Tabs>
                </div>
            </CustomerLayout>

            <FeedbackDialog
                open={feedbackDialog.open}
                onOpenChange={(open) =>
                    setFeedbackDialog((prev) => ({
                        ...prev,
                        open,
                    }))
                }
                bookingId={feedbackDialog.bookingId}
                category={feedbackDialog.category}
                bookingReference={feedbackDialog.bookingReference}
                existingFeedback={feedbackDialog.existingFeedback}
            />
        </>
    );
}
