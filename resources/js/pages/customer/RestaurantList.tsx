import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Search, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import CustomerLayout from './layout/layout';

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

interface Props {
    restaurants: Restaurant[];
}

export default function RestaurantList({ restaurants }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRestaurants = restaurants.filter((restaurant) => restaurant.resto_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <CustomerLayout>
            <Head title="Restaurants" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Restaurants</h1>
                        <p className="text-muted-foreground">Browse and book tables at our partner restaurants</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search restaurants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                {/* Restaurant Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRestaurants.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            {searchTerm ? 'No restaurants found matching your search.' : 'No restaurants available at the moment.'}
                        </div>
                    ) : (
                        filteredRestaurants.map((restaurant) => {
                            const activeTables = restaurant.resto_tables?.filter((t) => !t.deleted) || [];
                            const availableTables = activeTables.filter((t) => t.status === 'available');
                            const totalCapacity = activeTables.reduce((sum, table) => sum + table.no_of_chairs, 0);

                            return (
                                <Card key={restaurant.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                    <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                                        {restaurant.img ? (
                                            <img src={restaurant.img} alt={restaurant.resto_name} className="h-full w-full object-cover" />
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
                                        </div>

                                        <div className="rounded-lg bg-green-50 p-3">
                                            <p className="text-sm font-medium text-green-800">
                                                {availableTables.length} {availableTables.length === 1 ? 'table' : 'tables'} available
                                            </p>
                                        </div>

                                        <Button asChild className="w-full">
                                            <Link href={`/restaurant/${restaurant.id}`}>View Details & Book</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
