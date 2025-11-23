import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link } from '@inertiajs/react';
import { Anchor, MapPin, Search, Users } from 'lucide-react';
import { useState } from 'react';
import CustomerLayout from './layout/layout';

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
}

interface Props {
    landingAreas: LandingArea[];
    role?: number;
}

export default function LandingAreaList({ landingAreas }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLandingAreas = landingAreas.filter((area) => area.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <CustomerLayout>
            <Head title="Landing Areas" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Landing Areas</h1>
                        <p className="text-muted-foreground">Discover scenic boat ride destinations and explore natural beauty</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search landing areas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                {/* Landing Areas Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredLandingAreas.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            {searchTerm ? 'No landing areas found matching your search.' : 'No landing areas available at the moment.'}
                        </div>
                    ) : (
                        filteredLandingAreas.map((area) => (
                            <Card key={area.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                                    {area.image ? (
                                        <img src={area.image} alt={area.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                                            <Anchor className="h-16 w-16 text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Anchor className="h-5 w-5 text-blue-600" />
                                        {area.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {area.description && (
                                        <p className="line-clamp-2 text-sm text-muted-foreground">{area.description}</p>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {area.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate">{area.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>Capacity: {area.capacity}</span>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 p-3">
                                        <p className="text-sm font-medium text-blue-800">
                                            ₱{typeof area.price === 'number' ? area.price.toFixed(2) : area.price} per person
                                        </p>
                                    </div>

                                    <Button asChild className="w-full">
                                        <Link href={`/landing-area/${area.id}/book`}>View Details & Book</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
