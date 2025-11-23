import { Head, Link, usePage, router } from '@inertiajs/react';
import { ArrowLeft, MapPin, Bed, Users, DollarSign, LogOut, NotebookTabs, User, UserRoundCog } from 'lucide-react';
import { type SharedData } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ImageGallery from './components/ImageGallery';

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
                    <h2 className="mb-8 text-3xl font-light text-gray-900">Available Rooms</h2>

                    {rooms.length === 0 ? (
                        <div className="rounded-lg bg-white p-12 text-center shadow">
                            <p className="text-lg text-gray-500">No rooms available at this hotel.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {rooms.map((room) => (
                                <div key={room.id} className="relative">
                                    {/* Image Card - Base Layer */}
                                    <div className="relative h-72 overflow-hidden rounded-lg shadow-lg">
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

                                    {/* Details Card - Overlapping Layer */}
                                    <div className="relative -mt-16 mx-4 rounded-lg bg-white p-6 shadow-xl">
                                        <h3 className="text-xl font-semibold text-gray-900">{room.room_name}</h3>
                                        <p className="mt-1 text-sm text-gray-500">{room.room_type}</p>

                                        {room.description && (
                                            <p className="mt-3 line-clamp-2 text-sm text-gray-600">{room.description}</p>
                                        )}

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Users className="mr-2 h-4 w-4" />
                                                <span>Capacity: {room.capacity} guests</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Bed className="mr-2 h-4 w-4" />
                                                <span>{room.room_type}</span>
                                            </div>
                                            {room.amenities && (
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Amenities:</span> {room.amenities}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                                            <div className="flex items-center">
                                                <DollarSign className="h-5 w-5 text-green-600" />
                                                <span className="text-2xl font-bold text-gray-900">
                                                    {room.price_per_night}
                                                </span>
                                                <span className="ml-1 text-sm text-gray-500">/ night</span>
                                            </div>
                                            {room.is_bookable && (
                                                <Link
                                                    href={route('room.booking', room.id)}
                                                    className="rounded-md bg-[#18371e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a5230]"
                                                >
                                                    Book Now
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
