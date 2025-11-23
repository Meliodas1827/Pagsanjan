import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link } from '@inertiajs/react';
import { Palmtree, Search } from 'lucide-react';
import { useState } from 'react';
import CustomerLayout from './layout/layout';

interface Resort {
    id: number;
    resort_name: string;
    img: string | null;
    payment_qr: string | null;
    deleted: number;
}

interface Props {
    resorts: Resort[];
    role?: number;
}

export default function ResortList({ resorts }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredResorts = resorts.filter((resort) => resort.resort_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <CustomerLayout>
            <Head title="Resorts" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Resorts</h1>
                        <p className="text-muted-foreground">Relax and unwind at our beautiful resort facilities</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search resorts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                {/* Resorts Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResorts.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            {searchTerm ? 'No resorts found matching your search.' : 'No resorts available at the moment.'}
                        </div>
                    ) : (
                        filteredResorts.map((resort) => (
                            <Card key={resort.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                                    {resort.img ? (
                                        <img src={resort.img} alt={resort.resort_name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200">
                                            <Palmtree className="h-16 w-16 text-teal-600" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palmtree className="h-5 w-5 text-teal-600" />
                                        {resort.resort_name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg bg-teal-50 p-3">
                                        <p className="text-sm font-medium text-teal-800">
                                            Pools, gardens, and recreational amenities available
                                        </p>
                                    </div>

                                    <Button asChild className="w-full">
                                        <Link href={`/resort/${resort.id}`}>View Details & Book</Link>
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
