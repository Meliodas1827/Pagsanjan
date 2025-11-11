import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, LogOut, NotebookTabs, Upload, User, UserRoundCog, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface Resort {
    id: number;
    resort_name: string;
    img: string;
    payment_qr: string;
}

interface EntranceFee {
    id: number;
    category: string;
    description: string;
    amount: string;
}

interface PageProps {
    resort: Resort;
    entrance_fees: EntranceFee[];
}

const PublicNavBar = ({ role }: { role: number }) => {
    const handleLogout = () => {
        router.post(route('logout'));
        router.flushAll();
    };

    return (
        <nav className="w-full bg-[#18371e] text-white">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-opacity-20 flex h-12 w-13 items-center justify-center rounded">
                            <img src="/images/logo.png" alt="logo" title="logo" />
                        </div>
                        <div className="font-bold text-white">
                            <div className="text-lg leading-tight">PAGSANJAN</div>
                            <div className="text-sm leading-tight">FALLS RESORT</div>
                        </div>
                    </Link>

                    {/* User Menu */}
                    {role > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hover:bg-opacity-10 flex items-center space-x-2 rounded-md px-3 py-2 text-white transition-colors hover:bg-white">
                                <User className="h-5 w-5" />
                                <span>Account</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href={route('dashboard')} className="flex w-full items-center">
                                        <NotebookTabs className="mr-2 h-4 w-4" />
                                        <span>My Bookings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')} className="flex w-full items-center">
                                        <UserRoundCog className="mr-2 h-4 w-4" />
                                        <span>Account</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="flex w-full items-center">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default function ResortBooking() {
    const { auth } = usePage<SharedData>().props;
    const { resort, entrance_fees } = usePage<PageProps>().props;
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState<{ [key: string]: number }>({});
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = auth?.user?.role_id ?? 0;

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get minimum check-out date (check-in date + 1 day)
    const getMinCheckOutDate = () => {
        if (!checkInDate) return getTodayDate();
        const checkIn = new Date(checkInDate);
        checkIn.setDate(checkIn.getDate() + 1);
        return checkIn.toISOString().split('T')[0];
    };

    // Calculate total amount
    const calculateTotal = () => {
        let total = 0;
        entrance_fees.forEach((fee) => {
            const count = guests[fee.category] || 0;
            total += parseFloat(fee.amount) * count;
        });
        return total;
    };

    const handleGuestChange = (category: string, value: string) => {
        const count = parseInt(value) || 0;
        setGuests((prev) => ({
            ...prev,
            [category]: count,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentProof(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Validation
        if (!checkInDate || !checkOutDate) {
            toast.error('Please select check-in and check-out dates');
            return;
        }

        const totalGuests = Object.values(guests).reduce((sum, count) => sum + count, 0);
        if (totalGuests === 0) {
            toast.error('Please add at least one guest');
            return;
        }

        if (!paymentProof) {
            toast.error('Please upload payment proof');
            return;
        }

        const totalAmount = calculateTotal();
        if (totalAmount === 0) {
            toast.error('Total amount must be greater than zero');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('resort_id', resort.id.toString());
        formData.append('date_checkin', checkInDate);
        formData.append('date_checkout', checkOutDate);
        formData.append('guests', JSON.stringify(guests));
        formData.append('total_amount', totalAmount.toString());
        formData.append('payment_proof', paymentProof);

        router.post(route('customer.resort.book'), formData, {
            onSuccess: () => {
                toast.success('Reservation submitted successfully!');
                setCheckInDate('');
                setCheckOutDate('');
                setGuests({});
                setPaymentProof(null);
                setPreviewUrl(null);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to submit reservation. Please try again.');
                setIsSubmitting(false);
            },
        });
    };

    const totalAmount = calculateTotal();
    const qrCodeUrl = resort.payment_qr ? `/storage/${resort.payment_qr}` : null;

    return (
        <>
            <Head title={`Book ${resort.resort_name}`} />
            <PublicNavBar role={user} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/" className="mb-4 inline-flex items-center text-emerald-600 hover:text-emerald-700">
                            ← Back to Home
                        </Link>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">{resort.resort_name}</h1>
                        <p className="text-gray-600">Reserve your visit and pay the entrance fee</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Booking Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Reservation Details</CardTitle>
                                        <CardDescription>Select your visit dates and number of guests</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Date Selection */}
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="checkin">Check-in Date</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute top-3 left-3 h-4 w-4 text-gray-500" />
                                                    <Input
                                                        id="checkin"
                                                        type="date"
                                                        value={checkInDate}
                                                        onChange={(e) => setCheckInDate(e.target.value)}
                                                        min={getTodayDate()}
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="checkout">Check-out Date</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute top-3 left-3 h-4 w-4 text-gray-500" />
                                                    <Input
                                                        id="checkout"
                                                        type="date"
                                                        value={checkOutDate}
                                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                                        min={getMinCheckOutDate()}
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Guest Selection */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-gray-500" />
                                                <Label className="text-base font-semibold">Number of Guests</Label>
                                            </div>
                                            <div className="space-y-3">
                                                {entrance_fees.map((fee) => (
                                                    <div key={fee.id} className="flex items-center justify-between rounded-lg border p-4">
                                                        <div className="flex-1">
                                                            <p className="font-medium">{fee.category}</p>
                                                            <p className="text-sm text-gray-500">{fee.description}</p>
                                                            <p className="mt-1 text-sm font-semibold text-emerald-600">
                                                                ₱{parseFloat(fee.amount).toFixed(2)} per person
                                                            </p>
                                                        </div>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={guests[fee.category] || 0}
                                                            onChange={(e) => handleGuestChange(fee.category, e.target.value)}
                                                            className="w-20"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Total Amount */}
                                        <div className="rounded-lg bg-emerald-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                                <span className="text-2xl font-bold text-emerald-600">₱{totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Payment Proof Upload */}
                                        <div className="space-y-2">
                                            <Label htmlFor="payment_proof">Upload Payment Proof</Label>
                                            <p className="text-sm text-gray-500">
                                                Scan the QR code on the right and upload your payment proof
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    id="payment_proof"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => document.getElementById('payment_proof')?.click()}
                                                    className="w-full"
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    {paymentProof ? 'Change File' : 'Choose File'}
                                                </Button>
                                            </div>
                                            {previewUrl && (
                                                <div className="mt-4">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Payment proof preview"
                                                        className="h-48 w-full rounded-lg object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg" disabled={isSubmitting}>
                                            {isSubmitting ? 'Processing...' : 'Reserve and Pay'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </form>
                        </div>

                        {/* Right Column - Payment QR and Summary */}
                        <div className="space-y-6">
                            {/* QR Code */}
                            {qrCodeUrl && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment QR Code</CardTitle>
                                        <CardDescription>Scan to pay the entrance fee</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-center rounded-lg bg-white p-4">
                                            <img src={qrCodeUrl} alt="Payment QR Code" className="h-64 w-64 object-contain" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Resort Image */}
                            {resort.img && (
                                <Card>
                                    <CardContent className="p-0">
                                        <img
                                            src={resort.img}
                                            alt={resort.resort_name}
                                            className="h-48 w-full rounded-lg object-cover"
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Booking Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {checkInDate && checkOutDate && (
                                        <div>
                                            <p className="text-sm text-gray-500">Visit Period</p>
                                            <p className="font-medium">
                                                {new Date(checkInDate).toLocaleDateString()} -{' '}
                                                {new Date(checkOutDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {Object.entries(guests).filter(([_, count]) => count > 0).length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500">Guests</p>
                                            {Object.entries(guests)
                                                .filter(([_, count]) => count > 0)
                                                .map(([category, count]) => (
                                                    <p key={category} className="font-medium">
                                                        {count} {category}
                                                    </p>
                                                ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
