import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import PublicNavBar from '../landing-page/components/public-nav-bar';

interface HotelImage {
    id: number;
    image_url: string;
}

interface Hotel {
    id: number;
    hotel_name: string;
    location: string | null;
    description: string | null;
    image_url: string | null;
    images: HotelImage[];
}

interface Props {
    hotels: Hotel[];
}

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
        <>
            {/* Footer Section */}
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
                                {/* <a href="/#about" className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]">
                                    ABOUT US
                                </a>
                                <a href="/#activities" className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]">
                                    ACTIVITIES
                                </a> */}
                                <a
                                    href="/contact-us"
                                    className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                                >
                                    CONTACT US
                                </a>
                                <a href="/faq" className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]">
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
                                        className="rounded-md bg-[#2d5f5d] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d6b68] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading ? 'Subscribing...' : 'Subscribe'}
                                    </button>
                                </div>
                                {message && (
                                    <p className={`text-sm ${message.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>{message.text}</p>
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
        </>
    );
};

export default function HotelList({ hotels = [] }: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user?.role_id ?? 0;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHotels = hotels.filter((hotel) => hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <Head title="Hotels" />
            <PublicNavBar role={user} />
            <div className="min-h-screen bg-white">
                {/* Hero Background - Full Width */}
                <div className="relative h-[50vh] w-full">
                    <img src="/images/mainbg.jpg" alt="Hotels" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10"></div>
                </div>

                {/* White Content Card Overlaying Bottom of Hero */}
                <div className="relative -mt-32 min-h-screen bg-white">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-t-3xl bg-white px-8 py-12 shadow-2xl md:px-16 md:py-16">
                            {/* Header Section */}
                            <div className="mb-12">
                                <h1 className="mb-4 text-center font-serif text-5xl font-bold text-gray-900 md:text-6xl">Hotels</h1>
                                <p className="mb-8 text-center text-lg text-gray-600">
                                    Experience comfort and luxury in our well-appointed hotel rooms
                                </p>

                                {/* Search Bar */}
                                <div className="relative mx-auto max-w-xl">
                                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search hotels..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-12 rounded-full bg-gray-50 pl-12 text-base"
                                    />
                                </div>
                            </div>

                            {/* Hotels - Vertical Layout */}
                            <div className="space-y-12">
                                {filteredHotels.length === 0 ? (
                                    <div className="py-12 text-center text-gray-500">
                                        {searchTerm ? 'No hotels found matching your search.' : 'No hotels available at the moment.'}
                                    </div>
                                ) : (
                                    filteredHotels.map((hotel, index) => (
                                        <div key={hotel.id} className="space-y-6">
                                            <div
                                                className={`grid gap-8 rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl md:grid-cols-2 md:gap-12 md:p-8 ${
                                                    index % 2 === 0 ? '' : 'md:grid-flow-dense'
                                                }`}
                                            >
                                                {/* Description Section */}
                                                <div className={`flex flex-col justify-center space-y-4 ${index % 2 === 0 ? '' : 'md:col-start-2'}`}>
                                                    <div className="mb-2">
                                                        <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
                                                            <Building2 className="h-6 w-6 text-green-600" />
                                                            {hotel.hotel_name}
                                                        </h3>
                                                        {hotel.description && <p className="text-gray-700">{hotel.description}</p>}
                                                    </div>

                                                    {hotel.location && (
                                                        <div className="border-t border-gray-200 pt-4">
                                                            <div className="flex items-start gap-3 text-gray-700">
                                                                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                                <span>{hotel.location}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Hotel Images - Maximum 10 */}
                                                    {hotel.images && Array.isArray(hotel.images) && hotel.images.length > 0 && (
                                                        <div className="border-t border-gray-200 pt-4">
                                                            <h4 className="mb-3 text-sm font-semibold text-gray-800">
                                                                Hotel Images ({Math.min(hotel.images.length, 10)} of {hotel.images.length})
                                                            </h4>
                                                            <div className="grid grid-cols-5 gap-2">
                                                                {hotel.images.slice(0, 10).map((image, imgIndex) => (
                                                                    <div
                                                                        key={image.id || imgIndex}
                                                                        className="relative aspect-square overflow-hidden rounded-lg bg-gray-200 shadow-sm"
                                                                    >
                                                                        <img
                                                                            src={image.image_url}
                                                                            alt={`${hotel.hotel_name} - Image ${imgIndex + 1}`}
                                                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                                                            onError={(e) => {
                                                                                e.currentTarget.src = '/images/placeholder.png';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Image and Button Section */}
                                                <div className={`flex flex-col gap-4 ${index % 2 === 0 ? '' : 'md:col-start-1 md:row-start-1'}`}>
                                                    <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 shadow-md">
                                                        {hotel.image_url ? (
                                                            <img
                                                                src={hotel.image_url}
                                                                alt={hotel.hotel_name}
                                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                                                                <Building2 className="h-24 w-24 text-green-600 opacity-50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button asChild size="lg" className="w-full bg-[#2d5f5d] text-lg hover:bg-[#3d6b68]">
                                                        <Link href={`/hotel/${hotel.id}`}>Book Now</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <ContactSection />
                </div>
            </div>
        </>
    );
}
