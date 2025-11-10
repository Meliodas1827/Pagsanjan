import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Booking Information', href: '/resort-booking-information' },
];

export default function BookingInfo() {
    // Dummy payment data
    const payments = [
        { date: '2025-08-12 10:30 AM', name: 'John Doe', amount: 'P120.00', method: 'Credit Card' },
        { date: '2025-08-12 01:45 PM', name: 'Jane Smith', amount: 'P85.50', method: 'Cash' },
        { date: '2025-08-11 04:15 PM', name: 'Michael Johnson', amount: 'P200.00', method: 'Bank Transfer' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="my-4 mx-4">
                <Card className="shadow-lg">
                    <CardContent>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Confirmation No.</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Arrival Time</TableHead>
                                    <TableHead>Schedule Date</TableHead>
                                    <TableHead>Status</TableHead>
            
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{payment.date}</TableCell>
                                        <TableCell>{payment.name}</TableCell>
                                        <TableCell>{payment.amount}</TableCell>
                                        <TableCell>{payment.method}</TableCell>
                                        <TableCell>{payment.method}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
