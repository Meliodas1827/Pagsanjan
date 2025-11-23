import { Head, Link, usePage, router } from '@inertiajs/react';
import { ArrowLeft, MapPin, Bed, Users, DollarSign, LogOut, NotebookTabs, User, UserRoundCog } from 'lucide-react';
import { type SharedData } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ImageGallery from './components/ImageGallery';
import { useState } from 'react';

interface HotelImage {
    id: number;
    image_url: string;
}

interface Hotel {
    id: number;
    hotel_name: string;
    location: string;
    description: string;
    image_url: string;
    hotel_images: HotelImage[];
}

interface Room {
    id: number;
    room_name: string;
    room_type: string;
    capacity: number;
    price_per_night: number;
    description: string;
    amenities: string;
    image_url: string;
    is_bookable: number;
}

interface PageProps {
    hotel: Hotel;
    rooms: Room[];
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
                            <DropdownMenuTrigger className="flex items-center space-x-2 rounded-md px-3 py-2 text-white transition-colors hover:bg-white hover:bg-opacity-10">
                                <User className="h-5 w-5" />
                                <span>Account</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href={route('dashboard')} className="flex w-full items-center">
                                        <NotebookTabs className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
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

const ContactSection = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-[#5a5a5a] py-12 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Column 1 - Logo & Location */}
                    <div className="text-center md:text-left">
                        <div className="mb-4 flex justify-center md:justify-start">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                                <img src="/images/logo.png" alt="Pagsanjan Falls" className="h-12 w-12" />
                            </div>
                        </div>
                        <p className="text-sm text-white/90">
                            Municipality of Pagsanjan,
                            <br />
                            Laguna, Philippines
                        </p>
                    </div>

                    {/* Column 2 - Navigation Links */}
                    <div className="text-start">
                        <nav className="space-y-2">
                            <a
                                href="#about"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                ABOUT US
                            </a>
                            <a
                                href="#activities"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                ACTIVITIES
                            </a>
                            <a
                                href="#contact"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                CONTACT US
                            </a>
                            <a
                                href="#faqs"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                FAQS
                            </a>
                            <a
                                href="/data-privacy"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                PRIVACY POLICY
                            </a>
                            <a
                                href="/terms-conditions"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                TERMS AND CONDITIONS
                            </a>
                        </nav>
                    </div>

                    {/* Column 3 - Newsletter Signup */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold">Be the first to discover exclusive deals. Subscribe now!</h3>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                    className="flex-1 border-0 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#2d5f5d] focus:outline-none disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-md bg-[#2d5f5d] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d6b68] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </div>
                            {message && (
                                <p className={`text-sm ${message.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                                    {message.text}
                                </p>
                            )}
                            <p className="text-xs text-white/70">
                                By subscribing to our mailing list, you agree with our{' '}
                                <a href="/data-privacy" className="underline hover:text-white">
                                    Privacy Policy
                                </a>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-white/20 pt-8 text-center">
                    <p className="text-sm text-white/70">COPYRIGHT PAGSANJAN FALLS 2025</p>
                </div>
            </div>
        </footer>
    );
};

export default function HotelDetails() {
    const { auth } = usePage<SharedData>().props;
    const { hotel, rooms } = usePage<PageProps>().props;
    const user = auth?.user?.role_id ?? 0;

    return (
        <>
            <Head title={hotel.hotel_name} />
            <PublicNavBar role={user} />

            <div className="min-h-screen bg-gray-50">
                {/* Hotel Header */}
                <div className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>

                        <div className="mt-4">
                            <h1 className="text-4xl font-light text-gray-900">{hotel.hotel_name}</h1>
                            <div className="mt-2 flex items-center text-gray-600">
                                <MapPin className="mr-2 h-5 w-5" />
                                <span className="text-lg">{hotel.location}</span>
                            </div>
                            {hotel.description && (
                                <p className="mt-4 max-w-3xl text-gray-600">{hotel.description}</p>
                            )}
                        </div>

                        {/* Hotel Image Gallery */}
                        <div className="mt-8">
                            <ImageGallery images={hotel.hotel_images || []} mainImage={hotel.image_url} />
                        </div>
                    </div>
                </div>

                {/* Rooms List */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <h2 className="mb-12 text-3xl font-light text-gray-900">Available Rooms</h2>

                    {rooms.length === 0 ? (
                        <div className="rounded-lg bg-white p-12 text-center shadow">
                            <p className="text-lg text-gray-500">No rooms available at this hotel.</p>
                        </div>
                    ) : (
                        <div className="rounded-xl bg-white p-8 shadow-xl md:p-12">
                            <div className="space-y-12">
                                {rooms.map((room, index) => (
                                    <div key={room.id}>
                                        {/* Room Section */}
                                        <div
                                            className={`${
                                                !room.is_bookable ? 'opacity-60' : ''
                                            }`}
                                        >
                                            <div className="grid gap-8 md:grid-cols-2 items-center">
                                            {/* Room Image - Left on odd, Right on even */}
                                            <div
                                                className={`relative overflow-hidden rounded-lg ${
                                                    index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                                                }`}
                                            >
                                        <div className="aspect-[4/3] w-full">
                                            {room.image_url ? (
                                                <img
                                                    src={room.image_url}
                                                    alt={room.room_name}
                                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                                                    <div className="text-center">
                                                        <Bed className="mx-auto h-16 w-16 text-gray-500" />
                                                        <p className="mt-2 text-sm text-gray-600">No Image</p>
                                                    </div>
                                                </div>
                                            )}
                                            {!room.is_bookable && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                                    <span className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                                                        Not Available
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Room Details - Right on odd, Left on even */}
                                    <div
                                        className={`space-y-6 ${
                                            index % 2 === 0 ? 'md:order-1' : 'md:order-2'
                                        }`}
                                    >
                                        <div>
                                            <h3 className="text-3xl font-semibold text-gray-900">{room.room_name}</h3>
                                            <p className="mt-2 text-lg text-gray-500">{room.room_type}</p>
                                        </div>

                                        {room.description && (
                                            <p className="text-gray-600 leading-relaxed">{room.description}</p>
                                        )}

                                        {/* Room Info */}
                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-700">
                                                <Users className="mr-3 h-5 w-5 text-[#18371e]" />
                                                <span className="font-medium">Capacity:</span>
                                                <span className="ml-2">{room.capacity} guests</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <Bed className="mr-3 h-5 w-5 text-[#18371e]" />
                                                <span className="font-medium">Room Type:</span>
                                                <span className="ml-2">{room.room_type}</span>
                                            </div>
                                        </div>

                                        {/* Amenities */}
                                        {room.amenities && (
                                            <div className="rounded-lg bg-gray-50 p-4">
                                                <h4 className="mb-2 font-semibold text-gray-900">Amenities</h4>
                                                <p className="text-sm text-gray-600">{room.amenities}</p>
                                            </div>
                                        )}

                                        {/* Price and Booking */}
                                        <div className="flex items-center justify-between border-t pt-6">
                                            <div>
                                                <p className="text-sm text-gray-500">Starting from</p>
                                                <div className="flex items-baseline">
                                                    <span className="text-4xl font-bold text-[#18371e]">
                                                        ₱{room.price_per_night}
                                                    </span>
                                                    <span className="ml-2 text-lg text-gray-500">/ night</span>
                                                </div>
                                            </div>
                                            {room.is_bookable && (
                                                <Link
                                                    href={route('room.booking', room.id)}
                                                    className="rounded-lg bg-[#18371e] px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[#2a5230] hover:shadow-lg"
                                                >
                                                    Book Now
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        {/* Separator Line - except after last item */}
                        {index < rooms.length - 1 && (
                            <div className="my-12">
                                <div className="mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            </div>
                        )}
                    </div>
                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ContactSection />
        </>
    );
}
