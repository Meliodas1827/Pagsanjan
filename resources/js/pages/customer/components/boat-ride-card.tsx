import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sailboat, Clock, Users, PhilippinePeso, Calendar, MessageSquare, Star } from 'lucide-react';
import BoatRideBadge from './boat-ride-badge';
import { usePage } from '@inertiajs/react';
import { BookingProps } from '../types/view-details';
import { useState } from 'react';
import { FeedbackDialog } from './feedback-dialog';

const BoatBookingCard = () => {
    const { props } = usePage<BookingProps>();
    const bookingsData = props.boat_ride_data;
    console.log(bookingsData);

    const [feedbackDialog, setFeedbackDialog] = useState<{
        open: boolean;
        bookingId: number;
        existingFeedback?: any;
    }>({
        open: false,
        bookingId: 0,
        existingFeedback: null,
    });

    if(!bookingsData || bookingsData.length === 0){
        return (
        <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boat bookings found</h3>
            <p className="text-gray-500">
               You haven't made any boat bookings yet.
            </p>
          </div>
        )
    }

    // Format time from military to 12-hour format
    const formatTime = (timeString : string) => {
        if (!timeString) return 'Not set';

        const [hours, minutes] = timeString.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const period = hour24 >= 12 ? 'PM' : 'AM';

        return `${hour12}:${minutes} ${period}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="grid gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {bookingsData.map((booking: any, index: number) => {
                const status = booking?.status || 'pending';
                const boatAssigned = booking?.boat_no || 'To be assigned';
                const rideTime = formatTime(booking?.ride_time);
                const numberOfAdults = booking?.no_of_adults || 0;
                const numberOfChildren = booking?.no_of_children || 0;
                const totalAmount = booking?.total_amount || 0;
                const pricePerAdult = booking?.price_per_adult || '0.00';
                const pricePerChild = booking?.price_per_child || '0.00';
                const createdAt = formatDate(booking?.created_at);

                return (
                    <Card key={index} className='border-t-8 border-green-700'>
                        <CardContent className="space-y-4 p-6">
                            <CardTitle className='flex flex-row items-center justify-between'>
                                <span className='flex gap-2'>
                                    <Sailboat size={18} />
                                    Boat Ride
                                </span>
                                <BoatRideBadge status={status.split('_').join(' ')} />
                            </CardTitle>

                            {/* Booking Date */}
                            <div className='space-y-1'>
                                <h3 className='font-semibold text-sm text-gray-700 flex items-center gap-1'>
                                    <Calendar size={14} />
                                    Booked On:
                                </h3>
                                <p className='text-xs text-gray-600'>{createdAt}</p>
                            </div>

                            {/* Boat Assignment */}
                            <div className='space-y-1'>
                                <h3 className='font-semibold text-sm text-gray-700'>Boat Assigned:
                                     <span className={`ml-2 italic text-sm font-bold ${
                                         boatAssigned === 'To be assigned'
                                             ? 'text-yellow-600'
                                             : 'text-green-700'
                                     }`}>
                                         {boatAssigned}
                                     </span>
                                </h3>
                            </div>

                            {/* Pricing Information */}
                            <div className='space-y-2'>
                                <h3 className='font-semibold text-sm text-gray-700 flex items-center gap-1'>
                                    <PhilippinePeso size={14} />
                                    Pricing:
                                </h3>
                                <div className='text-xs text-gray-600 space-y-1'>
                                    <div className='flex justify-between'>
                                        <span>Adult (per head):</span>
                                        <span>₱{pricePerAdult}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Children (per head):</span>
                                        <span>₱{pricePerChild}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ride Time */}
                            <div className='space-y-1'>
                                <h3 className='font-semibold text-sm text-gray-700 flex items-center gap-1'>
                                    <Clock size={14} />
                                    Ride Time:
                                </h3>
                                <p className='text-sm text-gray-600'>{rideTime}</p>
                            </div>

                            {/* Guest Count */}
                            <div className='space-y-2'>
                                <h3 className='font-semibold text-sm text-gray-700 flex items-center gap-1'>
                                    <Users size={14} />
                                    Guests:
                                </h3>
                                <div className='text-xs text-gray-600 space-y-1'>
                                    <div className='flex justify-between'>
                                        <span>Adults:</span>
                                        <span>{numberOfAdults}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Children:</span>
                                        <span>{numberOfChildren}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className='border-t pt-3'>
                                <div className='flex justify-between items-center'>
                                    <h3 className='font-bold text-sm text-gray-800'>Total Amount:</h3>
                                    <span className='font-bold text-lg text-green-700'>₱{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Payment Note */}
                            <p className='mt-3 text-slate-600 text-xs bg-yellow-50 p-2 rounded border-l-4 border-yellow-400'>
                                <strong>Note:</strong> Boat ride payment will be available after check-in of the guests to their respective accommodation (walk-in payment).
                            </p>

                            {/* Feedback Button */}
                            {status !== 'pending' && status !== 'declined' && (
                                <div className='mt-3'>
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
                        </CardContent>
                    </Card>
                );
            })}

            <FeedbackDialog
                open={feedbackDialog.open}
                onOpenChange={(open) =>
                    setFeedbackDialog((prev) => ({
                        ...prev,
                        open,
                    }))
                }
                bookingId={feedbackDialog.bookingId}
                category="ubaap"
                existingFeedback={feedbackDialog.existingFeedback}
            />
        </div>
    );
};

export default BoatBookingCard;