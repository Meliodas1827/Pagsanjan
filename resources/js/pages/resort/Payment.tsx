import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment', href: '/resort-payment' },
];

export default function Payment() {
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
                    <CardTitle className="p-4 text-lg font-semibold">Recent Payments</CardTitle>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{payment.date}</TableCell>
                                        <TableCell>{payment.name}</TableCell>
                                        <TableCell>{payment.amount}</TableCell>
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
