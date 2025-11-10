import React, { JSX, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  CreditCard, 
  Clock, 
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Star
} from 'lucide-react';
import BookingHeader from '../landing-page/components/bookings-header';
import CustomerLayout from './layout/layout';

// Type definitions
interface Resort {
  resort_name: string;
  description: string;
  capacity: number;
  price_per_day: number;
  policies: {
    cancellation: string;
    modification: string;
  };
}

interface Booking {
  id: number;
  booking_reference: string;
  name: string;
  phone: string;
  email: string;
  reservation_type_id: number;
  requested_date: string;
  service_date: string;
  no_of_adults: number;
  no_of_children: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  payment_status: string;
  booking_status: string;
  special_requests: string;
  created_at: string;
  resort: Resort;
}

interface EditForm {
  name: string;
  phone: string;
  email: string;
  no_of_adults: number;
  no_of_children: number;
  special_requests: string;
}

// Mock booking data - replace with actual API call
const mockBooking: Booking = {
  id: 1,
  booking_reference: '550e8400-e29b-41d4-a716-446655440001',
  name: 'John Doe',
  phone: '+63 912 345 6789',
  email: 'john.doe@email.com',
  reservation_type_id: 1,
  requested_date: '2024-08-15T10:00:00Z',
  service_date: '2024-08-20',
  no_of_adults: 2,
  no_of_children: 1,
  check_in_date: '2024-08-20T14:00:00Z',
  check_out_date: '2024-08-22T11:00:00Z',
  total_price: 8500.00,
  payment_status: 'paid',
  booking_status: 'accepted',
  special_requests: 'Late check-in requested. Celebration for anniversary - please arrange flowers if possible.',
  created_at: '2024-08-15T10:00:00Z',
  resort: {
    resort_name: 'Paradise Beach Resort',
    description: 'Deluxe Ocean View Room with Private Balcony',
    capacity: 4,
    price_per_day: 4250.00,
    policies: {
      cancellation: 'Free cancellation up to 48 hours before check-in. 50% refund for cancellations within 48 hours.',
      modification: 'Changes allowed up to 24 hours before check-in, subject to availability.',
    }
  }
};



const formatDateTime = (dateString: string): string => {
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

export default function ManageBookingPage(): JSX.Element {
  const [booking, setBooking] = useState<Booking>(mockBooking);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditForm>({
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    no_of_adults: booking.no_of_adults,
    no_of_children: booking.no_of_children,
    special_requests: booking.special_requests
  });
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [showModifyDialog, setShowModifyDialog] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [modificationRequest, setModificationRequest] = useState<string>('');



  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Updating booking details:', editForm);
    setBooking({ ...booking, ...editForm });
    setIsEditing(false);
  };

  const handleCancelBooking = (): void => {
    console.log('Cancelling booking:', booking.booking_reference, 'Reason:', cancelReason);
    setShowCancelDialog(false);
    setCancelReason('');
  };

  const handleRequestModification = (): void => {
    console.log('Requesting modification:', modificationRequest);
    setShowModifyDialog(false);
    setModificationRequest('');
  };

  const canModify = (): boolean => {
    const checkInDate = new Date(booking.check_in_date);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilCheckIn > 24 && booking.booking_status === 'accepted';
  };

  const canCancel = (): boolean => {
    const checkInDate = new Date(booking.check_in_date);
    const now = new Date();
    return checkInDate > now && ['accepted', 'pending'].includes(booking.booking_status);
  };

  const getCancellationFee = (): number => {
    const checkInDate = new Date(booking.check_in_date);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilCheckIn > 48) return 0;
    if (hoursUntilCheckIn > 24) return booking.total_price * 0.25;
    return booking.total_price * 0.5;
  };

  return (
    <CustomerLayout>


    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <BookingHeader
                bookingReference={booking.booking_reference}
                bookingStatus={booking.booking_status} />


      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{booking.resort.resort_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Check-in</p>
                    <p className="font-medium">{formatDateTime(booking.check_in_date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Check-out</p>
                    <p className="font-medium">{formatDateTime(booking.check_out_date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Guests</p>
                    <p className="font-medium">{booking.no_of_adults + booking.no_of_children} guests</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Price</p>
                    <p className="font-bold text-lg">{formatPrice(booking.total_price)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Guest Information
                </CardTitle>
                {booking.booking_status === 'accepted' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="adults">Number of Adults</Label>
                        <Select value={editForm.no_of_adults.toString()} onValueChange={(value) => setEditForm({...editForm, no_of_adults: parseInt(value)})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="children">Number of Children</Label>
                        <Select value={editForm.no_of_children.toString()} onValueChange={(value) => setEditForm({...editForm, no_of_children: parseInt(value)})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0,1,2,3,4].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="special_requests">Special Requests</Label>
                        <Textarea
                          id="special_requests"
                          value={editForm.special_requests}
                          onChange={(e) => setEditForm({...editForm, special_requests: e.target.value})}
                          placeholder="Any special requests or notes..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Guest Name</p>
                        <p className="font-medium">{booking.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="font-medium">{booking.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="font-medium">{booking.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Adults</p>
                        <p className="font-medium">{booking.no_of_adults}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Children</p>
                        <p className="font-medium">{booking.no_of_children}</p>
                      </div>
                    </div>
                    {booking.special_requests && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Special Requests</p>
                        <p className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
                          {booking.special_requests}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modification Request */}
            {canModify() && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Request Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Need to modify your booking dates or room type? Submit a change request and we'll check availability for you.
                  </p>
                  <Dialog open={showModifyDialog} onOpenChange={setShowModifyDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Request Modification
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Booking Modification</DialogTitle>
                        <DialogDescription>
                          Describe the changes you'd like to make to your booking. Our team will review and contact you within 24 hours.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="modification">Modification Details</Label>
                          <Textarea
                            id="modification"
                            placeholder="Please describe what changes you'd like to make (dates, room type, number of guests, etc.)"
                            value={modificationRequest}
                            onChange={(e) => setModificationRequest(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Policy:</strong> {booking.resort.policies.modification}
                          </AlertDescription>
                        </Alert>
                        <div className="flex gap-2">
                          <Button onClick={handleRequestModification} disabled={!modificationRequest.trim()}>
                            Submit Request
                          </Button>
                          <Button variant="outline" onClick={() => setShowModifyDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Important Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Cancellation Policy</h4>
                  <p className="text-sm text-gray-600">{booking.resort.policies.cancellation}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Modification Policy</h4>
                  <p className="text-sm text-gray-600">{booking.resort.policies.modification}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => window.location.href = `/bookings/${booking.id}/details`}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
                
                {booking.booking_status === 'accepted' && new Date(booking.check_out_date) < new Date() && (
                  <Button variant="outline" className="w-full">
                    <Star className="h-4 w-4 mr-2" />
                    Leave a Review
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Book Again
                </Button>
              </CardContent>
            </Card>

            {/* Cancellation */}
            {canCancel() && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700">Cancel Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Need to cancel your booking? Review our cancellation policy below.
                  </p>
                  
                  {getCancellationFee() > 0 && (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Cancellation Fee:</strong> {formatPrice(getCancellationFee())} will be charged for cancellations at this time.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cancel-reason">Reason for Cancellation</Label>
                          <Select value={cancelReason} onValueChange={setCancelReason}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="schedule_conflict">Schedule Conflict</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="weather">Weather Concerns</SelectItem>
                              <SelectItem value="health">Health Issues</SelectItem>
                              <SelectItem value="financial">Financial Reasons</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {getCancellationFee() > 0 && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-1">
                                <p><strong>Refund Calculation:</strong></p>
                                <p>Original Amount: {formatPrice(booking.total_price)}</p>
                                <p>Cancellation Fee: -{formatPrice(getCancellationFee())}</p>
                                <p className="font-bold">Refund Amount: {formatPrice(booking.total_price - getCancellationFee())}</p>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            variant="destructive" 
                            onClick={handleCancelBooking}
                            disabled={!cancelReason}
                          >
                            Confirm Cancellation
                          </Button>
                          <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                            Keep Booking
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Support Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Need Assistance?</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertDescription>
                    <p className="mb-3">Our support team is here to help with any questions or special requests.</p>
                    <div className="space-y-1 text-sm">
                      <p><strong>Phone:</strong> +63 2 1234 5678</p>
                      <p><strong>Email:</strong> support@resortbooking.com</p>
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