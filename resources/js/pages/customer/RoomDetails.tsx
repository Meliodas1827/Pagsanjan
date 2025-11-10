import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Bed,
    Building,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Coffee,
    Droplet,
    Eye,
    Gift,
    Home,
    MapPin,
    Maximize2,
    Tv,
    Users,
    Wifi,
} from 'lucide-react';
import React, { useState } from 'react';

interface Room {
    id: number;
    room_name: string;
    room_type: string;
    promo_label?: string;
    description?: string;
    location_details?: string;
    max_adults: number;
    max_children: number;
    children_age_limit?: number;
    room_size_sqm?: number;
    number_of_beds?: number;
    bed_type?: string;
    view_type?: string;
    bathroom_sinks?: number;
    has_rain_shower: boolean;
    has_premium_toiletries: boolean;
    has_algotherm_toiletries: boolean;
    has_tv: boolean;
    has_movie_channels: boolean;
    has_wifi: boolean;
    has_welcome_drink: boolean;
    has_bottled_water: boolean;
    has_mini_refrigerator: boolean;
    building_name?: string;
    floor_number?: number;
    full_address?: string;
    main_image?: string;
    image_gallery?: string[];
    is_bookable: boolean;
}

interface Pricing {
    price_per_night: number;
    weekend_price?: number;
    holiday_price?: number;
    early_bird_discount?: number;
    early_bird_days?: number;
    extended_stay_discount?: number;
    extended_stay_nights?: number;
    extra_adult_charge?: number;
    extra_child_charge?: number;
    season: string;
}

interface SimilarRoom {
    id: number;
    room_name: string;
    room_type: string;
    main_image?: string;
    max_adults: number;
    max_children: number;
    price_per_night: number;
}

interface DayAvailability {
    status: 'available' | 'limited' | 'fully-booked';
    total_rooms: number;
    booked_rooms: number;
    available_rooms: number;
}

type AvailabilityData = Record<string, DayAvailability>;

interface RoomDetailsProps {
    room: Room;
    pricing: Pricing | null;
    similarRooms: SimilarRoom[];
    availabilityData: AvailabilityData;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ room, pricing, similarRooms, availabilityData }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
    const [checkInDate, setCheckInDate] = useState<string | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<string | null>(null);

    // Boat ride states
    const [isBoatRideEnabled, setIsBoatRideEnabled] = useState(false);
    const [boatRideDate, setBoatRideDate] = useState('');
    const [boatAdults, setBoatAdults] = useState(1);
    const [boatChildren, setBoatChildren] = useState(0);

    const images = room.image_gallery && room.image_gallery.length > 0 ? room.image_gallery : room.main_image ? [room.main_image] : [];

    const formatPrice = (price?: number) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(price);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const amenities = [
        { label: 'WiFi', icon: Wifi, value: room.has_wifi },
        { label: 'TV', icon: Tv, value: room.has_tv },
        { label: 'Movie Channels', icon: Tv, value: room.has_movie_channels },
        { label: 'Rain Shower', icon: Droplet, value: room.has_rain_shower },
        { label: 'Premium Toiletries', icon: Gift, value: room.has_premium_toiletries },
        { label: 'Algotherm Toiletries', icon: Gift, value: room.has_algotherm_toiletries },
        { label: 'Welcome Drink', icon: Coffee, value: room.has_welcome_drink },
        { label: 'Bottled Water', icon: Droplet, value: room.has_bottled_water },
        { label: 'Mini Refrigerator', icon: Home, value: room.has_mini_refrigerator },
    ].filter((amenity) => amenity.value);

    // Calendar helper functions
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDateKey = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const navigateCalendarMonth = (direction: number) => {
        const newDate = new Date(currentCalendarMonth);
        newDate.setMonth(currentCalendarMonth.getMonth() + direction);
        setCurrentCalendarMonth(newDate);
    };

    const handleDateClick = (dateKey: string) => {
        const dayData = availabilityData[dateKey];

        if (dayData?.status === 'fully-booked' || new Date(dateKey) < new Date(new Date().setHours(0, 0, 0, 0))) {
            return;
        }

        if (!checkInDate) {
            setCheckInDate(dateKey);
            setCheckOutDate(null);
        } else if (!checkOutDate) {
            if (new Date(dateKey) <= new Date(checkInDate)) {
                setCheckInDate(dateKey);
                setCheckOutDate(null);
            } else {
                setCheckOutDate(dateKey);
            }
        } else {
            setCheckInDate(dateKey);
            setCheckOutDate(null);
        }
    };

    const isDateInRange = (dateKey: string) => {
        if (!checkInDate || !checkOutDate) return false;
        const date = new Date(dateKey);
        return date > new Date(checkInDate) && date < new Date(checkOutDate);
    };

    const isCheckInDate = (dateKey: string) => dateKey === checkInDate;
    const isCheckOutDate = (dateKey: string) => dateKey === checkOutDate;

    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateTotalPrice = () => {
        if (!pricing) return 0;
        const nights = calculateNights();
        return nights * pricing.price_per_night;
    };

    const getStatusClasses = (status: string, isToday: boolean = false, dateKey: string = '') => {
        let baseClasses =
            'relative p-3 min-h-[60px] border-2 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-sm font-medium rounded-lg';

        const inRange = isDateInRange(dateKey);
        const isCheckIn = isCheckInDate(dateKey);
        const isCheckOut = isCheckOutDate(dateKey);
        const isPast = new Date(dateKey) < new Date(new Date().setHours(0, 0, 0, 0));

        if (isToday) {
            baseClasses += ' ring-2 ring-[#18371e] ring-offset-2';
        }

        if (isCheckIn || isCheckOut) {
            return baseClasses + ' bg-[#18371e] border-[#18371e] text-white scale-105 shadow-lg';
        }

        if (inRange) {
            return baseClasses + ' bg-[#18371e]/20 border-[#18371e]/40 text-[#18371e]';
        }

        if (isPast) {
            return baseClasses + ' bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed';
        }

        switch (status) {
            case 'fully-booked':
                return baseClasses + ' bg-gradient-to-br from-red-50 to-red-100 border-red-300 text-red-800 cursor-not-allowed opacity-60';
            case 'limited':
                return (
                    baseClasses +
                    ' bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-800 hover:from-yellow-100 hover:to-yellow-200 hover:scale-105'
                );
            case 'available':
                return (
                    baseClasses +
                    ' bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-800 hover:from-green-100 hover:to-green-200 hover:scale-105'
                );
            default:
                return baseClasses + ' bg-white border-gray-200 hover:bg-gray-50 hover:scale-105';
        }
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentCalendarMonth);
        const firstDay = getFirstDayOfMonth(currentCalendarMonth);
        const days = [];
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="min-h-[60px] p-3"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = formatDateKey(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
            const dayData = availabilityData[dateKey];
            const isToday = dateKey === todayString;
            const isCheckIn = isCheckInDate(dateKey);
            const isCheckOut = isCheckOutDate(dateKey);

            const cellClasses = getStatusClasses(dayData?.status || 'available', isToday, dateKey);

            days.push(
                <div key={day} className={cellClasses} onClick={() => handleDateClick(dateKey)}>
                    <span className="mb-1 text-lg font-bold">{day}</span>
                    {isCheckIn && <span className="mt-1 text-xs font-bold">Check-In</span>}
                    {isCheckOut && <span className="mt-1 text-xs font-bold">Check-Out</span>}
                    {!isCheckIn && !isCheckOut && dayData && (
                        <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold">
                            {dayData.available_rooms}/{dayData.total_rooms}
                        </span>
                    )}
                    {isToday && <div className="absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full bg-[#18371e]"></div>}
                </div>,
            );
        }

        return days;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
            <div className="mx-auto max-w-7xl px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="outline" className="mb-4 shadow-sm hover:bg-white" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <div className="animate-fade-in mb-8 text-center">
                        <h1 className="mb-2 text-5xl font-bold tracking-tight text-slate-800">{room.room_name}</h1>
                        <div className="mt-4 flex items-center justify-center gap-4">
                            <span className="rounded-full bg-[#18371e]/10 px-4 py-2 text-sm font-medium text-[#18371e]">{room.room_type}</span>
                            {room.promo_label && (
                                <span className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-yellow-900">{room.promo_label}</span>
                            )}
                        </div>
                        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#18371e]"></div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Images and Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Main Image */}
                        {images.length > 0 ? (
                            <>
                                <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
                                    <img
                                        src={`/storage/${images[currentImageIndex]}`}
                                        alt={`${room.room_name} - Image ${currentImageIndex + 1}`}
                                        className="h-96 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white"
                                            >
                                                <ChevronLeft className="h-6 w-6 text-gray-800" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white"
                                            >
                                                <ChevronRight className="h-6 w-6 text-gray-800" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {images.length > 1 && (
                                    <div className="grid grid-cols-5 gap-3">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:scale-105 ${
                                                    currentImageIndex === idx ? 'ring-4 ring-[#18371e]' : 'ring-2 ring-transparent'
                                                }`}
                                            >
                                                <img src={`/storage/${img}`} alt={`View ${idx + 1}`} className="h-20 w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex h-96 items-center justify-center rounded-2xl bg-gray-200">
                                <span className="text-lg text-gray-400">No images available</span>
                            </div>
                        )}

                        {/* Description */}
                        {room.description && (
                            <div className="rounded-2xl bg-white bg-white/90 p-8 shadow-lg backdrop-blur-sm">
                                <h2 className="mb-4 text-2xl font-bold text-slate-800">About This Room</h2>
                                <p className="text-lg leading-relaxed text-slate-600">{room.description}</p>
                            </div>
                        )}

                        {/* Room Features */}
                        <div className="rounded-2xl bg-white bg-white/90 p-8 shadow-lg backdrop-blur-sm">
                            <h2 className="mb-6 text-2xl font-bold text-slate-800">Room Features</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {room.max_adults && (
                                    <div className="flex items-center gap-3 rounded-xl bg-[#18371e]/10 p-4">
                                        <Users className="h-6 w-6 text-[#18371e]" />
                                        <div>
                                            <div className="text-xs text-gray-600">Adults</div>
                                            <div className="font-bold text-gray-900">Up to {room.max_adults}</div>
                                        </div>
                                    </div>
                                )}
                                {room.max_children > 0 && (
                                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                                        <Users className="h-6 w-6 text-purple-600" />
                                        <div>
                                            <div className="text-xs text-gray-600">Children</div>
                                            <div className="font-bold text-gray-900">Up to {room.max_children}</div>
                                        </div>
                                    </div>
                                )}
                                {room.room_size_sqm && (
                                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                                        <Maximize2 className="h-6 w-6 text-green-600" />
                                        <div>
                                            <div className="text-xs text-gray-600">Room Size</div>
                                            <div className="font-bold text-gray-900">{room.room_size_sqm} m²</div>
                                        </div>
                                    </div>
                                )}
                                {room.number_of_beds && (
                                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 p-4">
                                        <Bed className="h-6 w-6 text-orange-600" />
                                        <div>
                                            <div className="text-xs text-gray-600">Beds</div>
                                            <div className="font-bold text-gray-900">
                                                {room.number_of_beds} {room.bed_type || 'Bed(s)'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {room.view_type && (
                                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 p-4">
                                        <Eye className="h-6 w-6 text-pink-600" />
                                        <div>
                                            <div className="text-xs text-gray-600">View</div>
                                            <div className="font-bold text-gray-900">{room.view_type}</div>
                                        </div>
                                    </div>
                                )}
                                {room.bathroom_sinks && (
                                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 p-4">
                                        <Droplet className="h-6 w-6 text-cyan-600" />
                                        <div>
                                            <div className="text-xs text-gray-600">Bathroom</div>
                                            <div className="font-bold text-gray-900">{room.bathroom_sinks} Sink(s)</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Boat Ride Availing Section */}
                        <div className="rounded-2xl bg-[#18371e] p-8 text-white shadow-xl">
                            <div className="mb-6 flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    id="boatRideCheckbox"
                                    checked={isBoatRideEnabled}
                                    onChange={(e) => setIsBoatRideEnabled(e.target.checked)}
                                    className="mt-1 h-6 w-6 cursor-pointer rounded border-2 border-white/30 bg-white/20 checked:bg-white checked:text-teal-600 focus:ring-2 focus:ring-white/50"
                                />
                                <label htmlFor="boatRideCheckbox" className="flex-1 cursor-pointer">
                                    <h2 className="mb-2 flex items-center gap-3 text-3xl font-bold">
                                        <span className="text-4xl">🚤</span>
                                        Boat Ride Availing
                                    </h2>
                                    <p className="text-sm text-white/80">Check this box to include a boat ride with your reservation</p>
                                </label>
                            </div>

                            {isBoatRideEnabled && (
                                <>
                                    <div className="mb-6 grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-white/90">
                                                Boat Ride Date <span className="text-yellow-300">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={boatRideDate}
                                                onChange={(e) => setBoatRideDate(e.target.value)}
                                                className="w-full rounded-lg border-2 border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm transition-all focus:ring-2 focus:ring-white/50 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-white/90">Adults</label>
                                            <select
                                                value={boatAdults}
                                                onChange={(e) => setBoatAdults(Number(e.target.value))}
                                                className="w-full rounded-lg border-2 border-white/30 bg-white/20 px-4 py-3 text-white backdrop-blur-sm transition-all focus:ring-2 focus:ring-white/50 focus:outline-none"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                                    <option key={n} value={n} className="bg-[#18371e] text-white">
                                                        {n}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-sm font-semibold text-white/90">Children (6 years old below)</label>
                                            <select
                                                value={boatChildren}
                                                onChange={(e) => setBoatChildren(Number(e.target.value))}
                                                className="w-full rounded-lg border-2 border-white/30 bg-white/20 px-4 py-3 text-white backdrop-blur-sm transition-all focus:ring-2 focus:ring-white/50 focus:outline-none"
                                            >
                                                {[0, 1, 2, 3, 4, 5].map((n) => (
                                                    <option key={n} value={n} className="bg-[#18371e] text-white">
                                                        {n}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (boatRideDate) {
                                                alert(`Boat ride added: ${boatRideDate}, ${boatAdults} adults, ${boatChildren} children`);
                                            } else {
                                                alert('Please select a boat ride date');
                                            }
                                        }}
                                        className="w-full transform rounded-lg bg-white py-4 text-lg font-bold text-teal-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-teal-50"
                                    >
                                        ADD BOAT RIDE
                                    </button>

                                    <p className="mt-4 text-center text-sm leading-relaxed text-teal-50">
                                        <span className="mr-1 inline-block">ℹ️</span>
                                        <strong>Note:</strong> Boat ride payment will be available after check-in of the guests to their respective
                                        accommodation.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Similar Rooms */}
                        {similarRooms.length > 0 && (
                            <div className="rounded-2xl bg-white bg-white/90 p-8 shadow-lg backdrop-blur-sm">
                                <h2 className="mb-6 text-2xl font-bold text-slate-800">Similar Rooms</h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {similarRooms.map((similarRoom) => (
                                        <Link
                                            key={similarRoom.id}
                                            href={`/room/${similarRoom.id}`}
                                            className="group block overflow-hidden rounded-xl border-2 border-gray-200 transition-all hover:border-teal-400 hover:shadow-lg"
                                        >
                                            {similarRoom.main_image ? (
                                                <img
                                                    src={`/storage/${similarRoom.main_image}`}
                                                    alt={similarRoom.room_name}
                                                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-32 w-full items-center justify-center bg-gray-200">
                                                    <span className="text-sm text-gray-400">No image</span>
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <h3 className="mb-1 font-bold text-gray-900 transition-colors group-hover:text-teal-600">
                                                    {similarRoom.room_name}
                                                </h3>
                                                <p className="mb-2 text-xs text-gray-600">{similarRoom.room_type}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">{similarRoom.max_adults} adults</span>
                                                    <span className="font-bold text-teal-600">{formatPrice(similarRoom.price_per_night)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 rounded-2xl bg-white p-8 shadow-2xl">
                            {/* Price */}
                            {pricing && (
                                <div className="mb-8 border-b-2 border-slate-100 pb-6 text-center">
                                    <div className="mb-2 text-5xl font-bold text-teal-600">{formatPrice(pricing.price_per_night)}</div>
                                    <div className="text-slate-500">
                                        per night <span className="text-sm">(inclusive of tax)</span>
                                    </div>
                                </div>
                            )}

                            {/* Amenities */}
                            {amenities.length > 0 && (
                                <div className="mb-8 space-y-4">
                                    <h3 className="mb-4 text-lg font-bold text-slate-800">Amenities</h3>
                                    {amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-slate-700">
                                            <amenity.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-500" />
                                            <span className="text-sm leading-relaxed">{amenity.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Extra Charges */}
                            {pricing && (pricing.extra_adult_charge || pricing.extra_child_charge) && (
                                <div className="mb-6 border-t border-slate-100 pt-4">
                                    <h3 className="mb-3 text-sm font-bold text-slate-800">Extra Charges</h3>
                                    {pricing.extra_adult_charge && (
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span className="text-slate-600">Per extra adult</span>
                                            <span className="font-medium">{formatPrice(pricing.extra_adult_charge)}</span>
                                        </div>
                                    )}
                                    {pricing.extra_child_charge && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Per extra child</span>
                                            <span className="font-medium">{formatPrice(pricing.extra_child_charge)}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Check Availability Button */}
                            {room.is_bookable ? (
                                <button
                                    onClick={() => setIsCalendarOpen(true)}
                                    className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-blue-700 hover:shadow-xl"
                                >
                                    <Calendar className="h-5 w-5" />
                                    CHECK AVAILABILITY
                                </button>
                            ) : (
                                <div className="w-full cursor-not-allowed rounded-lg bg-gray-400 py-4 text-center text-lg font-bold text-white">
                                    Not Available for Booking
                                </div>
                            )}

                            {/* Location Info */}
                            {(room.building_name || room.floor_number || room.location_details) && (
                                <div className="mt-6 border-t border-slate-100 pt-6">
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                        <MapPin className="h-4 w-4 text-teal-500" />
                                        Location
                                    </h3>
                                    <div className="space-y-2 text-sm text-slate-600">
                                        {room.building_name && (
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-gray-400" />
                                                <span>{room.building_name}</span>
                                            </div>
                                        )}
                                        {room.floor_number && (
                                            <div className="flex items-center gap-2">
                                                <Home className="h-4 w-4 text-gray-400" />
                                                <span>Floor {room.floor_number}</span>
                                            </div>
                                        )}
                                        {room.location_details && <p className="mt-2 text-xs text-slate-500">{room.location_details}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability Calendar Modal */}
            {isCalendarOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 rounded-t-2xl bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="mb-1 text-2xl font-bold">Room Availability Calendar</h2>
                                    <p className="text-white/80">{room.room_name}</p>
                                </div>
                                <button
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="rounded-full p-2 transition-colors hover:bg-white/20"
                                    aria-label="Close modal"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Calendar Navigation */}
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <button
                                    onClick={() => navigateCalendarMonth(-1)}
                                    className="rounded-full p-3 transition-all hover:bg-slate-100"
                                    aria-label="Previous month"
                                >
                                    <ChevronLeft className="h-6 w-6 text-slate-800" />
                                </button>

                                <h3 className="text-2xl font-bold text-slate-900">
                                    {monthNames[currentCalendarMonth.getMonth()]} {currentCalendarMonth.getFullYear()}
                                </h3>

                                <button
                                    onClick={() => navigateCalendarMonth(1)}
                                    className="rounded-full p-3 transition-all hover:bg-slate-100"
                                    aria-label="Next month"
                                >
                                    <ChevronRight className="h-6 w-6 text-slate-800" />
                                </button>
                            </div>

                            {/* Booking Instructions */}
                            <div className="mb-6 rounded-xl border-2 border-teal-200 bg-teal-50 p-4">
                                <p className="text-center text-sm font-medium text-teal-900">
                                    📅 Click to select your <strong>Check-In</strong> date, then click to select your <strong>Check-Out</strong> date
                                </p>
                            </div>

                            {/* Legend */}
                            <div className="mb-6 flex flex-wrap justify-center gap-3 rounded-xl bg-slate-50 p-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded border-2 border-teal-700 bg-gradient-to-br from-teal-500 to-blue-600"></div>
                                    <span className="text-sm font-medium text-slate-700">Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded border-2 border-teal-300 bg-teal-100"></div>
                                    <span className="text-sm font-medium text-slate-700">In Range</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100"></div>
                                    <span className="text-sm font-medium text-slate-700">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100"></div>
                                    <span className="text-sm font-medium text-slate-700">Fully Booked</span>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {dayNames.map((day) => (
                                    <div key={day} className="rounded-lg bg-slate-100 p-3 text-center text-sm font-bold text-slate-700">
                                        {day}
                                    </div>
                                ))}
                                {renderCalendar()}
                            </div>

                            {/* Booking Summary */}
                            {checkInDate && checkOutDate && (
                                <div className="mt-6 rounded-xl border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-blue-50 p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                                        <Calendar className="h-5 w-5 text-teal-600" />
                                        Booking Summary
                                    </h3>
                                    <div className="mb-4 grid grid-cols-2 gap-4">
                                        <div className="rounded-lg border border-teal-200 bg-white p-4">
                                            <div className="mb-1 text-xs text-slate-500">Check-In</div>
                                            <div className="font-bold text-slate-900">
                                                {new Date(checkInDate).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-teal-200 bg-white p-4">
                                            <div className="mb-1 text-xs text-slate-500">Check-Out</div>
                                            <div className="font-bold text-slate-900">
                                                {new Date(checkOutDate).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border-2 border-teal-300 bg-white p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-slate-700">Number of Nights:</span>
                                            <span className="text-lg font-bold text-slate-900">{calculateNights()}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                                            <span className="font-medium text-slate-700">Estimated Total:</span>
                                            <span className="text-2xl font-bold text-teal-600">{formatPrice(calculateTotalPrice())}</span>
                                        </div>
                                        <div className="mt-2 text-center text-xs text-slate-500">
                                            {formatPrice(pricing?.price_per_night)} × {calculateNights()}{' '}
                                            {calculateNights() === 1 ? 'night' : 'nights'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-4">
                                <button
                                    onClick={() => {
                                        setCheckInDate(null);
                                        setCheckOutDate(null);
                                    }}
                                    className="flex-1 rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-300"
                                >
                                    Clear Dates
                                </button>
                                {checkInDate && checkOutDate ? (
                                    <Link
                                        href={`/availability/hotel/${room.id}?check_in=${checkInDate}&check_out=${checkOutDate}`}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-3 text-center font-semibold text-white transition-all hover:from-teal-700 hover:to-blue-700"
                                    >
                                        <Calendar className="h-5 w-5" />
                                        Proceed to Book
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="flex-1 cursor-not-allowed rounded-xl bg-gray-400 px-6 py-3 font-semibold text-white opacity-60"
                                    >
                                        Select Dates First
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetails;
