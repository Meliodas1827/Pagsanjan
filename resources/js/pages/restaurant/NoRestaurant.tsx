import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Restaurant Portal', href: '/restaurant-portal' }];

export default function NoRestaurant() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="No Restaurant Found" />

            <div className="mx-4 my-4 flex items-center justify-center min-h-[60vh]">
                <Card className="shadow-lg max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <AlertCircle className="h-16 w-16 text-yellow-500" />
                            <CardTitle className="text-xl font-semibold">No Restaurant Found</CardTitle>
                            <p className="text-gray-600">
                                You don't have a restaurant associated with your account yet. Please contact the administrator to set up your restaurant.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
