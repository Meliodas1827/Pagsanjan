import AssignBoatDialog from '@/components/ubaap/assign-boat-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Eye, Sailboat } from 'lucide-react';
import { useState } from 'react';

interface Boat {
    id: number;
    boat_no: string;
    bankero_name: string;
    capacity: number;
    status: string;
}

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
    admin_notes: string | null;
    boat: {
        boat_no: string;
        bankero_name: string;
    } | null;
    landing_area: {
        name: string;
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
    boats: Boat[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Landing Area Requests', href: '/ubaap-landing-area-requests' },
];

export default function LandingAreaRequests() {
    const { requests, boats } = usePage<PageProps>().props;
    const [selectedRequestForBoat, setSelectedRequestForBoat] = useState<{ id: number; boatId?: number } | null>(null);
    const [isBoatDialogOpen, setIsBoatDialogOpen] = useState(false);
    const [viewingProof, setViewingProof] = useState<string | null>(null);

    const handleAssignBoat = (id: number, boatId?: number) => {
        setSelectedRequestForBoat({ id, boatId });
        setIsBoatDialogOpen(true);
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
            <Head title="Landing Area Requests" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Landing Area Boat Ride Requests</h1>
                <p className="text-muted-foreground">Assign boats to confirmed landing area requests</p>
            </div>

            <div className="mx-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Confirmed Requests</CardTitle>
                        <CardDescription>All confirmed and assigned boat ride requests from landing areas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Landing Area</TableHead>
                                    <TableHead>Pickup Date</TableHead>
                                    <TableHead>Pickup Time</TableHead>
                                    <TableHead>Guests</TableHead>
                                    <TableHead>Assigned Boat</TableHead>
                                    <TableHead>Payment Proof</TableHead>
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
                                            <TableCell>
                                                <div className="font-medium">{request.landing_area?.name || 'N/A'}</div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(request.pickup_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell>{request.pickup_time}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{request.number_of_adults} Adults</div>
                                                    <div className="text-muted-foreground">{request.number_of_children} Children</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {request.boat ? (
                                                    <div>
                                                        <div className="font-medium">{request.boat.boat_no}</div>
                                                        <div className="text-sm text-muted-foreground">{request.boat.bankero_name}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Not assigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {request.payment_proof ? (
                                                    <Button variant="outline" size="sm" onClick={() => handleViewProof(request.payment_proof!)}>
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        View
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No proof</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAssignBoat(request.id, request.boat?.boat_no ? undefined : undefined)}
                                                >
                                                    <Sailboat className="mr-1 h-4 w-4" />
                                                    {request.boat ? 'Reassign' : 'Assign'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                                            No confirmed requests yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Assign Boat Dialog */}
            {selectedRequestForBoat && (
                <AssignBoatDialog
                    requestId={selectedRequestForBoat.id}
                    boats={boats}
                    currentBoatId={selectedRequestForBoat.boatId}
                    open={isBoatDialogOpen}
                    onOpenChange={setIsBoatDialogOpen}
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
