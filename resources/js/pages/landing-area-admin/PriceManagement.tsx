import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface LandingArea {
    id: number;
    name: string;
    price: number | null;
    price_per_adult: number | null;
    price_per_child: number | null;
}

interface PageProps {
    landingArea: LandingArea;
}

export default function PriceManagement() {
    const { landingArea } = usePage<PageProps>().props;

    const form = useForm({
        price: landingArea.price?.toString() || '',
        price_per_adult: landingArea.price_per_adult?.toString() || '',
        price_per_child: landingArea.price_per_child?.toString() || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/landing-area-dashboard',
        },
        {
            title: 'Price Management',
            href: '/landing-area-price-management',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post('/landing-area-price-management', {
            onSuccess: () => {
                toast.success('Prices updated successfully');
            },
            onError: () => {
                toast.error('Failed to update prices');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Price Management" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Price Management</h1>
                    <p className="text-muted-foreground">Manage boat ride prices for {landingArea.name}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Ride Pricing
                        </CardTitle>
                        <CardDescription>Set prices for adult and child boat rides</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price_per_adult">Price per Adult (₱)</Label>
                                    <Input
                                        id="price_per_adult"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.price_per_adult}
                                        onChange={(e) => form.setData('price_per_adult', e.target.value)}
                                        placeholder="e.g., 200.00"
                                    />
                                    {form.errors.price_per_adult && (
                                        <p className="text-sm text-red-500">{form.errors.price_per_adult}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">Price charged per adult for boat rides</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price_per_child">Price per Child (₱)</Label>
                                    <Input
                                        id="price_per_child"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.price_per_child}
                                        onChange={(e) => form.setData('price_per_child', e.target.value)}
                                        placeholder="e.g., 150.00"
                                    />
                                    {form.errors.price_per_child && (
                                        <p className="text-sm text-red-500">{form.errors.price_per_child}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">Price charged per child for boat rides</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Legacy Price (₱)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.price}
                                        onChange={(e) => form.setData('price', e.target.value)}
                                        placeholder="e.g., 100.00"
                                    />
                                    {form.errors.price && <p className="text-sm text-red-500">{form.errors.price}</p>}
                                    <p className="text-sm text-muted-foreground">
                                        Legacy additional fee (optional, for backward compatibility)
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving...' : 'Save Prices'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Pricing Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-blue-800">
                        <p>• Adult price applies to visitors aged 13 and above</p>
                        <p>• Child price applies to visitors aged 12 and below</p>
                        <p>• Prices are displayed to customers when they view your landing area</p>
                        <p>• Leave fields empty if you don't want to display specific pricing</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
