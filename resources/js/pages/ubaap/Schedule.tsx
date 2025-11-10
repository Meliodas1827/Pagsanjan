import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarRange, Users, ChartNoAxesCombined, CalendarClock, Sailboat, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/ubaap-dashboard',
    },
];

interface Analytics {
    today_bookings: number;
    month_bookings: number;
    today_guests: number;
    month_guests: number;
    available_boats: number;
    total_boats: number;
    pending_assignments: number;
    bookings_by_status: Record<string, number>;
    daily_bookings: Array<{ date: string; count: number }>;
    most_active_boats: Array<{ boat_no: string; booking_count: number }>;
}

interface BookingData {
    id: number;
    boat_no: string;
    guest_name: string;
    date_of_booking: string;
    ride_time: string | null;
    no_of_adults: number;
    no_of_children: number;
    status: string;
}

interface PageProps {
    analytics: Analytics;
    upcomingRides: BookingData[];
    ridesHistory: BookingData[];
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

export default function UbaapSchedule() {
    const { analytics, upcomingRides, ridesHistory } = usePage<PageProps>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return 'Not set';
        const [hours, minutes] = timeString.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const period = hour24 >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${period}`;
    };

    // Prepare status data for pie chart
    const statusData = Object.entries(analytics.bookings_by_status || {}).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
        value: count
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="UBAAP Dashboard" />
            <div className='my-4 mx-4'>
                {/* Analytics Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    {/* Today's Bookings */}
                    <Card>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm text-gray-500'>Today's Bookings</p>
                                    <h3 className='text-3xl font-bold text-gray-900'>{analytics.today_bookings}</h3>
                                    <p className='text-xs text-gray-400 mt-1'>Month: {analytics.month_bookings}</p>
                                </div>
                                <div className='bg-blue-100 p-3 rounded-full'>
                                    <CalendarRange className='h-6 w-6 text-blue-600' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Guests */}
                    <Card>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm text-gray-500'>Today's Guests</p>
                                    <h3 className='text-3xl font-bold text-gray-900'>{analytics.today_guests}</h3>
                                    <p className='text-xs text-gray-400 mt-1'>Month: {analytics.month_guests}</p>
                                </div>
                                <div className='bg-green-100 p-3 rounded-full'>
                                    <Users className='h-6 w-6 text-green-600' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Available Boats */}
                    <Card>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm text-gray-500'>Available Boats</p>
                                    <h3 className='text-3xl font-bold text-gray-900'>{analytics.available_boats}</h3>
                                    <p className='text-xs text-gray-400 mt-1'>Total: {analytics.total_boats}</p>
                                </div>
                                <div className='bg-cyan-100 p-3 rounded-full'>
                                    <Sailboat className='h-6 w-6 text-cyan-600' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Assignments */}
                    <Card>
                        <CardContent className='p-6'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-sm text-gray-500'>Pending Assignments</p>
                                    <h3 className='text-3xl font-bold text-orange-600'>{analytics.pending_assignments}</h3>
                                    <p className='text-xs text-gray-400 mt-1'>Needs attention</p>
                                </div>
                                <div className='bg-orange-100 p-3 rounded-full'>
                                    <AlertCircle className='h-6 w-6 text-orange-600' />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6'>
                    {/* Daily Bookings Chart */}
                    <Card>
                        <CardContent className='p-6'>
                            <CardTitle className='mb-4'>Last 7 Days Bookings</CardTitle>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={analytics.daily_bookings}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Bookings by Status Chart */}
                    <Card>
                        <CardContent className='p-6'>
                            <CardTitle className='mb-4'>Bookings by Status (This Month)</CardTitle>
                            {statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className='flex items-center justify-center h-[250px] text-gray-400'>
                                    No booking data available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Most Active Boats */}
                <Card className='mb-6'>
                    <CardContent className='p-6'>
                        <CardTitle className='mb-4'>Most Active Boats (This Month)</CardTitle>
                        {analytics.most_active_boats.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={analytics.most_active_boats} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="boat_no" type="category" />
                                    <Tooltip />
                                    <Bar dataKey="booking_count" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className='text-center text-gray-400 py-8'>
                                No boat activity data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tables Row */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <Card>
                        <CardContent className='p-6'>
                            <CardTitle className='mb-4'>Upcoming Boat Rides</CardTitle>
                            <div className='overflow-auto max-h-96'>
                                <Table className='mt-2'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='text-xs'>Boat No.</TableHead>
                                            <TableHead className='text-xs'>Guest Name</TableHead>
                                            <TableHead className='text-xs'>Date</TableHead>
                                            <TableHead className='text-xs'>Time</TableHead>
                                            <TableHead className='text-xs'>Guests</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {upcomingRides.length > 0 ? (
                                            upcomingRides.map((ride) => (
                                                <TableRow key={ride.id}>
                                                    <TableCell className='text-xs font-semibold'>{ride.boat_no}</TableCell>
                                                    <TableCell className='text-xs'>{ride.guest_name}</TableCell>
                                                    <TableCell className='text-xs'>{formatDate(ride.date_of_booking)}</TableCell>
                                                    <TableCell className='text-xs'>{formatTime(ride.ride_time)}</TableCell>
                                                    <TableCell className='text-xs'>{ride.no_of_adults + ride.no_of_children}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className='text-center text-gray-400 py-8'>
                                                    No upcoming rides scheduled
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className='p-6'>
                            <CardTitle className='mb-4'>Boat Rides History</CardTitle>
                            <div className='overflow-auto max-h-96'>
                                <Table className='mt-2'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='text-xs'>Boat No.</TableHead>
                                            <TableHead className='text-xs'>Guest Name</TableHead>
                                            <TableHead className='text-xs'>Date</TableHead>
                                            <TableHead className='text-xs'>Time</TableHead>
                                            <TableHead className='text-xs'>Guests</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ridesHistory.length > 0 ? (
                                            ridesHistory.map((ride) => (
                                                <TableRow key={ride.id}>
                                                    <TableCell className='text-xs font-semibold'>{ride.boat_no}</TableCell>
                                                    <TableCell className='text-xs'>{ride.guest_name}</TableCell>
                                                    <TableCell className='text-xs'>{formatDate(ride.date_of_booking)}</TableCell>
                                                    <TableCell className='text-xs'>{formatTime(ride.ride_time)}</TableCell>
                                                    <TableCell className='text-xs'>{ride.no_of_adults + ride.no_of_children}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className='text-center text-gray-400 py-8'>
                                                    No history available
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
