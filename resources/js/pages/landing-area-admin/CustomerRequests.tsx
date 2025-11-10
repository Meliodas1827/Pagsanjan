import UpdateStatusDialog from '@/components/landing-area-admin/update-status-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Eye, Pencil } from 'lucide-react';
import { useState } from 'react';

interface LandingAreaRequest {
    id: number;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string;
    pickup_date: string;
    pickup_time: string;
    number_of_adults: number;
    number_of_children: number;
    total_amount: number | null;
    landing_area_fee: number | null;
    status: string;
    is_paid: boolean;
    payment_proof: string | null;
    special_requirements: string | null;
    boat: {
        boat_no: string;
    } | null;
    user: {
        name: string;
        email: string;
    } | null;
}

interface PageProps {
    requests: {
        data: LandingAreaRequest[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    landingArea: {
        name: string;
    };
}

export default function CustomerRequests() {
    const { requests, landingArea } = usePage<PageProps>().props;
    const [selectedRequest, setSelectedRequest] = useState<{ id: number; status: string } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewingProof, setViewingProof] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customer Requests',
            href: '/landing-area-requests',
        },
    ];

    const handleUpdateStatus = (id: number, status: string) => {
        setSelectedRequest({ id, status });
        setIsDialogOpen(true);
    };

    const handleViewProof = (proofPath: string) => {
        setViewingProof(proofPath);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'secondary';
            case 'confirmed':
                return 'default';
            case 'assigned':
                return 'default';
            case 'completed':
                return 'default';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Requests" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Customer Boat Ride Requests</h1>
                <p className="text-muted-foreground">Manage customer requests for {landingArea?.name}</p>
            </div>

            <div className="mx-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Requests</CardTitle>
                        <CardDescription>All boat ride requests to {landingArea?.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Pickup Date</TableHead>
                                    <TableHead>Pickup Time</TableHead>
                                    <TableHead>Boat</TableHead>
                                    <TableHead>Guests</TableHead>
                                    <TableHead>Proof of Payment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.data.length > 0 ? (
                                    requests.data.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{request.customer_name}</div>
                                                    <div className="text-sm text-muted-foreground">{request.customer_phone}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{format(new Date(request.pickup_date), 'MMM dd, yyyy')}</TableCell>
                                            <TableCell>{request.pickup_time}</TableCell>
                                            <TableCell>{request.boat?.boat_no || 'Not assigned'}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{request.number_of_adults} Adults</div>
                                                    <div className="text-muted-foreground">{request.number_of_children} Children</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {request.payment_proof ? (
                                                    <Button variant="outline" size="sm" onClick={() => handleViewProof(request.payment_proof!)}>
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        View Proof
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No proof uploaded</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(request.id, request.status)}>
                                                    <Pencil className="mr-1 h-4 w-4" />
                                                    Update
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center text-muted-foreground">
                                            No customer requests yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {selectedRequest && (
                <UpdateStatusDialog
                    requestId={selectedRequest.id}
                    currentStatus={selectedRequest.status}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}

            {/* Payment Proof Viewer Dialog */}
            <Dialog open={!!viewingProof} onOpenChange={() => setViewingProof(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Payment Proof</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                        {viewingProof && <img src={`/storage/${viewingProof}`} alt="Payment Proof" className="max-h-[70vh] rounded-lg border" />}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
