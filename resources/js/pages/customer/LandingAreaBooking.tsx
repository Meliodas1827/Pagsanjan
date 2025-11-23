import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, LogOut, NotebookTabs, Upload, User, UserRoundCog, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';
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
    price_per_adult?: number | string | null;
    price_per_child?: number | string | null;
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
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Get hero image - use main landing area image
    const heroImage = landingArea.image;

    // Generate short description if none exists
    const getDescription = () => {
        return landingArea.description || `Experience an amazing boat ride to ${landingArea.name}. Book your adventure today and create unforgettable memories.`;
    };

    // Get 4 images for the 2x2 gallery from landing_area images
    const getGalleryImages = () => {
        if (!landingArea.images || landingArea.images.length === 0) return [];
        return landingArea.images.slice(0, 4);
    };

    const galleryImages = getGalleryImages();

    // Get tomorrow's date as minimum date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

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

        if (!form.data.pickup_date || !form.data.pickup_time) {
            toast.error('Please select pickup date and time');
            return;
        }

        if (!paymentProof) {
            toast.error('Please upload payment proof');
            return;
        }

        if (landingArea.capacity && (form.data.number_of_adults + form.data.number_of_children) > landingArea.capacity) {
            toast.error(`Total guests cannot exceed capacity of ${landingArea.capacity} people`);
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('landing_area_id', form.data.landing_area_id.toString());
        formData.append('customer_name', form.data.customer_name);
        formData.append('customer_email', form.data.customer_email);
        formData.append('customer_phone', form.data.customer_phone);
        formData.append('number_of_adults', form.data.number_of_adults.toString());
        formData.append('number_of_children', form.data.number_of_children.toString());
        formData.append('pickup_date', form.data.pickup_date);
        formData.append('pickup_time', form.data.pickup_time);
        formData.append('payment_proof', paymentProof);

        router.post(route('landing-area.booking.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Boat ride booking submitted successfully!');
                form.reset();
                setPaymentProof(null);
                setPreviewUrl(null);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error(errors);
                const errorMessage = Object.values(errors)[0] as string;
                toast.error(errorMessage || 'Failed to submit booking. Please try again.');
                setIsSubmitting(false);
            },
        });
    };

    const totalGuests = form.data.number_of_adults + form.data.number_of_children;
    const qrCodeUrl = landingArea.payment_qr ? `/storage/${landingArea.payment_qr}` : null;

    // Calculate total price based on adults and children
    const calculateTotalPrice = () => {
        const adults = form.data.number_of_adults || 0;
        const children = form.data.number_of_children || 0;

        // Use new pricing if available
        if (landingArea.price_per_adult || landingArea.price_per_child) {
            const adultPrice = parseFloat(landingArea.price_per_adult as string) || 0;
            const childPrice = parseFloat(landingArea.price_per_child as string) || 0;
            return (adults * adultPrice) + (children * childPrice);
        }

        // Fallback to legacy price (if available)
        if (landingArea.price) {
            return parseFloat(landingArea.price as string) || 0;
        }

        return 0;
    };

    const totalPrice = calculateTotalPrice();

    return (
        <>
            <Head title={`Book ${landingArea.name}`} />
            <PublicNavBar role={user} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-6 py-4">
                        <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative h-[500px] w-full overflow-hidden bg-gray-900">
                    {heroImage ? (
                        <>
                            <img
                                src={heroImage.startsWith('/') ? heroImage : `/storage/${heroImage}`}
                                alt={landingArea.name}
                                className="h-full w-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
                                <div className="mx-auto max-w-7xl">
                                    <h1 className="text-5xl font-bold text-white">{landingArea.name}</h1>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-5xl font-bold text-white">{landingArea.name}</h1>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mx-auto max-w-7xl px-6 py-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left Column - Description & 2x2 Image Gallery */}
                        <div className="space-y-6">
                            {/* Description */}
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h2 className="mb-3 text-2xl font-semibold text-gray-900">About {landingArea.name}</h2>
                                <p className="text-gray-600 leading-relaxed">{getDescription()}</p>
                            </div>

                            {/* 2x2 Image Gallery */}
                            {galleryImages.length > 0 && (
                                <div>
                                    <h3 className="mb-4 text-xl font-semibold text-gray-900">Gallery</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {galleryImages.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className="group relative aspect-square overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
                                            >
                                                <img
                                                    src={`/storage/${image.image_path}`}
                                                    alt={image.caption || `${landingArea.name} image ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                {image.caption && (
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <p className="text-sm text-white">{image.caption}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Reservation Form */}
                        <div className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Booking Details Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Booking Details</CardTitle>
                                        <CardDescription>Enter your information and select pickup details</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Customer Information */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="customer_name">Full Name</Label>
                                                <Input
                                                    id="customer_name"
                                                    type="text"
                                                    value={form.data.customer_name}
                                                    onChange={(e) => form.setData('customer_name', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="customer_email">Email Address</Label>
                                                <Input
                                                    id="customer_email"
                                                    type="email"
                                                    value={form.data.customer_email}
                                                    onChange={(e) => form.setData('customer_email', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="customer_phone">Phone Number</Label>
                                                <Input
                                                    id="customer_phone"
                                                    type="tel"
                                                    value={form.data.customer_phone}
                                                    onChange={(e) => form.setData('customer_phone', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Pickup Date and Time */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="pickup_date">Pickup Date</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                    <Input
                                                        id="pickup_date"
                                                        type="date"
                                                        value={form.data.pickup_date}
                                                        onChange={(e) => form.setData('pickup_date', e.target.value)}
                                                        min={minDate}
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pickup_time">Pickup Time</Label>
                                                <Input
                                                    id="pickup_time"
                                                    type="time"
                                                    value={form.data.pickup_time}
                                                    onChange={(e) => form.setData('pickup_time', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Number of Guests */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-gray-500" />
                                                <Label className="text-base font-semibold">Number of Guests</Label>
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="adults">Adults</Label>
                                                    <Input
                                                        id="adults"
                                                        type="number"
                                                        min="1"
                                                        value={form.data.number_of_adults}
                                                        onChange={(e) => form.setData('number_of_adults', parseInt(e.target.value) || 1)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="children">Children</Label>
                                                    <Input
                                                        id="children"
                                                        type="number"
                                                        min="0"
                                                        value={form.data.number_of_children}
                                                        onChange={(e) => form.setData('number_of_children', parseInt(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                            {landingArea.capacity && (
                                                <p className="text-xs text-gray-500">
                                                    Maximum capacity: {landingArea.capacity} people (Total: {totalGuests})
                                                </p>
                                            )}
                                        </div>

                                        {/* Price Display */}
                                        {(landingArea.price_per_adult || landingArea.price_per_child || landingArea.price) && (
                                            <div className="rounded-lg bg-emerald-50 p-4">
                                                <div className="space-y-3">
                                                    {landingArea.price_per_adult && (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-700">
                                                                {form.data.number_of_adults} Adult{form.data.number_of_adults > 1 ? 's' : ''} × ₱
                                                                {landingArea.price_per_adult}
                                                            </span>
                                                            <span className="font-semibold text-gray-900">
                                                                ₱{(form.data.number_of_adults * parseFloat(landingArea.price_per_adult as string)).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {landingArea.price_per_child && form.data.number_of_children > 0 && (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-700">
                                                                {form.data.number_of_children} Child{form.data.number_of_children > 1 ? 'ren' : ''} × ₱
                                                                {landingArea.price_per_child}
                                                            </span>
                                                            <span className="font-semibold text-gray-900">
                                                                ₱{(form.data.number_of_children * parseFloat(landingArea.price_per_child as string)).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {!landingArea.price_per_adult && !landingArea.price_per_child && landingArea.price && (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-700">Base Price:</span>
                                                            <span className="font-semibold text-gray-900">₱{landingArea.price}</span>
                                                        </div>
                                                    )}
                                                    <div className="border-t border-emerald-200 pt-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                                                            <span className="text-2xl font-bold text-emerald-600">₱{totalPrice.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Payment QR Code Card */}
                                {qrCodeUrl && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Payment QR Code</CardTitle>
                                            <CardDescription>Scan to pay ₱{totalPrice.toFixed(2)}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-center rounded-lg bg-white p-6">
                                                <img src={qrCodeUrl} alt="Payment QR Code" className="h-64 w-64 object-contain" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Payment Proof Upload */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Upload Payment Proof</CardTitle>
                                        <CardDescription>Required to confirm your booking</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
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
                                            <div className="overflow-hidden rounded-lg border">
                                                <img
                                                    src={previewUrl}
                                                    alt="Payment proof preview"
                                                    className="h-48 w-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Booking Summary Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Booking Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Destination</p>
                                            <p className="text-lg font-semibold text-gray-900">{landingArea.name}</p>
                                        </div>
                                        {landingArea.location && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Location</p>
                                                <p className="font-medium text-gray-900">{landingArea.location}</p>
                                            </div>
                                        )}
                                        {form.data.pickup_date && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Pickup Date & Time</p>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(form.data.pickup_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}{' '}
                                                    {form.data.pickup_time && `at ${form.data.pickup_time}`}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Guests</p>
                                            <div className="mt-1 space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-700">{form.data.number_of_adults} Adults</span>
                                                </div>
                                                {form.data.number_of_children > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-700">{form.data.number_of_children} Children</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {(landingArea.price_per_adult || landingArea.price_per_child || landingArea.price) && (
                                            <div className="border-t pt-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                                    <span className="text-2xl font-bold text-emerald-600">₱{totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                                </Button>

                                <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Note:</strong> Your booking will be pending until confirmed by our admin team.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
