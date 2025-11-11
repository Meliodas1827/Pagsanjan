import BarChartCo from '@/components/charts/barchart';
import LineChartCo from '@/components/charts/linechart';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { ReservationTable } from '@/pages/admin/component/RecentReservation';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CalendarClock, CalendarRange, ChartNoAxesCombined, Users } from 'lucide-react';

interface BoatReservationStat {
    month: string;
    count: number;
}

interface RoomReservationStat {
    hotel_name: string;
    count: number;
}

interface ResortReservationStat {
    resort_name: string;
    count: number;
}

interface RestaurantReservationStat {
    restaurant_name: string;
    count: number;
}

interface LandingAreaReservationStat {
    landing_area_name: string;
    count: number;
}

interface TouristArrivalStat {
    month: string;
    value: number;
}

interface RecentReservation {
    id: number;
    guest_name: string;
    hotel_name: string;
    check_in: string;
    guests: number;
    status: string;
    created_at: string;
}

interface DashboardProps {
    boatReservationStats: BoatReservationStat[];
    roomReservationStats: RoomReservationStat[];
    resortReservationStats: ResortReservationStat[];
    restaurantReservationStats: RestaurantReservationStat[];
    landingAreaReservationStats: LandingAreaReservationStat[];
    adminTotalReservations: number;
    adminTotalRevenue: number;
    adminTodayReservations: number;
    adminTodayCheckIns: number;
    touristArrivalTrend: TouristArrivalStat[];
    recentReservations: RecentReservation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const lineChartKeys = [{ key: 'value', color: '#8884d8' }];

export default function AdminDashboard() {
    const {
        boatReservationStats,
        roomReservationStats,
        resortReservationStats,
        restaurantReservationStats,
        landingAreaReservationStats,
        adminTotalReservations,
        adminTotalRevenue,
        adminTodayReservations,
        adminTodayCheckIns,
        touristArrivalTrend,
        recentReservations
    } = usePage<DashboardProps>().props;

    // Prepare bar chart data for boat reservations
    const boatChartData = boatReservationStats || [];
    const boatBarKeys = [{ key: 'count', color: '#0284c7', name: 'Reservations' }];

    // Prepare bar chart data for room reservations
    const roomChartData = roomReservationStats || [];
    const roomBarKeys = [{ key: 'count', color: '#10b981', name: 'Reservations' }];

    // Prepare bar chart data for resort reservations
    const resortChartData = resortReservationStats || [];
    const resortBarKeys = [{ key: 'count', color: '#f59e0b', name: 'Reservations' }];

    // Prepare bar chart data for restaurant reservations
    const restaurantChartData = restaurantReservationStats || [];
    const restaurantBarKeys = [{ key: 'count', color: '#8b5cf6', name: 'Reservations' }];

    // Prepare bar chart data for landing area reservations
    const landingAreaChartData = landingAreaReservationStats || [];
    const landingAreaBarKeys = [{ key: 'count', color: '#ec4899', name: 'Reservations' }];

    // KPI Cards with real data
    const contentCard = [
        {
            title: 'Total Reservation',
            value: adminTotalReservations || 0,
            logo: <CalendarRange />,
            color: 'red'
        },
        {
            title: 'Revenue',
            value: adminTotalRevenue || 0,
            logo: <ChartNoAxesCombined />,
            color: 'green',
            isRevenue: true
        },
        {
            title: `Today's Reservation`,
            value: adminTodayReservations || 0,
            logo: <CalendarClock />,
            color: 'yellow'
        },
        {
            title: 'Tourist Check in',
            value: adminTodayCheckIns || 0,
            logo: <Users />,
            color: 'blue'
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {contentCard.map((item, index) => (
                        <Card key={index}>
                            <CardContent>
                                <CardTitle className="text-sm text-slate-800">
                                    <div className="flex flex-row items-center gap-2">
                                        <div className={`rounded-md border-1 p-2`}>{item.logo}</div>

                                        <span>{item.title}</span>
                                    </div>
                                </CardTitle>
                                <h1 className="my-3 text-center font-bold">
                                    {item.isRevenue ? `₱${item.value.toLocaleString()}` : item.value.toLocaleString()}
                                </h1>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* Line Chart - Takes 3 columns for more width */}
                    <div className="lg:col-span-3">
                        <LineChartCo data={touristArrivalTrend || []} lineKeys={lineChartKeys} xKey="month" height={340} title="Tourist Arrival Trend" />
                    </div>

                    {/* Right Column - Takes 2 columns */}
                    <div className="space-y-3 lg:col-span-2">
                        {/* Recent Reservations */}
                        <Card>
                            <CardContent className="p-4">
                                <CardTitle>Recent Reservations</CardTitle>

                                <ReservationTable data={recentReservations || []} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Charts Section - Boat and Room Reservations */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Boat Reservations Chart */}
                    <BarChartCo
                        data={boatChartData}
                        barKeys={boatBarKeys}
                        xKey="month"
                        height={340}
                        title="Boat Reservations by Month (Current Year)"
                    />

                    {/* Room Reservations by Hotel Chart */}
                    <BarChartCo
                        data={roomChartData}
                        barKeys={roomBarKeys}
                        xKey="hotel_name"
                        height={340}
                        title="Room Reservations by Hotel (Current Year)"
                    />
                </div>

                {/* Charts Section - Resort, Restaurant, and Landing Area Reservations */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Resort Reservations Chart */}
                    <BarChartCo
                        data={resortChartData}
                        barKeys={resortBarKeys}
                        xKey="resort_name"
                        height={340}
                        title="Resort Reservations (Current Year)"
                    />

                    {/* Restaurant Reservations Chart */}
                    <BarChartCo
                        data={restaurantChartData}
                        barKeys={restaurantBarKeys}
                        xKey="restaurant_name"
                        height={340}
                        title="Restaurant Reservations (Current Year)"
                    />

                    {/* Landing Area Reservations Chart */}
                    <BarChartCo
                        data={landingAreaChartData}
                        barKeys={landingAreaBarKeys}
                        xKey="landing_area_name"
                        height={340}
                        title="Landing Area Requests (Current Year)"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
