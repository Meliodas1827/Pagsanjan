import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { QrCode, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
    resort: {
        id: number;
        resort_name: string;
        payment_qr: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Payment QR Code', href: '/resort-payment-qr' }];

export default function ResortPaymentQR() {
    const { resort } = usePage<PageProps>().props;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(resort.payment_qr);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast.error('Please select a QR code image');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('payment_qr', selectedFile);

        router.post(route('resort.update-qrcode', { resort: resort.id }), formData, {
            onSuccess: () => {
                toast.success('QR code updated successfully');
                setSelectedFile(null);
            },
            onError: () => {
                toast.error('Failed to update QR code');
            },
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment QR Code" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Payment QR Code</h1>
                <p className="text-muted-foreground">Manage your resort's payment QR code</p>
            </div>

            <div className="mx-4 grid gap-6 md:grid-cols-2">
                {/* Current QR Code */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            Current QR Code
                        </CardTitle>
                        <CardDescription>Customers will scan this code to make payments</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        {previewUrl ? (
                            <div className="rounded-lg border p-4">
                                <img src={previewUrl} alt="Payment QR Code" className="h-64 w-64 object-contain" />
                            </div>
                        ) : (
                            <div className="flex h-64 w-64 items-center justify-center rounded-lg border border-dashed">
                                <div className="text-center">
                                    <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">No QR code uploaded</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upload New QR Code */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload New QR Code
                        </CardTitle>
                        <CardDescription>Upload a new QR code image for payments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="qr-upload">QR Code Image</Label>
                            <Input id="qr-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                            <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF (Max 2MB)</p>
                        </div>

                        {selectedFile && (
                            <div className="rounded-lg border bg-muted/50 p-3">
                                <p className="text-sm">
                                    <span className="font-medium">Selected file:</span> {selectedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        )}

                        <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full">
                            {uploading ? 'Uploading...' : 'Upload QR Code'}
                        </Button>

                        <div className="rounded-lg border bg-blue-50 p-4">
                            <h4 className="mb-2 font-medium text-blue-900">Tips for QR Code:</h4>
                            <ul className="space-y-1 text-sm text-blue-800">
                                <li>• Ensure the QR code is clear and scannable</li>
                                <li>• Use high resolution images for best results</li>
                                <li>• Test the QR code before uploading</li>
                                <li>• Include payment details in your QR code</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
