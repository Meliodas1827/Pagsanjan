import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Anchor, Building2, MapPin, Palmtree, Search, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import PublicNavBar from '../landing-page/components/public-nav-bar';

type AccommodationType = 'landingAreas' | 'hotels' | 'resorts' | 'restaurants';

interface LandingArea {
    id: number;
    name: string;
    description: string | null;
    location: string | null;
    address: string | null;
    capacity: number;
    image: string | null;
    payment_qr: string | null;
    price: number | string;
    price_per_adult?: number | string | null;
    price_per_child?: number | string | null;
}

interface Hotel {
    id: number;
    hotel_name: string;
    location: string | null;
    description: string | null;
    image_url: string | null;
}

interface Resort {
    id: number;
    resort_name: string;
    img: string | null;
    payment_qr: string | null;
    deleted: number;
}

interface Restaurant {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
}

interface AccommodationPageProps {
    landingAreas?: LandingArea[];
    hotels?: Hotel[];
    resorts?: Resort[];
    restaurants?: Restaurant[];
    accommodation?: {
        name: string;
        label?: string;
        heroImage: string;
        description: string[];
        location: string;
        capacity: string;
        features: string[];
        amenities: {
            personalCare?: string[];
            entertainment?: string[];
            refreshments?: string[];
        };
        detailImage: string;
        locationText: string;
    };
}

// Default accommodation data
const defaultAccommodation = {
    name: 'Landing Area',
    heroImage: '/images/pool.png',
    description: [
        'Experience the beauty of our lake-filling pool with a breathtaking beach view. Our accommodations offer a perfect blend of comfort and natural scenery, featuring Casa de Roca, Casanova, Casita Terrace, and more.',
        'Our bathhouse-inspired rooms provide an ideal setting for families and groups seeking a memorable retreat. Each space is thoughtfully designed to offer both privacy and communal areas for gathering.',
    ],
    location: 'Nestled along the pristine shores of Pagsanjan, our Landing Area offers direct access to the falls and surrounding natural beauty.',
    capacity: 'Rooms can accommodate 2-6 guests depending on the accommodation type selected.',
    features: [
        'Each room measures approximately 75 sqm',
        'With 2 single beds or 1 queen bed',
        'Mountain and lake views',
        'Bathroom with sink, rain shower and premium toiletries',
    ],
    amenities: {
        personalCare: ['Algidtherm toiletries', 'Plush towels and bathrobes', 'Hair dryer'],
        entertainment: ['TV with in-house movie channels', 'Wireless internet access', 'Bluetooth speaker'],
        refreshments: ['Welcome drink on arrival', 'Bottled water', 'Mini-refrigerator', 'Coffee and tea making facilities'],
    },
    detailImage: '/images/room.png',
    locationText: 'Brgy. Taft Side, Pagsanjan, Laguna',
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
        </>
    );
};

const AccommodationPage = ({ landingAreas, hotels, resorts, restaurants, accommodation = defaultAccommodation }: AccommodationPageProps) => {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user?.role_id ?? 0;
    const [searchTerm, setSearchTerm] = useState('');

    // Determine initial active tab based on available data
    const getInitialTab = (): AccommodationType => {
        if (landingAreas) return 'landingAreas';
        if (hotels) return 'hotels';
        if (resorts) return 'resorts';
        if (restaurants) return 'restaurants';
        return 'landingAreas';
    };

    const [activeTab, setActiveTab] = useState<AccommodationType>(getInitialTab());

    const handleBookNow = () => {
        if (!user) {
            router.visit('/login');
        } else {
            // Handle booking logic
            console.log('Booking:', accommodation.name);
        }
    };

    // If any list data is provided, show combined list view
    if (landingAreas || hotels || resorts || restaurants) {
        const filteredLandingAreas = landingAreas?.filter((area) => area.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];
        const filteredHotels = hotels?.filter((hotel) => hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase())) || [];
        const filteredResorts = resorts?.filter((resort) => resort.resort_name.toLowerCase().includes(searchTerm.toLowerCase())) || [];
        const filteredRestaurants = restaurants?.filter((restaurant) => restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

        const tabs = [
            {
                id: 'landingAreas' as AccommodationType,
                label: 'Landing Areas',
                icon: Anchor,
                count: landingAreas?.length || 0,
                visible: !!landingAreas,
            },
            { id: 'hotels' as AccommodationType, label: 'Hotels', icon: Building2, count: hotels?.length || 0, visible: !!hotels },
            { id: 'resorts' as AccommodationType, label: 'Resorts', icon: Palmtree, count: resorts?.length || 0, visible: !!resorts },
            {
                id: 'restaurants' as AccommodationType,
                label: 'Restaurants',
                icon: UtensilsCrossed,
                count: restaurants?.length || 0,
                visible: !!restaurants,
            },
        ].filter((tab) => tab.visible);

        const getPlaceholder = () => {
            switch (activeTab) {
                case 'hotels':
                    return 'Search hotels...';
                case 'resorts':
                    return 'Search resorts...';
                case 'restaurants':
                    return 'Search restaurants...';
                default:
                    return 'Search landing areas...';
            }
        };

        return (
            <>
                <Head title="Accommodations" />
                <PublicNavBar role={user} />
                <div className="min-h-screen bg-white">
                    {/* Hero Background - Full Width */}
                    <div className="relative h-[50vh] w-full">
                        <img src="/images/mainbg.jpg" alt="Accommodations" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10"></div>
                    </div>

                    {/* White Content Card Overlaying Bottom of Hero */}
                    <div className="relative -mt-32 min-h-screen bg-white">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                            <div className="rounded-t-3xl bg-white px-8 py-12 shadow-2xl md:px-16 md:py-16">
                                {/* Header Section */}
                                <div className="mb-12">
                                    <h1 className="mb-4 text-center font-serif text-5xl font-bold text-gray-900 md:text-6xl">Accommodations</h1>
                                    <p className="mb-8 text-center text-lg text-gray-600">Explore our collection of destinations and facilities</p>

                                    {/* Tabs */}
                                    <div className="mb-6 flex flex-wrap justify-center gap-2">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                                                        activeTab === tab.id
                                                            ? 'bg-[#2d5f5d] text-white shadow-md'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    {tab.label}
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                            activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        {tab.count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative mx-auto max-w-xl">
                                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            placeholder={getPlaceholder()}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-12 rounded-full bg-gray-50 pl-12 text-base"
                                        />
                                    </div>
                                </div>

                                {/* Accommodation Items - Vertical Layout */}
                                <div className="space-y-12">
                                    {/* Landing Areas */}
                                    {activeTab === 'landingAreas' &&
                                        (filteredLandingAreas.length === 0 ? (
                                            <div className="py-12 text-center text-gray-500">
                                                {searchTerm
                                                    ? 'No landing areas found matching your search.'
                                                    : 'No landing areas available at the moment.'}
                                            </div>
                                        ) : (
                                            filteredLandingAreas.map((area, index) => (
                                                <>
                                                    <div
                                                        key={area.id}
                                                        className={`grid gap-8 rounded-2xl bg-white p-6 transition-all duration-300 md:grid-cols-2 md:gap-12 md:p-8 ${
                                                            index % 2 === 0 ? '' : 'md:grid-flow-dense'
                                                        }`}
                                                    >
                                                        {/* Description Section */}
                                                        <div
                                                            className={`flex flex-col justify-center space-y-4 ${index % 2 === 0 ? '' : 'md:col-start-2'}`}
                                                        >
                                                            <div className="mb-2">
                                                                <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
                                                                    <Anchor className="h-6 w-6 text-blue-600" />
                                                                    {area.name}
                                                                </h3>
                                                                <div className="mb-3 space-y-2">
                                                                    {area.price_per_adult && (
                                                                        <div className="inline-block mr-2 rounded-full bg-blue-100 px-4 py-1.5">
                                                                            <p className="text-sm font-bold text-blue-800">
                                                                                Adult: ₱{typeof area.price_per_adult === 'number' ? area.price_per_adult.toFixed(2) : area.price_per_adult}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {area.price_per_child && (
                                                                        <div className="inline-block rounded-full bg-green-100 px-4 py-1.5">
                                                                            <p className="text-sm font-bold text-green-800">
                                                                                Child: ₱{typeof area.price_per_child === 'number' ? area.price_per_child.toFixed(2) : area.price_per_child}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {!area.price_per_adult && !area.price_per_child && area.price && (
                                                                        <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5">
                                                                            <p className="text-lg font-bold text-blue-800">
                                                                                ₱{typeof area.price === 'number' ? area.price.toFixed(2) : area.price}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {area.description && <p className="text-gray-700">{area.description}</p>}
                                                            </div>

                                                            <div className="space-y-3 border-t border-gray-200 pt-4">
                                                                {area.location && (
                                                                    <div className="flex items-start gap-3 text-gray-700">
                                                                        <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                                        <span>{area.location}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Image and Button Section */}
                                                        <div
                                                            className={`flex flex-col gap-4 ${index % 2 === 0 ? '' : 'md:col-start-1 md:row-start-1'}`}
                                                        >
                                                            <div className="relative overflow-hidden rounded-xl bg-gray-200 shadow-md">
                                                                {area.image ? (
                                                                    <img
                                                                        src={`/storage/${area.image}`}
                                                                        alt={area.name}
                                                                        className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-96"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-80 w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 md:h-96">
                                                                        <Anchor className="h-24 w-24 text-blue-600 opacity-50" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Button asChild size="lg" className="w-full bg-[#2d5f5d] text-lg hover:bg-[#3d6b68]">
                                                                <Link href={`/landing-area/${area.id}/book`}>Book Now</Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </>
                                            ))
                                        ))}

                                    {/* Hotels */}
                                    {activeTab === 'hotels' &&
                                        (filteredHotels.length === 0 ? (
                                            <div className="py-12 text-center text-gray-500">
                                                {searchTerm ? 'No hotels found matching your search.' : 'No hotels available at the moment.'}
                                            </div>
                                        ) : (
                                            filteredHotels.map((hotel, index) => (
                                                <div
                                                    key={hotel.id}
                                                    className={`grid gap-8 rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl md:grid-cols-2 md:gap-12 md:p-8 ${
                                                        index % 2 === 0 ? '' : 'md:grid-flow-dense'
                                                    }`}
                                                >
                                                    {/* Description Section */}
                                                    <div
                                                        className={`flex flex-col justify-center space-y-4 ${index % 2 === 0 ? '' : 'md:col-start-2'}`}
                                                    >
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
                                                    </div>

                                                    {/* Image and Button Section */}
                                                    <div className={`flex flex-col gap-4 ${index % 2 === 0 ? '' : 'md:col-start-1 md:row-start-1'}`}>
                                                        <div className="relative overflow-hidden rounded-xl bg-gray-200 shadow-md">
                                                            {hotel.image_url ? (
                                                                <img
                                                                    src={`/storage/${hotel.image_url}`}
                                                                    alt={hotel.hotel_name}
                                                                    className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-96"
                                                                />
                                                            ) : (
                                                                <div className="flex h-80 w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200 md:h-96">
                                                                    <Building2 className="h-24 w-24 text-green-600 opacity-50" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Button asChild size="lg" className="w-full bg-[#2d5f5d] text-lg hover:bg-[#3d6b68]">
                                                            <Link href={`/hotel/${hotel.id}`}>Book Now</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ))}

                                    {/* Resorts */}
                                    {activeTab === 'resorts' &&
                                        (filteredResorts.length === 0 ? (
                                            <div className="py-12 text-center text-gray-500">
                                                {searchTerm ? 'No resorts found matching your search.' : 'No resorts available at the moment.'}
                                            </div>
                                        ) : (
                                            filteredResorts.map((resort, index) => (
                                                <div
                                                    key={resort.id}
                                                    className={`grid gap-8 rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl md:grid-cols-2 md:gap-12 md:p-8 ${
                                                        index % 2 === 0 ? '' : 'md:grid-flow-dense'
                                                    }`}
                                                >
                                                    {/* Description Section */}
                                                    <div
                                                        className={`flex flex-col justify-center space-y-4 ${index % 2 === 0 ? '' : 'md:col-start-2'}`}
                                                    >
                                                        <div className="mb-2">
                                                            <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
                                                                <Palmtree className="h-6 w-6 text-teal-600" />
                                                                {resort.resort_name}
                                                            </h3>
                                                            <div className="rounded-lg bg-teal-50 p-4">
                                                                <p className="text-sm font-medium text-teal-800">
                                                                    Pools, gardens, and recreational amenities available
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Image and Button Section */}
                                                    <div className={`flex flex-col gap-4 ${index % 2 === 0 ? '' : 'md:col-start-1 md:row-start-1'}`}>
                                                        <div className="relative overflow-hidden rounded-xl bg-gray-200 shadow-md">
                                                            {resort.img ? (
                                                                <img
                                                                    src={resort.img}
                                                                    alt={resort.resort_name}
                                                                    className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-96"
                                                                />
                                                            ) : (
                                                                <div className="flex h-80 w-full items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200 md:h-96">
                                                                    <Palmtree className="h-24 w-24 text-teal-600 opacity-50" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Button asChild size="lg" className="w-full bg-[#2d5f5d] text-lg hover:bg-[#3d6b68]">
                                                            <Link href={`/resort/${resort.id}`}>Book Now</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ))}

                                    {/* Restaurants */}
                                    {activeTab === 'restaurants' &&
                                        (filteredRestaurants.length === 0 ? (
                                            <div className="py-12 text-center text-gray-500">
                                                {searchTerm
                                                    ? 'No restaurants found matching your search.'
                                                    : 'No restaurants available at the moment.'}
                                            </div>
                                        ) : (
                                            filteredRestaurants.map((restaurant, index) => (
                                                <div
                                                    key={restaurant.id}
                                                    className={`grid gap-8 rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl md:grid-cols-2 md:gap-12 md:p-8 ${
                                                        index % 2 === 0 ? '' : 'md:grid-flow-dense'
                                                    }`}
                                                >
                                                    {/* Description Section */}
                                                    <div
                                                        className={`flex flex-col justify-center space-y-4 ${index % 2 === 0 ? '' : 'md:col-start-2'}`}
                                                    >
                                                        <div className="mb-2">
                                                            <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
                                                                <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                                                                {restaurant.name}
                                                            </h3>
                                                            {restaurant.description && <p className="text-gray-700">{restaurant.description}</p>}
                                                        </div>
                                                    </div>

                                                    {/* Image and Button Section */}
                                                    <div className={`flex flex-col gap-4 ${index % 2 === 0 ? '' : 'md:col-start-1 md:row-start-1'}`}>
                                                        <div className="relative overflow-hidden rounded-xl bg-gray-200 shadow-md">
                                                            {restaurant.image ? (
                                                                <img
                                                                    src={restaurant.image}
                                                                    alt={restaurant.name}
                                                                    className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-96"
                                                                />
                                                            ) : (
                                                                <div className="flex h-80 w-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 md:h-96">
                                                                    <UtensilsCrossed className="h-24 w-24 text-orange-600 opacity-50" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Button asChild size="lg" className="w-full bg-[#2d5f5d] text-lg hover:bg-[#3d6b68]">
                                                            <Link href={`/restaurant/${restaurant.id}`}>Book Now</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ContactSection />
                </div>
            </>
        );
    }

    // Otherwise show single accommodation detail view
    return (
        <>
            <Head />
            <PublicNavBar role={user} />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="relative h-[70vh] overflow-visible">
                    <img src={accommodation.heroImage} alt={accommodation.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>

                    {/* Floating Card */}
                    <div className="absolute bottom-0 left-1/2 z-10 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 transform px-4 sm:px-6 lg:px-8">
                        <div className="rounded-t-3xl bg-white px-8 py-12 shadow-2xl md:px-12">
                            <h1 className="mb-6 text-center font-serif text-4xl font-bold text-gray-900 md:text-5xl">{accommodation.name}</h1>
                            <div className="space-y-4 text-gray-700">
                                {accommodation.description.map((paragraph, index) => (
                                    <p key={index} className="leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Accommodation Details Section */}
                <section className="bg-white pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                            {/* Left Column - Text Content */}
                            <div className="space-y-6">
                                {accommodation.label && (
                                    <div className="inline-block rounded-full bg-[#2d5f5d]/10 px-4 py-1">
                                        <span className="text-xs font-bold tracking-wider text-[#2d5f5d] uppercase">{accommodation.label}</span>
                                    </div>
                                )}

                                <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">{accommodation.name}</h2>

                                <p className="leading-relaxed text-gray-700">{accommodation.location}</p>

                                <p className="leading-relaxed text-gray-700">{accommodation.capacity}</p>

                                {/* Features */}
                                <div>
                                    <h3 className="mb-3 text-lg font-bold text-gray-900 uppercase">Features:</h3>
                                    <ul className="space-y-2">
                                        {accommodation.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="mt-1.5 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2d5f5d]"></span>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <h3 className="mb-3 text-lg font-bold text-gray-900 uppercase">Amenities:</h3>
                                    <div className="space-y-4">
                                        {accommodation.amenities.personalCare && (
                                            <div>
                                                <h4 className="mb-2 font-semibold text-gray-900">Personal Care:</h4>
                                                <ul className="space-y-1">
                                                    {accommodation.amenities.personalCare.map((item, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mt-1.5 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2d5f5d]"></span>
                                                            <span className="text-sm text-gray-700">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {accommodation.amenities.entertainment && (
                                            <div>
                                                <h4 className="mb-2 font-semibold text-gray-900">Entertainment:</h4>
                                                <ul className="space-y-1">
                                                    {accommodation.amenities.entertainment.map((item, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mt-1.5 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2d5f5d]"></span>
                                                            <span className="text-sm text-gray-700">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {accommodation.amenities.refreshments && (
                                            <div>
                                                <h4 className="mb-2 font-semibold text-gray-900">Refreshments:</h4>
                                                <ul className="space-y-1">
                                                    {accommodation.amenities.refreshments.map((item, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mt-1.5 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2d5f5d]"></span>
                                                            <span className="text-sm text-gray-700">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Image & Booking */}
                            <div className="space-y-6">
                                <div className="overflow-hidden rounded-2xl shadow-xl">
                                    <img
                                        src={accommodation.detailImage}
                                        alt={`${accommodation.name} interior`}
                                        className="h-96 w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>

                                <div className="text-center">
                                    <p className="mb-4 text-sm text-gray-600">
                                        <span className="font-semibold">Located at:</span> {accommodation.locationText}
                                    </p>

                                    <Button
                                        onClick={handleBookNow}
                                        className="group w-full rounded-lg bg-[#2d5f5d] px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#3d6b68] hover:shadow-xl sm:w-auto"
                                    >
                                        BOOK NOW
                                        <svg
                                            className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ContactSection />
            </div>
        </>
    );
};

export default AccommodationPage;
