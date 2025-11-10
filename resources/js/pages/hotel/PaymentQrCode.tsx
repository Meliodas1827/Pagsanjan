import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { QrCode, Upload } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Payment QR Code', href: '/payment-qrcode' }];

interface Hotel {
    id: number;
    hotel_name: string;
    qrcode_image_payment: string | null;
}

interface PageProps {
    hotel: Hotel;
}

export default function PaymentQrCode() {
    const { hotel } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        qrcode_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hotel.payment-qrcode.update'), {
            forceFormData: true,
            onSuccess: () => {
                setData('qrcode_image', null);
                toast.success('Payment QR Code updated successfully!');
                // Reset file input
                const fileInput = document.getElementById('qrcode_image') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            },
            onError: (errors) => {
                const errorMsg = errors.qrcode_image || errors.error || 'Failed to upload QR Code';
                toast.error(errorMsg);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment QR Code" />

            <div className="mx-4 my-4">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-6 w-6" />
                            Payment QR Code - {hotel.hotel_name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Upload Section */}
                            <div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="qrcode_image">Upload QR Code Image</Label>
                                        <Input
                                            id="qrcode_image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                setData('qrcode_image', e.target.files?.[0] || null);
                                            }}
                                        />
                                        {errors.qrcode_image && <p className="text-sm text-red-500">{errors.qrcode_image}</p>}
                                        <p className="text-sm text-gray-500">
                                            Upload a QR code image for customers to scan and pay for their bookings.
                                        </p>
                                    </div>

                                    <Button type="submit" disabled={processing || !data.qrcode_image} className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        {processing ? 'Uploading...' : 'Upload QR Code'}
                                    </Button>
                                </form>
                            </div>

                            {/* Current QR Code Preview */}
                            <div>
                                <Label className="mb-2 block">Current QR Code</Label>
                                {hotel.qrcode_image_payment ? (
                                    <div className="flex justify-center rounded-lg border bg-gray-50 p-4">
                                        <img
                                            src={hotel.qrcode_image_payment}
                                            alt="Payment QR Code"
                                            className="h-80 w-80 rounded border object-contain shadow-md"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-80 items-center justify-center rounded-lg border-2 border-dashed bg-gray-50">
                                        <div className="text-center">
                                            <QrCode className="mx-auto h-16 w-16 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">No QR Code uploaded yet</p>
                                            <p className="text-xs text-gray-400">Upload a QR code to get started</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
