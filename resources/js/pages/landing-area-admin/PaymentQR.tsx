import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { QrCode, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LandingArea {
    id: number;
    name: string;
    payment_qr: string | null;
}

interface PageProps {
    landingArea: LandingArea;
}

export default function PaymentQR() {
    const { landingArea } = usePage<PageProps>().props;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const uploadForm = useForm({
        payment_qr: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Payment QR',
            href: '/landing-area-payment-qr',
        },
    ];

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post(route('landing-area.payment-qr.upload'), {
            forceFormData: true,
            onSuccess: () => {
                uploadForm.reset();
                toast.success('Payment QR code uploaded successfully');
            },
            onError: () => {
                toast.error('Failed to upload payment QR code');
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('landing-area.payment-qr.delete'), {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                toast.success('Payment QR code deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete payment QR code');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment QR Code" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Payment QR Code</h1>
                <p className="text-muted-foreground">
                    Manage payment QR code for {landingArea?.name}
                </p>
            </div>

            <div className="mx-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            Payment QR Code
                        </CardTitle>
                        <CardDescription>
                            Customers will use this QR code to make payments for boat rides to {landingArea?.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center space-y-6 py-8">
                            {/* Display Current QR Code */}
                            {landingArea?.payment_qr ? (
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                                            <img
                                                src={`/storage/${landingArea.payment_qr}`}
                                                alt="Payment QR Code"
                                                className="h-64 w-64 object-contain"
                                            />
                                        </div>
                                        <p className="mt-4 text-sm text-muted-foreground">
                                            Current payment QR code
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="destructive"
                                            onClick={() => setDeleteDialogOpen(true)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete QR Code
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                    <div className="text-center">
                                        <QrCode className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500">
                                            No QR code uploaded yet
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Upload your payment QR code below
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Form */}
                            <div className="w-full max-w-md">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            {landingArea?.payment_qr ? 'Replace QR Code' : 'Upload QR Code'}
                                        </CardTitle>
                                        <CardDescription>
                                            Upload an image of your payment QR code (JPG, PNG)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleUpload} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="payment_qr">QR Code Image</Label>
                                                <Input
                                                    id="payment_qr"
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    onChange={(e) =>
                                                        uploadForm.setData('payment_qr', e.target.files?.[0] || null)
                                                    }
                                                    required
                                                />
                                                {uploadForm.errors.payment_qr && (
                                                    <p className="text-sm text-red-500">
                                                        {uploadForm.errors.payment_qr}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    Maximum file size: 4MB
                                                </p>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={uploadForm.processing || !uploadForm.data.payment_qr}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {uploadForm.processing
                                                    ? 'Uploading...'
                                                    : landingArea?.payment_qr
                                                    ? 'Replace QR Code'
                                                    : 'Upload QR Code'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your payment QR code. Customers won't be able to see
                            the payment QR code until you upload a new one.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
