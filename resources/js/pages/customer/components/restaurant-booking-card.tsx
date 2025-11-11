import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { Calendar, Users, UtensilsCrossed, Clock, MessageSquare, Star } from 'lucide-react';
import { useState } from 'react';
import { FeedbackDialog } from './feedback-dialog';

interface RestaurantBooking {
    id: number;
    resto_id: number;
    resto_table_id: number;
    is_book_confirmed: boolean;
    no_of_guest: number;
    created_at: string;
    has_feedback?: boolean;
    feedback?: any;
    resto: {
        id: number;
        resto_name: string;
        img: string | null;
    };
    resto_table: {
        id: number;
        no_of_chairs: number;
        price: number | string;
    };
}

interface PageProps {
    restaurantBookings?: RestaurantBooking[];
}

export default function RestaurantBookingCard() {
    const { props } = usePage<PageProps>();
    const bookings = props.restaurantBookings || [];

    const [feedbackDialog, setFeedbackDialog] = useState<{
        open: boolean;
        bookingId: number;
        existingFeedback?: any;
    }>({
        open: false,
        bookingId: 0,
        existingFeedback: null,
    });

    const getStatusColor = (confirmed: boolean) => {
        return confirmed
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    };

    const getStatusText = (confirmed: boolean) => {
        return confirmed ? 'Confirmed' : 'Pending';
    };

    if (bookings.length === 0) {
        return (
            <div className="mt-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <UtensilsCrossed className="mb-4 h-16 w-16 text-gray-400" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">No Restaurant Bookings</h3>
                        <p className="text-center text-gray-600">
                            You haven't made any restaurant table reservations yet.
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
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                                <CardTitle className="text-lg">
                                    {booking.resto.resto_name}
                                </CardTitle>
                            </div>
                            <Badge className={getStatusColor(booking.is_book_confirmed)}>
                                {getStatusText(booking.is_book_confirmed)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {booking.resto.img && (
                            <div className="mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={booking.resto.img}
                                    alt={booking.resto.resto_name}
                                    className="h-32 w-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 text-orange-600" />
                                <span className="font-medium">Booking ID:</span>
                                <span>#{booking.id}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="h-4 w-4 text-orange-600" />
                                <span className="font-medium">Guests:</span>
                                <span>{booking.no_of_guest}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                                <span className="font-medium">Table:</span>
                                <span>#{booking.resto_table_id} ({booking.resto_table.no_of_chairs} seats)</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4 text-orange-600" />
                                <span className="font-medium">Booked:</span>
                                <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Table Price:</span>
                                    <span className="text-lg font-bold text-orange-600">
                                        ₱{Number(booking.resto_table.price).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Feedback Button */}
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
                category="restaurant"
                existingFeedback={feedbackDialog.existingFeedback}
            />
        </div>
    );
}
