import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, DollarSign, LogOut, MapPin, NotebookTabs, Sailboat, User, UserRoundCog, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LandingAreaImage {
    id: number;
    landing_area_id: number;
    image_path: string;
    caption: string | null;
    order: number;
    is_primary: boolean;
}

interface LandingArea {
    id: number;
    name: string;
    description: string | null;
    location: string | null;
    address: string | null;
    capacity: number | null;
    image: string | null;
    payment_qr: string | null;
    price: number | string | null;
    images: LandingAreaImage[];
}

interface UserData {
    name: string;
    email: string;
    phone: string;
}

interface PageProps {
    landingArea: LandingArea;
    userData: UserData;
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

export default function LandingAreaBooking() {
    const { auth } = usePage<SharedData>().props;
    const { landingArea, userData } = usePage<PageProps>().props;
    const user = auth?.user?.role_id ?? 0;
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const form = useForm({
        landing_area_id: landingArea.id,
        customer_name: userData?.name || '',
        customer_email: userData?.email || '',
        customer_phone: userData?.phone || '',
        number_of_adults: 1,
        number_of_children: 0,
        pickup_date: '',
        pickup_time: '',
        payment_proof: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(route('landing-area.booking.store'), {
            onSuccess: () => {
                toast.success('Landing area booking submitted successfully!');
                setShowBookingForm(false);
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0] as string;
                toast.error(errorMessage || 'Failed to book landing area');
            },
        });
    };

    // Get tomorrow's date as minimum date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <>
            <Head title={landingArea.name} />
            <PublicNavBar role={user} />

            <div className="min-h-screen bg-gray-50">
                {/* Landing Area Header */}
                <div className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <Link href="/dashboard" className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>

                        <div className="mt-4">
                            <h1 className="text-4xl font-light text-gray-900">{landingArea.name}</h1>
                            {landingArea.description && <p className="mt-2 text-lg text-gray-600">{landingArea.description}</p>}
                            <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
                                {landingArea.location && (
                                    <div className="flex items-center">
                                        <MapPin className="mr-2 h-5 w-5" />
                                        <span>{landingArea.location}</span>
                                    </div>
                                )}
                                {landingArea.capacity && (
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-5 w-5" />
                                        <span>Capacity: {landingArea.capacity} people</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Landing Area Image Gallery */}
                        {landingArea.images && landingArea.images.length > 0 ? (
                            <div className="mt-8 space-y-4">
                                {/* Main Image */}
                                <div className="relative overflow-hidden rounded-lg shadow-lg">
                                    <img
                                        src={`/storage/${landingArea.images[selectedImageIndex].image_path}`}
                                        alt={landingArea.images[selectedImageIndex].caption || landingArea.name}
                                        className="h-96 w-full object-cover"
                                    />
                                    {landingArea.images[selectedImageIndex].caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2 text-white">
                                            <p className="text-sm">{landingArea.images[selectedImageIndex].caption}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {landingArea.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
                                        {landingArea.images.map((img, index) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`overflow-hidden rounded-md border-2 transition-all ${
                                                    selectedImageIndex === index ? 'border-blue-600 ring-2 ring-blue-600' : 'border-transparent hover:border-gray-300'
                                                }`}
                                            >
                                                <img src={`/storage/${img.image_path}`} alt={img.caption || `Image ${index + 1}`} className="h-16 w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : landingArea.image ? (
                            <div className="mt-8 overflow-hidden rounded-lg shadow-lg">
                                <img src={`/storage/${landingArea.image}`} alt={landingArea.name} className="h-96 w-full object-cover" />
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Booking Card */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <h2 className="mb-8 text-3xl font-light text-gray-900">Request a boat ride</h2>

                    <div className="flex justify-center">
                        <div className="relative w-full max-w-md">
                            {/* Image Card - Base Layer */}
                            <div className="relative h-72 overflow-hidden rounded-lg shadow-lg">
                                {landingArea.images && landingArea.images.length > 0 ? (
                                    <img
                                        src={`/storage/${landingArea.images.find(img => img.is_primary)?.image_path || landingArea.images[0].image_path}`}
                                        alt={landingArea.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : landingArea.image ? (
                                    <img src={`/storage/${landingArea.image}`} alt={landingArea.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                                        <div className="text-center">
                                            <Sailboat className="mx-auto h-20 w-20 text-blue-600" />
                                            <p className="mt-4 text-3xl font-bold text-blue-800">{landingArea.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Details Card - Overlapping Layer */}
                            <div className="relative mx-4 -mt-16 rounded-lg bg-white p-6 shadow-xl">
                                <h3 className="text-xl font-semibold text-gray-900">{landingArea.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">Boat ride destination</p>

                                <div className="mt-4 space-y-2">
                                    {landingArea.location && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            <span>{landingArea.location}</span>
                                        </div>
                                    )}
                                    {landingArea.capacity && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="mr-2 h-4 w-4" />
                                            <span>Capacity: {landingArea.capacity} people</span>
                                        </div>
                                    )}
                                    {landingArea.address && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            <span>{landingArea.address}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center">
                                        <DollarSign className="h-5 w-5 text-blue-600" />
                                        <span className="text-2xl font-bold text-gray-900">{landingArea.price}</span>
                                        <span className="ml-1 text-sm text-gray-500">₱</span>
                                    </div>
                                    <button
                                        onClick={() => setShowBookingForm(true)}
                                        className="rounded-md bg-[#18371e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a5230]"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form Modal */}
                {showBookingForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
                            <h2 className="text-2xl font-semibold text-gray-900">Book Boat Ride to {landingArea.name}</h2>
                            <p className="mt-2 text-sm text-gray-600">Complete your booking details below</p>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                {/* Customer Name */}
                                <div>
                                    <Label htmlFor="customer_name">Full Name</Label>
                                    <Input
                                        id="customer_name"
                                        type="text"
                                        value={form.data.customer_name}
                                        onChange={(e) => form.setData('customer_name', e.target.value)}
                                        className="mt-2"
                                        required
                                    />
                                    {form.errors.customer_name && <p className="mt-1 text-sm text-red-500">{form.errors.customer_name}</p>}
                                </div>

                                {/* Customer Email */}
                                <div>
                                    <Label htmlFor="customer_email">Email Address</Label>
                                    <Input
                                        id="customer_email"
                                        type="email"
                                        value={form.data.customer_email}
                                        onChange={(e) => form.setData('customer_email', e.target.value)}
                                        className="mt-2"
                                    />
                                    {form.errors.customer_email && <p className="mt-1 text-sm text-red-500">{form.errors.customer_email}</p>}
                                </div>

                                {/* Customer Phone */}
                                <div>
                                    <Label htmlFor="customer_phone">Phone Number</Label>
                                    <Input
                                        id="customer_phone"
                                        type="tel"
                                        value={form.data.customer_phone}
                                        onChange={(e) => form.setData('customer_phone', e.target.value)}
                                        className="mt-2"
                                        required
                                    />
                                    {form.errors.customer_phone && <p className="mt-1 text-sm text-red-500">{form.errors.customer_phone}</p>}
                                </div>

                                {/* Number of Adults */}
                                <div>
                                    <Label htmlFor="adults">Number of Adults</Label>
                                    <Input
                                        id="adults"
                                        type="number"
                                        min="1"
                                        value={form.data.number_of_adults}
                                        onChange={(e) => form.setData('number_of_adults', parseInt(e.target.value) || 1)}
                                        className="mt-2"
                                    />
                                    {form.errors.number_of_adults && <p className="mt-1 text-sm text-red-500">{form.errors.number_of_adults}</p>}
                                </div>

                                {/* Number of Children */}
                                <div>
                                    <Label htmlFor="children">Number of Children</Label>
                                    <Input
                                        id="children"
                                        type="number"
                                        min="0"
                                        value={form.data.number_of_children}
                                        onChange={(e) => form.setData('number_of_children', parseInt(e.target.value) || 0)}
                                        className="mt-2"
                                    />
                                    {landingArea.capacity && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Maximum capacity: {landingArea.capacity} people (Total: {form.data.number_of_adults + form.data.number_of_children})
                                        </p>
                                    )}
                                    {form.errors.number_of_children && <p className="mt-1 text-sm text-red-500">{form.errors.number_of_children}</p>}
                                </div>

                                {/* Pickup Date */}
                                <div>
                                    <Label htmlFor="pickup_date">Pickup Date</Label>
                                    <Input
                                        id="pickup_date"
                                        type="date"
                                        min={minDate}
                                        value={form.data.pickup_date}
                                        onChange={(e) => form.setData('pickup_date', e.target.value)}
                                        className="mt-2"
                                    />
                                    {form.errors.pickup_date && <p className="mt-1 text-sm text-red-500">{form.errors.pickup_date}</p>}
                                </div>

                                {/* Pickup Time */}
                                <div>
                                    <Label htmlFor="pickup_time">Pickup Time</Label>
                                    <Input
                                        id="pickup_time"
                                        type="time"
                                        value={form.data.pickup_time}
                                        onChange={(e) => form.setData('pickup_time', e.target.value)}
                                        className="mt-2"
                                    />
                                    {form.errors.pickup_time && <p className="mt-1 text-sm text-red-500">{form.errors.pickup_time}</p>}
                                </div>

                                {/* Admin Approval Notice */}
                                <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="mb-1 font-semibold text-yellow-900">Admin Approval Required</h4>
                                            <p className="text-sm text-yellow-800">
                                                Your booking request will be reviewed by our admin team. They will verify your booking details and payment before approval. You will be notified once your booking is confirmed.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Summary */}
                                <div className="rounded-lg border bg-blue-50 p-4">
                                    <h4 className="mb-2 font-semibold text-blue-900">Booking Summary</h4>
                                    <div className="space-y-1 text-sm text-blue-800">
                                        <p>
                                            <span className="font-medium">Destination:</span> {landingArea.name}
                                        </p>
                                        {landingArea.location && (
                                            <p>
                                                <span className="font-medium">Location:</span> {landingArea.location}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-medium">Name:</span> {form.data.customer_name}
                                        </p>
                                        <p>
                                            <span className="font-medium">Adults:</span> {form.data.number_of_adults}
                                        </p>
                                        <p>
                                            <span className="font-medium">Children:</span> {form.data.number_of_children}
                                        </p>
                                        <p>
                                            <span className="font-medium">Total People:</span> {form.data.number_of_adults + form.data.number_of_children}
                                        </p>
                                        {form.data.pickup_date && (
                                            <p>
                                                <span className="font-medium">Date:</span> {form.data.pickup_date}
                                            </p>
                                        )}
                                        {form.data.pickup_time && (
                                            <p>
                                                <span className="font-medium">Time:</span> {form.data.pickup_time}
                                            </p>
                                        )}
                                        {landingArea.price && (
                                            <p>
                                                <span className="font-medium">Price:</span> ₱{landingArea.price}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Payment QR */}
                                {landingArea.payment_qr && (
                                    <div className="rounded-lg border bg-gray-50 p-4">
                                        <h4 className="mb-3 font-semibold">Payment QR Code</h4>
                                        <div className="flex justify-center">
                                            <img
                                                src={`/storage/${landingArea.payment_qr}`}
                                                alt="Payment QR"
                                                className="h-48 w-48 rounded-lg border bg-white p-2"
                                            />
                                        </div>
                                        {landingArea.price && (
                                            <p className="mt-3 text-center text-xs text-muted-foreground">Scan to pay ₱{landingArea.price}</p>
                                        )}
                                    </div>
                                )}

                                {/* Payment Proof Upload */}
                                <div>
                                    <Label htmlFor="payment_proof">Upload Payment Proof</Label>
                                    <Input
                                        id="payment_proof"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                form.setData('payment_proof', file);
                                            }
                                        }}
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Please upload a screenshot or photo of your payment receipt
                                    </p>
                                    {form.errors.payment_proof && <p className="mt-1 text-sm text-red-500">{form.errors.payment_proof}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowBookingForm(false);
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={form.processing} className="flex-1">
                                        {form.processing ? 'Submitting...' : 'Confirm Booking'}
                                    </Button>
                                </div>

                                <p className="text-xs text-muted-foreground">Your booking will be pending until confirmed by our staff.</p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
