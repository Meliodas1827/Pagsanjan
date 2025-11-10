import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash2, Plus, QrCode } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Restaurant Portal', href: '/restaurant-portal' }];

interface RestoTable {
    id: number;
    resto_id: number;
    status: 'reserved' | 'available';
    no_of_chairs: number;
    price: number | string;
    deleted: number;
}

interface Restaurant {
    id: number;
    resto_name: string;
    img: string | null;
    payment_qr: string | null;
    deleted: number;
    resto_tables?: RestoTable[];
}

export default function RestaurantPortal() {
    const { restaurant } = usePage().props as { restaurant: Restaurant };
    const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
    const [isAddTableOpen, setIsAddTableOpen] = useState(false);
    const [isEditTableOpen, setIsEditTableOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<RestoTable | null>(null);
    const managingTablesRef = useRef<boolean>(false);

    const qrForm = useForm({
        payment_qr: null as File | null,
    });

    const tableForm = useForm({
        no_of_chairs: '',
        price: '',
        status: 'available' as 'available' | 'reserved',
    });

    const editTableForm = useForm({
        no_of_chairs: '',
        price: '',
        status: 'available' as 'available' | 'reserved',
    });

    // Re-open add table dialog after page update
    useEffect(() => {
        if (managingTablesRef.current && !isAddTableOpen) {
            setIsAddTableOpen(true);
        }
    }, [restaurant, isAddTableOpen]);

    const handleUpdateQrCode = () => {
        qrForm.post(route('restaurant-portal.update-qrcode'), {
            forceFormData: true,
            onSuccess: () => {
                setIsQrDialogOpen(false);
                qrForm.reset();
                toast.success('Payment QR Code updated successfully!');
            },
            onError: (errors) => {
                console.error('QR upload errors:', errors);
                toast.error('Failed to upload QR Code');
            },
        });
    };

    const handleAddTable = () => {
        tableForm.post(route('restaurant-portal.store-table'), {
            preserveScroll: true,
            onSuccess: () => {
                tableForm.reset();
                tableForm.clearErrors();
                toast.success('Table added successfully!');
            },
            onError: (errors) => {
                console.error('Add table errors:', errors);
                toast.error('Failed to add table. Please check the form.');
            },
        });
    };

    const handleEditTable = (table: RestoTable) => {
        setSelectedTable(table);
        editTableForm.setData({
            no_of_chairs: table.no_of_chairs.toString(),
            price: table.price.toString(),
            status: table.status,
        });
        setIsEditTableOpen(true);
    };

    const handleUpdateTable = () => {
        if (selectedTable) {
            editTableForm.post(route('restaurant-portal.update-table', selectedTable.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditTableOpen(false);
                    setSelectedTable(null);
                    editTableForm.reset();
                    editTableForm.clearErrors();
                    toast.success('Table updated successfully!');
                },
                onError: (errors) => {
                    console.error('Update table errors:', errors);
                    toast.error('Failed to update table. Please check the form.');
                },
            });
        }
    };

    const handleDeleteTable = (table: RestoTable) => {
        if (confirm('Are you sure you want to delete this table?')) {
            router.delete(route('restaurant-portal.destroy-table', table.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Table deleted successfully!');
                },
                onError: (errors) => {
                    console.error('Delete table errors:', errors);
                    toast.error('Failed to delete table');
                },
            });
        }
    };

    const activeTables = restaurant.resto_tables?.filter(t => !t.deleted) || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Restaurant Portal" />

            <div className="mx-4 my-4 space-y-6">
                {/* Restaurant Info Card */}
                <Card className="shadow-lg">
                    <CardTitle className="p-4 text-lg font-semibold">My Restaurant</CardTitle>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{restaurant.resto_name}</h3>
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-semibold">Total Tables:</span> {activeTables.length}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Available Tables:</span>{' '}
                                        {activeTables.filter(t => t.status === 'available').length}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                                <div>
                                    {restaurant.payment_qr ? (
                                        <div className="text-center">
                                            <p className="text-sm font-semibold mb-2">Current Payment QR Code</p>
                                            <img
                                                src={restaurant.payment_qr}
                                                alt="Payment QR"
                                                className="h-32 w-32 rounded border object-contain mx-auto"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No QR code uploaded</p>
                                    )}
                                </div>
                                <Button onClick={() => setIsQrDialogOpen(true)} className="mt-4">
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Update Payment QR Code
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tables Management Card */}
                <Card className="shadow-lg">
                    <CardTitle className="p-4 flex items-center justify-between text-lg font-semibold">
                        <span>My Tables</span>
                        <Button onClick={() => {
                            managingTablesRef.current = true;
                            setIsAddTableOpen(true);
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Table
                        </Button>
                    </CardTitle>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Table ID</TableHead>
                                    <TableHead>No. of Chairs</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeTables.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                                            No tables found. Click "Add Table" to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activeTables.map((table) => (
                                        <TableRow key={table.id}>
                                            <TableCell>{table.id}</TableCell>
                                            <TableCell>{table.no_of_chairs}</TableCell>
                                            <TableCell>₱{Number(table.price).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                                                    table.status === 'available'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {table.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEditTable(table)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteTable(table)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Update QR Code Dialog */}
            <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Update Payment QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="payment_qr">Upload QR Code Image</Label>
                            <Input
                                id="payment_qr"
                                type="file"
                                accept="image/*"
                                onChange={(e) => qrForm.setData('payment_qr', e.target.files?.[0] || null)}
                            />
                            {qrForm.errors.payment_qr && <p className="text-sm text-red-500">{qrForm.errors.payment_qr}</p>}
                        </div>

                        {restaurant.payment_qr && (
                            <div className="mt-4">
                                <h3 className="mb-3 text-sm font-semibold">Current QR Code</h3>
                                <div className="flex justify-center">
                                    <img
                                        src={restaurant.payment_qr}
                                        alt="QR Code Payment"
                                        className="h-64 w-64 rounded border object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsQrDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateQrCode} disabled={qrForm.processing || !qrForm.data.payment_qr}>
                            {qrForm.processing ? 'Uploading...' : 'Upload'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Table Dialog */}
            <Dialog open={isAddTableOpen} onOpenChange={(open) => {
                setIsAddTableOpen(open);
                if (!open) {
                    managingTablesRef.current = false;
                }
            }}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Add New Table</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="no_of_chairs">Number of Chairs</Label>
                            <Input
                                id="no_of_chairs"
                                type="number"
                                min="1"
                                value={tableForm.data.no_of_chairs}
                                onChange={(e) => tableForm.setData('no_of_chairs', e.target.value)}
                            />
                            {tableForm.errors.no_of_chairs && <p className="text-sm text-red-500">{tableForm.errors.no_of_chairs}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={tableForm.data.price}
                                onChange={(e) => tableForm.setData('price', e.target.value)}
                            />
                            {tableForm.errors.price && <p className="text-sm text-red-500">{tableForm.errors.price}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={tableForm.data.status} onValueChange={(value) => tableForm.setData('status', value as 'available' | 'reserved')}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                </SelectContent>
                            </Select>
                            {tableForm.errors.status && <p className="text-sm text-red-500">{tableForm.errors.status}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsAddTableOpen(false);
                            managingTablesRef.current = false;
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddTable} disabled={tableForm.processing}>
                            {tableForm.processing ? 'Adding...' : 'Add Table'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Table Dialog */}
            <Dialog open={isEditTableOpen} onOpenChange={setIsEditTableOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Edit Table #{selectedTable?.id}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_no_of_chairs">Number of Chairs</Label>
                            <Input
                                id="edit_no_of_chairs"
                                type="number"
                                min="1"
                                value={editTableForm.data.no_of_chairs}
                                onChange={(e) => editTableForm.setData('no_of_chairs', e.target.value)}
                            />
                            {editTableForm.errors.no_of_chairs && <p className="text-sm text-red-500">{editTableForm.errors.no_of_chairs}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_price">Price</Label>
                            <Input
                                id="edit_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={editTableForm.data.price}
                                onChange={(e) => editTableForm.setData('price', e.target.value)}
                            />
                            {editTableForm.errors.price && <p className="text-sm text-red-500">{editTableForm.errors.price}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_status">Status</Label>
                            <Select value={editTableForm.data.status} onValueChange={(value) => editTableForm.setData('status', value as 'available' | 'reserved')}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                </SelectContent>
                            </Select>
                            {editTableForm.errors.status && <p className="text-sm text-red-500">{editTableForm.errors.status}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditTableOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateTable} disabled={editTableForm.processing}>
                            {editTableForm.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
