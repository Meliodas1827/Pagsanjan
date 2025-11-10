import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { DollarSign, Edit, Save, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EntranceFee {
    id: number;
    category: string;
    description: string;
    amount: number;
}

interface PageProps {
    entrance_fees: EntranceFee[];
    resort: {
        id: number;
        resort_name: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Entrance Fee', href: '/resort-entrance-fee' }];

export default function ResortEntranceFee() {
    const { entrance_fees, resort } = usePage<PageProps>().props;
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editAmount, setEditAmount] = useState<string>('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const handleEdit = (fee: EntranceFee) => {
        setEditingId(fee.id);
        setEditAmount(fee.amount.toString());
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditAmount('');
    };

    const handleSave = (feeId: number) => {
        const amount = parseFloat(editAmount);
        if (isNaN(amount) || amount < 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        router.put(
            route('resort.entrance-fee.update', { fee: feeId }),
            { amount },
            {
                onSuccess: () => {
                    toast.success('Entrance fee updated successfully');
                    setEditingId(null);
                    setEditAmount('');
                },
                onError: () => {
                    toast.error('Failed to update entrance fee');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entrance Fee" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Entrance Fee Management</h1>
                <p className="text-muted-foreground">Manage entrance fees for {resort.resort_name}</p>
            </div>

            <div className="mx-4 grid gap-6">
                {/* Fee Structure Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Fee Structure
                        </CardTitle>
                        <CardDescription>Set entrance fees for different categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entrance_fees.length > 0 ? (
                                    entrance_fees.map((fee) => (
                                        <TableRow key={fee.id}>
                                            <TableCell className="font-medium">{fee.category}</TableCell>
                                            <TableCell className="text-muted-foreground">{fee.description}</TableCell>
                                            <TableCell>
                                                {editingId === fee.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">₱</span>
                                                        <Input
                                                            type="number"
                                                            value={editAmount}
                                                            onChange={(e) => setEditAmount(e.target.value)}
                                                            className="w-32"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-lg font-semibold">{formatCurrency(fee.amount)}</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editingId === fee.id ? (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleSave(fee.id)}>
                                                            <Save className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={handleCancel}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button size="sm" variant="outline" onClick={() => handleEdit(fee)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No entrance fees configured
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Information Card */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Fee Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-blue-800">
                        <p>
                            <strong>Note:</strong> These fees are displayed to customers during the booking process.
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                            <li>Adult fees typically apply to guests 13 years and older</li>
                            <li>Child fees apply to guests 3-12 years old</li>
                            <li>Senior and PWD fees require valid ID presentation</li>
                            <li>Changes take effect immediately for new bookings</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
