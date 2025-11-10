import React, { JSX, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
    MapPin,
    Phone,
    Mail,
    CreditCard,
    Clock,
    AlertCircle,
    Sailboat,
    Wallet,
    PhilippinePeso
} from 'lucide-react';
import BookingHeader from '../landing-page/components/bookings-header';
import CustomerLayout from './layout/layout';
import { Link, usePage } from '@inertiajs/react';
import { BookingProps } from './types/view-details';
import BoatRideBadge from './components/boat-ride-badge';
import { Button } from '@/components/ui/button';


const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(price);
};

const calculateNights = (checkIn: string | Date, checkOut: string | Date): number => {
    return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
};

export default function BookingDetailsPage(): JSX.Element {
    const { props } = usePage<BookingProps>();
    const BoatRideStatus = props.boat_ride_status?.status;
    const EntityDetails = props.entity_details;
    const BookingDetails = props.booking_information;
    const CancelationOptions = props.cancellation_options;

    //    console.log(BookingDetails);


    return (
        <CustomerLayout>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}

                <BookingHeader
                    id={BookingDetails.id}
                    bookingReference={BookingDetails.reference_id}
                    bookingStatus={EntityDetails.booking_status}
                    cancellationOptions={CancelationOptions}
                    paymentStatus={BookingDetails.payment_status}
                    payment_type={BookingDetails.payment_type}
                />

                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Resort Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        {EntityDetails.reservation_type}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Resort Image */}
                                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">Resort Image</span>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">{EntityDetails.resort_name}</h3>
                                        <p className="text-gray-600 mb-4">Pagsanjan Laguna, Philippines</p>

                                        {/* Resort Contact */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span>{EntityDetails.contact}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <span>{EntityDetails.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className='mb-3'>
                                        <h4 className="font-medium mb-3">Amenities</h4>
                                        <h4 className="ml-5">
                                            {EntityDetails.amenities}

                                        </h4>
                                    </div>


                                </CardContent>
                            </Card>

                            {/* Booking Timeline */}
                            <Card className='mb-8'>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Booking Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Important Dates</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Booking Created</p>
                                                    <p className="font-medium">{formatDateTime(BookingDetails.created_at)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                                                    <p className="font-medium">{formatDateTime(BookingDetails.updated_at)}</p>
                                                </div>
                                                <div className='mb-3'>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Service Date</p>
                                                    <p className="font-medium">{formatDate(BookingDetails.service_date)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Stay Schedule</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Check-in</p>
                                                    <p className="font-medium">{formatDate(BookingDetails.check_in_date)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Check-out</p>
                                                    <p className="font-medium">{formatDate(BookingDetails.check_out_date)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">No of Nights</p>
                                                    <p className="font-medium">{BookingDetails.no_of_nights}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            {BoatRideStatus &&

                                <Card className='border-t-8 border-green-700'>

                                    <CardContent className="space-y-3">
                                        <CardTitle className='flex gap-2'><Sailboat size={18} />Boat Ride Request</CardTitle>

                                        <div className='flex gap-2'>

                                            <h1 className='font-bold'>
                                                Status:
                                            </h1>
                                            <BoatRideBadge status={BoatRideStatus.split('_').join(' ')} />
                                        </div>
                                        <p className='mt-2 text-slate-600 text-xs '>
                                            <strong>Note:</strong> Boat ride payment will be available after check-in of the guests to their respective accomodation.
                                        </p>

                                    </CardContent>
                                </Card>
                            }

                            {/* Payment Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Booking Amount Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Rate ({BookingDetails.no_of_nights} nights)</span>
                                            <span>{formatPrice(BookingDetails.total_price)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Discount(%)</span>
                                            <span>0%</span>
                                        </div>


                                    </div>

                                    <Separator />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{formatPrice(BookingDetails.total_price)}</span>
                                    </div>
                                    {/* 
                                    <div className="pt-3 border-t space-y-2 text-sm text-gray-600 italic">
                                        if accepted show paynow button else if paid balance show the payment summary with downloadable invoice
                                    </div> */}
                                </CardContent>
                            </Card>


                            {/* pay now button if accepted */}
                            {
                                EntityDetails.booking_status.toLowerCase() === 'accepted' &&
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Wallet className="h-5 w-5" />
                                            Payment Breakdown
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Down Payment(30%) </span>
                                                <span>{formatPrice(BookingDetails.total_price * .3)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Balance </span>
                                                <span>{formatPrice(BookingDetails.total_price - BookingDetails.total_price * .3)}</span>
                                            </div>


                                        </div>

                                        <Separator />

                                        <div className="flex justify-between font-bold text-lg">

                                            {BookingDetails.payment_status !== 'completed' ?
                                                <Link href={route('billing.now')} className='w-full'>

                                                    <Button variant={'default'} className='bg-blue-700 w-full'>
                                                        Pay Down Payment {formatPrice(BookingDetails.total_price * .3)}
                                                    </Button>
                                                </Link>


                                                : <Button variant={'default'} disabled className='bg-blue-700 w-full'>
                                                    Down Payment Paid {formatPrice(BookingDetails.total_price * .3)}
                                                </Button>
                                            }


                                        </div>

                                    </CardContent>
                                </Card>
                            }


                            {/* Support Contact */}
                            <Card>
                                <CardContent>
                                    <CardTitle>Need Help?</CardTitle>

                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <p className="mb-3">Contact our support team for any questions or changes to your booking.</p>
                                            <div className="space-y-1 text-sm">
                                                <p><strong>Phone:</strong> {EntityDetails.contact}</p>
                                                <p><strong>Email:</strong> {EntityDetails.email}</p>
                                                <p><strong>Hours:</strong> 24/7 Support Available</p>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>

    );
}