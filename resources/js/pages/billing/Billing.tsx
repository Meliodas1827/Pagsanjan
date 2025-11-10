import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Calendar,
    MapPin,
    Users,
    Phone,
    CreditCard,
    Clock,
    AlertTriangle,
    Shield,
    Check,
    Plus,
    Receipt,
    Building,
    Mail
} from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { formatDate, formatAmenities, formatPrice, formatDateTime } from '@/helpers/formatData';
import PaymentMethodDialog from './components/payment-dialog';
import { usePaymentStore } from '@/utils/store';
import { SharedData } from '@/types';
import { BookingData } from '../customer/types/booking';
import axios from 'axios';
import BillingWarning from './components/billing-warning';
import CustomerLayout from '../customer/layout/layout';

// Calculate pricing breakdown
const calculatePricing = (totalPrice: number) => {
    const subtotal = totalPrice * 0.85; // Assuming 85% is base price
    // const serviceFee = totalPrice * 0.05; // 5% service fee
    // const taxes = totalPrice * 0.10; // 10% taxes
    const downPayment = totalPrice * 0.30; // 30% down payment
    const remainingBalance = totalPrice * 0.70; // 70% remaining

    return {
        subtotal,
        // serviceFee,
        // taxes,
        total: totalPrice,
        downPayment,
        remainingBalance
    };
};



export default function BillingPage() {
    const { props } = usePage<SharedData>();
    const bookingData = props.resortbookings as BookingData[];
    const currentBooking = bookingData?.[0];
    const bookingTotalPrice = Number(currentBooking.total_price);

    const { paymentMethod } = usePaymentStore();


    const [formData, setFormData] = useState({
        terms: false,
        email: props.auth?.user?.email || '',
        phone: currentBooking?.phone || '',
        specialRequests: ''
    });

    if (currentBooking.booking_status !== 'accepted') {
        return (
            <CustomerLayout >

                  <Card className='m-6'>
                    <CardContent>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
                        <p className="text-gray-600">Review your booking details and complete your reservation</p>
                        <div className="flex items-center gap-2 mt-2 mb-6">
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                                Booking Ref: {currentBooking.reference_id}
                            </Badge>
                            <Badge className={`${currentBooking.booking_status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {currentBooking.booking_status.charAt(0).toUpperCase() + currentBooking.booking_status.slice(1)}
                            </Badge>
                        </div>
                    <BillingWarning />
                    </CardContent>

                </Card>

            </CustomerLayout>
        )
    }

    if (!currentBooking) {
        return (
            <CustomerLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Card className="max-w-md mx-auto">
                        <CardContent className="p-8 text-center">
                            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Booking Found</h3>
                            <p className="text-gray-500 mb-4">There's no booking data available for billing.</p>
                            <Button onClick={() => router.visit('/')}>Return to Home</Button>
                        </CardContent>
                    </Card>
                </div>
            </CustomerLayout>
        );
    }

    const pricing = calculatePricing(bookingTotalPrice);

    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePayment = async () => {
        axios.post(route('payment.now'), {
            booking_id: bookingData[0].id,
            amount: pricing.downPayment,
            email: formData.email,
            phone: formData.phone,
            payment_method: paymentMethod?.method?.id
        })
            .then(res => {
                if (res.data.url) {
                    window.location.href = res.data.url; // redirect
                } else if (res.data.error) {
                    alert(res.data.error);
                }
            });
    };



    return (
        <CustomerLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
                        <p className="text-gray-600">Review your booking details and complete your reservation</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                                Booking Ref: {currentBooking.reference_id}
                            </Badge>
                            <Badge className={`${currentBooking.booking_status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {currentBooking.booking_status.charAt(0).toUpperCase() + currentBooking.booking_status.slice(1)}
                            </Badge>
                        </div>
                    </div>

                    {/* Payment Urgency Alert */}
                    <Alert className="mb-6 border-orange-200 bg-orange-50">
                        <AlertDescription className="text-orange-800">
                            <div className="flex items-center justify-between gap-20">
                                <div>
                                    <p className="font-medium mb-1 flex items-center gap-2">
                                        <AlertTriangle size={16} />

                                        Payment Deadline</p>
                                    <p className="text-sm">Complete your payment to secure your reservation. Your booking will expire if not paid within the deadline.</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-orange-900 font-mono">{bookingData[0].remaining_time} remaining</span>
                                    
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Booking Details Card */}
                            <Card>
                                <CardHeader className="bg-blue-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-blue-900">
                                        <Building className="h-5 w-5" />
                                        Booking Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Room Information */}
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{currentBooking.room_name}</h3>
                                                <Badge className="bg-blue-100 text-blue-800 mb-3">
                                                    {currentBooking.booking_type.charAt(0).toUpperCase() + currentBooking.booking_type.slice(1)}
                                                </Badge>
                                                <p className="text-gray-600 text-sm mb-3">{currentBooking.description}</p>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-sm text-gray-600">
                                                        <strong>Amenities:</strong> {formatAmenities(currentBooking.amenities)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Guest Information */}
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-gray-900">Guest Information</h4>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="h-4 w-4 text-gray-500" />
                                                    <span>
                                                        {currentBooking.no_of_adults} adult{currentBooking.no_of_adults !== 1 ? 's' : ''}
                                                        {currentBooking.no_of_children > 0 && `, ${currentBooking.no_of_children} child${currentBooking.no_of_children !== 1 ? 'ren' : ''}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="h-4 w-4 text-gray-500" />
                                                    <span>{currentBooking.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                    <span>{currentBooking.address}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stay Information */}
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3">Stay Details</h4>
                                                <div className="space-y-3">
                                                    <div className="bg-green-50 rounded-lg p-3">
                                                        <p className="text-xs text-green-700 uppercase tracking-wide mb-1">Check-in</p>
                                                        <p className="font-semibold text-green-900">{formatDateTime(currentBooking.check_in_date)}</p>
                                                    </div>
                                                    <div className="bg-red-50 rounded-lg p-3">
                                                        <p className="text-xs text-red-700 uppercase tracking-wide mb-1">Check-out</p>
                                                        <p className="font-semibold text-red-900">{formatDateTime(currentBooking.check_out_date)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-xs text-blue-700 uppercase tracking-wide mb-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Booked on</span>
                                                </div>
                                                <p className="font-medium text-blue-900">{formatDate(currentBooking.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
              </Card>

                            {/* Payment Method Selection */}
                            <Card>
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {!paymentMethod ? (
                                        <div className="text-center py-8">
                                            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Method Selected</h3>
                                            <p className="text-gray-500 mb-4">Choose your preferred payment method to continue</p>
                                            <PaymentMethodDialog>
                                                <Button className="bg-blue-600 hover:bg-blue-700">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Select Payment Method
                                                </Button>
                                            </PaymentMethodDialog>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Check className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-green-800">{paymentMethod.method.name}</p>
                                                        <p className="text-sm text-green-600">{paymentMethod.method.description}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800">Selected</Badge>
                                            </div>
                                            <PaymentMethodDialog>
                                                <Button variant="outline" className="w-full">
                                                    Change Payment Method
                                                </Button>
                                            </PaymentMethodDialog>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Terms and Conditions */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox
                                            id="terms"
                                            checked={formData.terms}
                                            onCheckedChange={(checked) => handleFormChange("terms", !!checked)}
                                            className="mt-1"
                                        />
                                        <div>
                                            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                                                I have read and agree to the{" "}
                                                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                                                    Terms and Conditions
                                                </a>{" "}
                                                and{" "}
                                                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                                                    Privacy Policy
                                                </a>
                                                . I understand the booking and cancellation policies.*
                                            </Label>
                                            <p className="text-xs text-gray-500 mt-1">
                                                By proceeding, you agree to our booking terms and authorize the payment.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Pricing Summary */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Receipt className="h-5 w-5" />
                                        Payment Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Room Subtotal</span>
                                            {/* <span className="font-medium">{formatPrice(pricing.subtotal.toString())}</span> */}
                                            <span className="font-medium">{formatPrice(pricing.total)}</span>

                                        </div>
                                        {/* <div className="flex justify-between">
                                            <span className="text-gray-600">Service Fee</span>
                                            <span className="font-medium">{formatPrice(pricing.serviceFee.toString())}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Taxes & Fees</span>
                                            <span className="font-medium">{formatPrice(pricing.taxes.toString())}</span>
                                        </div> */}
                                        <hr className="my-3" />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total Amount</span>
                                            <span className="text-blue-600">{formatPrice(currentBooking.total_price)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="text-center">
                                            <p className="text-sm text-blue-700 font-medium mb-1">Down Payment Required (30%)</p>
                                            <p className="text-2xl font-bold text-blue-900">{formatPrice(pricing.downPayment.toString())}</p>
                                            <p className="text-xs text-blue-600 mt-2">
                                                Remaining balance of {formatPrice(pricing.remainingBalance.toString())} due at check-in
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security Badge */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-8 w-8 text-green-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">Secure Payment </p>
                                           
                                            <p className="text-sm text-gray-600">Your payment information is encrypted and protected</p>
                                             <span className='italic text-xs text-slate-500 font-bold'>powered by Paymongo</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Button */}
                            <Button
                                onClick={handlePayment}
                                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 cursor-pointer"
                                disabled={!formData.terms || !paymentMethod}

                            >
                                Pay Down Payment - {formatPrice(pricing.downPayment.toString())}
                            </Button>

                            <p className="text-xs text-gray-500 text-center">
                                You will be redirected to a secure payment gateway to complete your transaction
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}