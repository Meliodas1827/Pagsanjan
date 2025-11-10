import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

interface LandingArea {
    id: number;
    name: string;
    description: string | null;
    location: string | null;
    address: string | null;
    is_active: boolean;
    capacity: number | null;
    price: number | null;
}

interface PageProps {
    landingArea: LandingArea;
}

export default function Dashboard() {
    const { landingArea } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/landing-area-dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Landing Area Dashboard" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Welcome to Landing Area Management</h1>
                <p className="text-muted-foreground">
                    Manage customer boat ride requests for {landingArea?.name}
                </p>
            </div>

            <div className="mx-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Landing Area</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{landingArea?.name}</div>
                        <p className="text-xs text-muted-foreground">
                            {landingArea?.location || 'No location set'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Capacity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {landingArea?.capacity || 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Maximum people
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Additional Fee</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {landingArea?.price ? `₱${landingArea.price}` : 'Free'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Per booking
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mx-4 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>About {landingArea?.name}</CardTitle>
                        <CardDescription>
                            {landingArea?.description || 'No description available'}
                        </CardDescription>
                    </CardHeader>
                    {landingArea?.address && (
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                <strong>Address:</strong> {landingArea.address}
                            </p>
                        </CardContent>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
