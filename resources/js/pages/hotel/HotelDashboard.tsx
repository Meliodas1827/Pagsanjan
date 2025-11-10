import { Card, CardTitle, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import BarChartCo from '@/components/charts/barchart';
import { Bed, Users, DollarSign, ClipboardList } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface HotelMonthlyBooking {
    month: string;
    count: number;
}

interface HotelDashboardProps {
    hotelMonthlyBookings: HotelMonthlyBooking[];
    hotelTotalBookings: number;
    hotelTotalGuests: number;
}

export default function HotelDashboard({ hotelName }: { hotelName?: string }) {
    const { hotelMonthlyBookings, hotelTotalBookings, hotelTotalGuests } = usePage<HotelDashboardProps>().props;

    // Prepare bar chart data
    const monthlyBookingsData = hotelMonthlyBookings || [];
    const barKeys = [{ key: 'count', color: '#3b82f6', name: 'Bookings' }];

    // KPI Card Data
    const contentCard = [
        {
            title: 'Total Bookings',
            value: hotelTotalBookings || 0,
            logo: <ClipboardList className="text-blue-500" size={20} />,
            color: 'blue',
        },
        {
            title: 'Total Guests',
            value: hotelTotalGuests || 0,
            logo: <Users className="text-green-500" size={20} />,
            color: 'green',
        },
        {
            title: 'This Year',
            value: new Date().getFullYear(),
            logo: <Bed className="text-yellow-500" size={20} />,
            color: 'yellow',
        },
        {
            title: 'Active Status',
            value: 'Online',
            logo: <DollarSign className="text-purple-500" size={20} />,
            color: 'purple',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* KPI Cards */}
            <div className="my-4 mx-4">
                <Card className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-4">
                    <CardContent className="relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-30 -translate-y-16 translate-x-16"></div>

                        <div className="relative flex items-center gap-3 sm:gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                                </svg>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm sm:text-base md:text-lg text-gray-700">
                                    <span className="block sm:inline font-bold text-gray-800 ">Welcome back!</span>{' '}
                                    <span className="block sm:inline mt-1 sm:mt-0">
                                        Your hotel{' '}
                                        <span className="font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md break-words inline-block">
                                            {hotelName}
                                        </span>{' '}
                                        <span className="inline-flex items-center gap-1">
                                            is ready to manage
                                            <span className="text-yellow-500 animate-pulse">✨</span>
                                        </span>
                                    </span>
                                </div>

                                {/* Subtle tagline */}
                                <p className="text-xs sm:text-sm text-gray-500 opacity-75">
                                    Let's make today exceptional for your guests
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {contentCard.map((item, index) => (
                        <Card key={index} className="shadow-lg">
                            <CardContent>
                                <CardTitle className="text-slate-800 text-sm">
                                    <div className="flex flex-row items-center gap-2">
                                        <div
                                            className={`p-2 rounded-md border-1`}
                                        >
                                            {item.logo}
                                        </div>
                                        <span>{item.title}</span>
                                    </div>
                                </CardTitle>
                                <h1 className="text-center my-3 font-bold text-lg">
                                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                                </h1>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="p-4 grid grid-cols-1 gap-4">
                <BarChartCo
                    data={monthlyBookingsData}
                    barKeys={barKeys}
                    xKey="month"
                    height={340}
                    title='Monthly Room Bookings (Current Year)'
                />
            </div>
        </AppLayout>
    );
}
