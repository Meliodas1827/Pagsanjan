import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Ellipsis, Loader2, Search } from 'lucide-react';
import useSWR from 'swr';
import AcceptBtnDialog from './component/accept-btn-dialog';
import DeclineBtn from './component/declined-button';
import ViewDetailsDialog from './component/view-details-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reservation',
        href: '/reservation',
    },
];

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    console.log(res.data);
    return res.data;
};

export default function Reservation() {
    const { data: reservations, mutate, isLoading, error } = useSWR('api/reservation', fetcher);

    // Handle error state
    if (error) {
        console.error('Error loading reservations:', error);
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Manage Reservations" />
                <div className="flex h-64 items-center justify-center">
                    <p className="text-red-500">Error loading reservations. Please try again.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Reservations" />

            {/* Search + Filters */}
            <div className="mx-4 my-4 flex flex-row items-center justify-between gap-2">
                <div className="relative max-w-md flex-1">
                    <div className="flex gap-2">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input placeholder="Search" className="pl-10" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mx-3 overflow-auto rounded-xl p-4 shadow-lg" style={{ minHeight: '71vh', maxHeight: '71vh' }}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center text-sm">Hotel</TableHead>
                            <TableHead className="text-center text-sm">Reference #</TableHead>
                            <TableHead className="text-center text-sm">Schedule</TableHead>
                            <TableHead className="text-center text-sm">No. of Guest</TableHead>
                            <TableHead className="text-center text-sm">Reserver</TableHead>
                            <TableHead className="text-center text-sm">Price</TableHead>
                            <TableHead className="text-center text-sm">Booking Status</TableHead>
                            <TableHead className="text-center text-sm"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="py-8 text-center text-sm">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading reservations...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : !reservations || reservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="py-8 text-center text-sm">
                                    No reservations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reservations.map((reservation: any) => (
                                <TableRow key={reservation.id}>
                                    <TableCell className="text-center text-sm">{reservation.hotel_name || '-'}</TableCell>
                                    <TableCell className="text-center text-sm">{reservation.reference_id || '-'}</TableCell>
                                    <TableCell className="text-center text-sm">
                                        {reservation.check_in_date ? new Date(reservation.check_in_date).toLocaleDateString() : '-'} to{' '}
                                        {reservation.check_out_date ? new Date(reservation.check_out_date).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {(reservation.no_of_adults ?? 0) + (reservation.no_of_children ?? 0)}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">{reservation.guest_name || '-'}</TableCell>
                                    <TableCell className="text-center text-sm">
                                        {reservation.total_price ? `₱ ${parseFloat(reservation.total_price).toLocaleString()}` : '-'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm capitalize">
                                        {reservation.booking_status?.toLowerCase() || '-'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="p-1">
                                                    <Ellipsis className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="mr-5">
                                                {reservation.booking_status?.toLowerCase() === 'pending' ? (
                                                    <>
                                                        <DropdownMenuItem className="text-xs" onSelect={(e) => e.preventDefault()}>
                                                            <AcceptBtnDialog id={reservation.id} />
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-xs" onSelect={(e) => e.preventDefault()}>
                                                            <DeclineBtn id={reservation.id} />
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-xs" onSelect={(e) => e.preventDefault()}>
                                                            <ViewDetailsDialog booking={reservation} />
                                                        </DropdownMenuItem>
                                                    </>
                                                ) : reservation.booking_status?.toLowerCase() === 'declined' ||
                                                  reservation.booking_status?.toLowerCase() === 'cancelled' ? (
                                                    <DropdownMenuItem className="text-xs">Remove item</DropdownMenuItem>
                                                ) : (
                                                    <>
                                                        <DropdownMenuItem className="text-xs" onSelect={(e) => e.preventDefault()}>
                                                            <ViewDetailsDialog booking={reservation} />
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-xs">Mark as Done</DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
