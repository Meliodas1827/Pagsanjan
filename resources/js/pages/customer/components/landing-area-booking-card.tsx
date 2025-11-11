import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { Calendar, Users, Sailboat, Clock, MapPin, MessageSquare, Star } from 'lucide-react';
import { useState } from 'react';
import { FeedbackDialog } from './feedback-dialog';

interface LandingAreaBooking {
    id: number;
    landing_area_id: number;
    user_id: number;
    no_of_guest: number;
    booking_date: string;
    booking_time: string;
    status: string;
    is_confirmed: boolean;
    created_at: string;
    has_feedback?: boolean;
    feedback?: any;
    landing_area: {
        id: number;
        name: string;
        location: string | null;
        price: number | string | null;
        image: string | null;
    };
}

interface PageProps {
    landingAreaBookings?: LandingAreaBooking[];
}

export default function LandingAreaBookingCard() {
    const { props } = usePage<PageProps>();
    const bookings = props.landingAreaBookings || [];

    const [feedbackDialog, setFeedbackDialog] = useState<{
        open: boolean;
        bookingId: number;
        existingFeedback?: any;
    }>({
        open: false,
        bookingId: 0,
        existingFeedback: null,
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (bookings.length === 0) {
        return (
            <div className="mt-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Sailboat className="mb-4 h-16 w-16 text-gray-400" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">No Landing Area Bookings</h3>
                        <p className="text-center text-gray-600">
                            You haven't made any boat ride reservations yet.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Sailboat className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-lg">
                                    {booking.landing_area.name}
                                </CardTitle>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                                {getStatusText(booking.status)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {booking.landing_area.image && (
                            <div className="mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={`/storage/${booking.landing_area.image}`}
                                    alt={booking.landing_area.name}
                                    className="h-32 w-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Booking ID:</span>
                                <span>#{booking.id}</span>
                            </div>

                            {booking.landing_area.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">Location:</span>
                                    <span className="truncate">{booking.landing_area.location}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Guests:</span>
                                <span>{booking.no_of_guest}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Date:</span>
                                <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Time:</span>
                                <span>{booking.booking_time}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Booked:</span>
                                <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>

                            {booking.landing_area.price && (
                                <div className="pt-2 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Trip Price:</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            ₱{Number(booking.landing_area.price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Feedback Button */}
                            {booking.status !== 'pending' && booking.status !== 'cancelled' && (
                                <div className='mt-3 pt-3 border-t border-gray-200'>
                                    <Button
                                        size="sm"
                                        variant={booking.has_feedback ? 'outline' : 'default'}
                                        onClick={() =>
                                            setFeedbackDialog({
                                                open: true,
                                                bookingId: booking.id,
                                                existingFeedback: booking.feedback,
                                            })
                                        }
                                        className="w-full"
                                    >
                                        {booking.has_feedback ? (
                                            <>
                                                <Star className="mr-1 h-3 w-3 fill-yellow-400" />
                                                View Feedback
                                            </>
                                        ) : (
                                            <>
                                                <MessageSquare className="mr-1 h-3 w-3" />
                                                Leave Feedback
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}

            <FeedbackDialog
                open={feedbackDialog.open}
                onOpenChange={(open) =>
                    setFeedbackDialog((prev) => ({
                        ...prev,
                        open,
                    }))
                }
                bookingId={feedbackDialog.bookingId}
                category="landing_area"
                existingFeedback={feedbackDialog.existingFeedback}
            />
        </div>
    );
}
