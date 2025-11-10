import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search, UtensilsCrossed, MapPin, Users, CalendarCheck, Sailboat } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface RestoTable {
    id: number;
    resto_id: number;
    status: 'reserved' | 'available';
    no_of_chairs: number;
    price: number | string;
    deleted: number;
}

interface Restaurant {
    id: number;
    resto_name: string;
    img: string | null;
    payment_qr: string | null;
    deleted: number;
    resto_tables?: RestoTable[];
    available_tables_count?: number;
    total_capacity?: number;
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
}

interface Props {
    restaurants: Restaurant[];
    landingAreas: LandingArea[];
}

export default function CustomerDashboard() {
    const { restaurants, landingAreas } = usePage().props as Props;
    const [searchTerm, setSearchTerm] = useState('');
    const [landingSearchTerm, setLandingSearchTerm] = useState('');

    const filteredRestaurants = restaurants?.filter((restaurant) =>
        restaurant.resto_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const filteredLandingAreas = landingAreas?.filter((area) =>
        area.name.toLowerCase().includes(landingSearchTerm.toLowerCase())
    ) || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="mx-4 my-4 space-y-6">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
                    <p className="text-muted-foreground">Discover and book restaurants and boat rides to landing areas</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/my-bookings">View My Bookings</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Browse Hotels</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/hotel-list">Explore Hotels</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Restaurants</CardTitle>
                            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{restaurants?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">Available for booking</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Landing Areas</CardTitle>
                            <Sailboat className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{landingAreas?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">Boat ride destinations</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Restaurants Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Available Restaurants</CardTitle>
                        <p className="text-sm text-muted-foreground">Browse and book tables at our partner restaurants</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search restaurants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Restaurant Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredRestaurants.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-muted-foreground">
                                    {searchTerm ? 'No restaurants found matching your search.' : 'No restaurants available at the moment.'}
                                </div>
                            ) : (
                                filteredRestaurants.map((restaurant) => {
                                    const activeTables = restaurant.resto_tables?.filter(t => !t.deleted) || [];
                                    const availableTables = activeTables.filter(t => t.status === 'available');
                                    const totalCapacity = activeTables.reduce((sum, table) => sum + table.no_of_chairs, 0);

                                    return (
                                        <Card key={restaurant.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                            <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                                                {restaurant.img ? (
                                                    <img
                                                        src={restaurant.img}
                                                        alt={restaurant.resto_name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                                                        <UtensilsCrossed className="h-16 w-16 text-green-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <UtensilsCrossed className="h-5 w-5 text-green-600" />
                                                    {restaurant.resto_name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span>{activeTables.length} Tables</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>{totalCapacity} Seats</span>
                                                    </div>
                                                </div>

                                                <div className="rounded-lg bg-green-50 p-3">
                                                    <p className="text-sm font-medium text-green-800">
                                                        {availableTables.length} {availableTables.length === 1 ? 'table' : 'tables'} available
                                                    </p>
                                                </div>

                                                <Button asChild className="w-full">
                                                    <Link href={`/restaurant/${restaurant.id}`}>
                                                        View Details & Book
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>

                        {filteredRestaurants.length > 0 && (
                            <div className="pt-4 text-center">
                                <Button asChild variant="outline">
                                    <Link href="/restaurant-list">View All Restaurants</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Landing Areas Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Landing Areas</CardTitle>
                        <p className="text-sm text-muted-foreground">Book boat rides to popular landing areas</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search landing areas..."
                                value={landingSearchTerm}
                                onChange={(e) => setLandingSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Landing Areas Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredLandingAreas.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-muted-foreground">
                                    {landingSearchTerm ? 'No landing areas found matching your search.' : 'No landing areas available at the moment.'}
                                </div>
                            ) : (
                                filteredLandingAreas.map((landingArea) => (
                                    <Card key={landingArea.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                                            {landingArea.image ? (
                                                <img
                                                    src={`/storage/${landingArea.image}`}
                                                    alt={landingArea.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                                                    <Sailboat className="h-16 w-16 text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Sailboat className="h-5 w-5 text-blue-600" />
                                                {landingArea.name}
                                            </CardTitle>
                                            {landingArea.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {landingArea.description}
                                                </p>
                                            )}
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                {landingArea.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="truncate">{landingArea.location}</span>
                                                    </div>
                                                )}
                                                {landingArea.capacity && (
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>Capacity: {landingArea.capacity}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {landingArea.price && (
                                                <div className="rounded-lg bg-blue-50 p-3">
                                                    <p className="text-sm font-medium text-blue-800">
                                                        ₱{landingArea.price} per trip
                                                    </p>
                                                </div>
                                            )}

                                            <Button asChild className="w-full">
                                                <Link href={`/landing-area/${landingArea.id}/book`}>
                                                    Book Boat Ride
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
