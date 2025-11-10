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
import { Edit, Search, Trash2, Power, Plus, UtensilsCrossed } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Restaurants', href: '/manage-restaurants' }];

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

export default function RestaurantManagement() {
    const { restaurants } = usePage().props as { restaurants: Restaurant[] };
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
    const [isEditTableOpen, setIsEditTableOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [selectedTable, setSelectedTable] = useState<RestoTable | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const managingRestaurantIdRef = useRef<number | null>(null);

    // Re-open table dialog after page update
    useEffect(() => {
        if (managingRestaurantIdRef.current && !isTableDialogOpen) {
            const restaurant = restaurants.find(r => r.id === managingRestaurantIdRef.current);
            if (restaurant && selectedRestaurant?.id === managingRestaurantIdRef.current) {
                setSelectedRestaurant(restaurant);
                setIsTableDialogOpen(true);
            }
        }
    }, [restaurants, isTableDialogOpen, selectedRestaurant]);

    const createForm = useForm({
        resto_name: '',
        img: null as File | null,
        payment_qr: null as File | null,
    });

    const editForm = useForm({
        resto_name: '',
        img: null as File | null,
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

    const handleCreate = () => {
        createForm.post(route('manage-restaurant.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Restaurant created successfully!');
            },
            onError: () => {
                toast.error('Failed to create restaurant');
            },
        });
    };

    const handleEdit = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        editForm.setData({
            resto_name: restaurant.resto_name,
            img: null,
            payment_qr: null,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (selectedRestaurant) {
            editForm.post(route('manage-restaurant.update', selectedRestaurant.id), {
                forceFormData: true,
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedRestaurant(null);
                    editForm.reset();
                    toast.success('Restaurant updated successfully!');
                },
                onError: () => {
                    toast.error('Failed to update restaurant');
                },
            });
        }
    };

    const handleDelete = (restaurant: Restaurant) => {
        if (confirm('Are you sure you want to delete this restaurant?')) {
            router.delete(route('manage-restaurant.destroy', restaurant.id), {
                onSuccess: () => {
                    toast.success('Restaurant deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete restaurant');
                },
            });
        }
    };

    const handleToggleStatus = (restaurant: Restaurant) => {
        const action = restaurant.deleted ? 'enable' : 'disable';
        if (confirm(`Are you sure you want to ${action} this restaurant?`)) {
            router.post(route('manage-restaurant.toggle-status', restaurant.id), {}, {
                onSuccess: () => {
                    toast.success(`Restaurant ${action}d successfully!`);
                },
                onError: () => {
                    toast.error(`Failed to ${action} restaurant`);
                },
            });
        }
    };

    const handleManageTables = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        managingRestaurantIdRef.current = restaurant.id;
        tableForm.reset();
        tableForm.clearErrors();
        setIsTableDialogOpen(true);
    };

    const handleAddTable = () => {
        if (selectedRestaurant) {
            tableForm.post(route('manage-restaurant.store-table', selectedRestaurant.id), {
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
        }
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
            editTableForm.post(route('manage-restaurant.update-table', selectedTable.id), {
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
            router.delete(route('manage-restaurant.destroy-table', table.id), {
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

    const filteredRestaurants = restaurants.filter(
        (restaurant) =>
            restaurant.resto_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Restaurant Management" />

            <div className="mx-4 my-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input placeholder="Search Restaurant" className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => setIsCreateOpen(true)}>Add Restaurant</Button>
                    </div>
                </div>
                <Card className="shadow-lg">
                    <CardTitle className="p-4 text-lg font-semibold">Restaurant Management</CardTitle>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Restaurant Name</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Payment QR</TableHead>
                                    <TableHead>Tables</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRestaurants.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-4 text-center text-gray-500">
                                            No restaurants found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRestaurants.map((restaurant) => (
                                        <TableRow key={restaurant.id}>
                                            <TableCell>{restaurant.id}</TableCell>
                                            <TableCell>{restaurant.resto_name}</TableCell>
                                            <TableCell>
                                                {restaurant.img ? (
                                                    <img src={restaurant.img} alt={restaurant.resto_name} className="h-12 w-12 rounded object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No image</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {restaurant.payment_qr ? (
                                                    <img src={restaurant.payment_qr} alt="QR Code" className="h-12 w-12 rounded object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No QR</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium">
                                                    {restaurant.resto_tables?.filter(t => !t.deleted).length || 0} tables
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {restaurant.deleted ? (
                                                    <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                                        Deleted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleManageTables(restaurant)}>
                                                    <UtensilsCrossed className="mr-1 h-4 w-4" /> Tables
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(restaurant)}>
                                                    <Edit className="mr-1 h-4 w-4" /> Edit
                                                </Button>
                                                <Button
                                                    variant={restaurant.deleted ? "default" : "secondary"}
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(restaurant)}
                                                >
                                                    <Power className="mr-1 h-4 w-4" />
                                                    {restaurant.deleted ? 'Enable' : 'Disable'}
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(restaurant)}>
                                                    <Trash2 className="mr-1 h-4 w-4" /> Delete
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

            {/* Create Restaurant Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Add New Restaurant</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="resto_name">Restaurant Name</Label>
                            <Input
                                id="resto_name"
                                value={createForm.data.resto_name}
                                onChange={(e) => createForm.setData('resto_name', e.target.value)}
                            />
                            {createForm.errors.resto_name && <p className="text-sm text-red-500">{createForm.errors.resto_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="img">Restaurant Image</Label>
                            <Input
                                id="img"
                                type="file"
                                accept="image/*"
                                onChange={(e) => createForm.setData('img', e.target.files?.[0] || null)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="payment_qr">Payment QR Code</Label>
                            <Input
                                id="payment_qr"
                                type="file"
                                accept="image/*"
                                onChange={(e) => createForm.setData('payment_qr', e.target.files?.[0] || null)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={createForm.processing}>
                            {createForm.processing ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Restaurant Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Edit Restaurant</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_resto_name">Restaurant Name</Label>
                            <Input
                                id="edit_resto_name"
                                value={editForm.data.resto_name}
                                onChange={(e) => editForm.setData('resto_name', e.target.value)}
                            />
                            {editForm.errors.resto_name && <p className="text-sm text-red-500">{editForm.errors.resto_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_img">Restaurant Image (optional)</Label>
                            <Input
                                id="edit_img"
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('img', e.target.files?.[0] || null)}
                            />
                            {selectedRestaurant?.img && (
                                <div className="mt-2">
                                    <img src={selectedRestaurant.img} alt="Current" className="h-20 w-20 rounded object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_payment_qr">Payment QR Code (optional)</Label>
                            <Input
                                id="edit_payment_qr"
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('payment_qr', e.target.files?.[0] || null)}
                            />
                            {selectedRestaurant?.payment_qr && (
                                <div className="mt-2">
                                    <img src={selectedRestaurant.payment_qr} alt="Current QR" className="h-20 w-20 rounded object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={editForm.processing}>
                            {editForm.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manage Tables Dialog */}
            <Dialog open={isTableDialogOpen} onOpenChange={(open) => {
                setIsTableDialogOpen(open);
                if (!open) {
                    managingRestaurantIdRef.current = null;
                }
            }}>
                <DialogContent className="max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Manage Tables - {selectedRestaurant?.resto_name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Add Table Form */}
                        <Card>
                            <CardContent className="pt-4">
                                <h3 className="mb-3 text-sm font-semibold">Add New Table</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="no_of_chairs">Chairs</Label>
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
                                    <div className="flex items-end">
                                        <Button onClick={handleAddTable} disabled={tableForm.processing} className="w-full">
                                            <Plus className="mr-1 h-4 w-4" />
                                            {tableForm.processing ? 'Adding...' : 'Add Table'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tables List */}
                        <div className="mt-4">
                            <h3 className="mb-3 text-sm font-semibold">Current Tables</h3>
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
                                    {selectedRestaurant && selectedRestaurant.resto_tables && selectedRestaurant.resto_tables.filter(t => !t.deleted).length > 0 ? (
                                        selectedRestaurant.resto_tables.filter(t => !t.deleted).map((table) => (
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
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-4 text-center text-gray-500">
                                                No tables found. Add a table to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsTableDialogOpen(false);
                            managingRestaurantIdRef.current = null;
                        }}>
                            Close
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
