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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Boat {
    id: number;
    boat_no: string;
    bankero_name: string | null;
    capacity: number;
    available_slot: number;
    price_per_adult: number;
    price_per_child: number;
    status: 'onride' | 'booked' | 'available';
    image: string | null;
}

interface PageProps {
    boats: Boat[];
}

export default function ManageBoats() {
    const { boats } = usePage<PageProps>().props;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [boatToDelete, setBoatToDelete] = useState<Boat | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [boatToEdit, setBoatToEdit] = useState<Boat | null>(null);

    const addForm = useForm({
        boat_no: '',
        bankero_name: '',
        capacity: 1,
        available_slot: 0,
        price_per_adult: 0,
        price_per_child: 0,
        status: 'available' as 'onride' | 'booked' | 'available',
        image: null as File | null,
    });

    const editForm = useForm({
        boat_no: '',
        bankero_name: '',
        capacity: 1,
        available_slot: 0,
        price_per_adult: 0,
        price_per_child: 0,
        status: 'available' as 'onride' | 'booked' | 'available',
        image: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Boats',
            href: '/manage-boats',
        },
    ];

    const handleAdd = () => {
        addForm.post(route('manage-boats.store'), {
            forceFormData: true,
            onSuccess: () => {
                setAddDialogOpen(false);
                addForm.reset();
                toast.success('Boat created successfully');
            },
            onError: () => {
                toast.error('Failed to create boat');
            },
        });
    };

    const handleEdit = () => {
        if (boatToEdit) {
            editForm.post(route('manage-boats.update', boatToEdit.id), {
                forceFormData: true,
                onSuccess: () => {
                    setEditDialogOpen(false);
                    setBoatToEdit(null);
                    editForm.reset();
                    toast.success('Boat updated successfully');
                },
                onError: () => {
                    toast.error('Failed to update boat');
                },
            });
        }
    };

    const handleDelete = () => {
        if (boatToDelete) {
            router.delete(route('manage-boats.destroy', boatToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setBoatToDelete(null);
                    toast.success('Boat deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete boat');
                },
            });
        }
    };

    const openDeleteDialog = (boat: Boat) => {
        setBoatToDelete(boat);
        setDeleteDialogOpen(true);
    };

    const openEditDialog = (boat: Boat) => {
        setBoatToEdit(boat);
        editForm.setData({
            boat_no: boat.boat_no,
            bankero_name: boat.bankero_name || '',
            capacity: boat.capacity,
            available_slot: boat.available_slot,
            price_per_adult: boat.price_per_adult,
            price_per_child: boat.price_per_child,
            status: boat.status,
            image: null,
        });
        setEditDialogOpen(true);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'available':
                return 'default';
            case 'booked':
                return 'secondary';
            case 'onride':
                return 'destructive';
            default:
                return 'default';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Boats" />
            <div className="mx-4 my-4 flex flex-row items-center justify-between gap-2">
                <h1 className="text-2xl font-semibold">Manage Boats</h1>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Boat
                </Button>
            </div>

            <div className="mx-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Boat No</TableHead>
                            <TableHead>Bankero Name</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Available Slot</TableHead>
                            <TableHead>Price (Adult)</TableHead>
                            <TableHead>Price (Child)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {boats.map((boat) => (
                            <TableRow key={boat.id}>
                                <TableCell>
                                    {boat.image ? (
                                        <img
                                            src={`/storage/${boat.image}`}
                                            alt={boat.boat_no}
                                            className="h-16 w-16 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>{boat.boat_no}</TableCell>
                                <TableCell>{boat.bankero_name || 'N/A'}</TableCell>
                                <TableCell>{boat.capacity}</TableCell>
                                <TableCell>{boat.available_slot}</TableCell>
                                <TableCell>₱{boat.price_per_adult}</TableCell>
                                <TableCell>₱{boat.price_per_child}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(boat.status)}>
                                        {boat.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(boat)}
                                                    >
                                                        <SquarePen className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDeleteDialog(boat)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Delete</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Add New Boat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="add-boat-no">Boat No *</Label>
                            <Input
                                id="add-boat-no"
                                value={addForm.data.boat_no}
                                onChange={(e) => addForm.setData('boat_no', e.target.value)}
                            />
                            {addForm.errors.boat_no && (
                                <p className="text-sm text-red-500">{addForm.errors.boat_no}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="add-bankero-name">Bankero Name</Label>
                            <Input
                                id="add-bankero-name"
                                value={addForm.data.bankero_name}
                                onChange={(e) => addForm.setData('bankero_name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="add-capacity">Capacity *</Label>
                            <Input
                                id="add-capacity"
                                type="number"
                                min="1"
                                value={addForm.data.capacity}
                                onChange={(e) => addForm.setData('capacity', parseInt(e.target.value))}
                            />
                            {addForm.errors.capacity && (
                                <p className="text-sm text-red-500">{addForm.errors.capacity}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="add-available-slot">Available Slot *</Label>
                            <Input
                                id="add-available-slot"
                                type="number"
                                min="0"
                                value={addForm.data.available_slot}
                                onChange={(e) => addForm.setData('available_slot', parseInt(e.target.value))}
                            />
                            {addForm.errors.available_slot && (
                                <p className="text-sm text-red-500">{addForm.errors.available_slot}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="add-price-adult">Price per Adult *</Label>
                            <Input
                                id="add-price-adult"
                                type="number"
                                min="0"
                                step="0.01"
                                value={addForm.data.price_per_adult}
                                onChange={(e) => addForm.setData('price_per_adult', parseFloat(e.target.value))}
                            />
                            {addForm.errors.price_per_adult && (
                                <p className="text-sm text-red-500">{addForm.errors.price_per_adult}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="add-price-child">Price per Child *</Label>
                            <Input
                                id="add-price-child"
                                type="number"
                                min="0"
                                step="0.01"
                                value={addForm.data.price_per_child}
                                onChange={(e) => addForm.setData('price_per_child', parseFloat(e.target.value))}
                            />
                            {addForm.errors.price_per_child && (
                                <p className="text-sm text-red-500">{addForm.errors.price_per_child}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="add-status">Status *</Label>
                            <Select
                                value={addForm.data.status}
                                onValueChange={(value) =>
                                    addForm.setData('status', value as 'onride' | 'booked' | 'available')
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="booked">Booked</SelectItem>
                                    <SelectItem value="onride">On Ride</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="add-image">Image</Label>
                            <Input
                                id="add-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => addForm.setData('image', e.target.files?.[0] || null)}
                            />
                            {addForm.errors.image && (
                                <p className="text-sm text-red-500">{addForm.errors.image}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAdd} disabled={addForm.processing}>
                                {addForm.processing ? 'Adding...' : 'Add Boat'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Edit Boat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-boat-no">Boat No *</Label>
                            <Input
                                id="edit-boat-no"
                                value={editForm.data.boat_no}
                                onChange={(e) => editForm.setData('boat_no', e.target.value)}
                            />
                            {editForm.errors.boat_no && (
                                <p className="text-sm text-red-500">{editForm.errors.boat_no}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="edit-bankero-name">Bankero Name</Label>
                            <Input
                                id="edit-bankero-name"
                                value={editForm.data.bankero_name}
                                onChange={(e) => editForm.setData('bankero_name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-capacity">Capacity *</Label>
                            <Input
                                id="edit-capacity"
                                type="number"
                                min="1"
                                value={editForm.data.capacity}
                                onChange={(e) => editForm.setData('capacity', parseInt(e.target.value))}
                            />
                            {editForm.errors.capacity && (
                                <p className="text-sm text-red-500">{editForm.errors.capacity}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="edit-available-slot">Available Slot *</Label>
                            <Input
                                id="edit-available-slot"
                                type="number"
                                min="0"
                                value={editForm.data.available_slot}
                                onChange={(e) => editForm.setData('available_slot', parseInt(e.target.value))}
                            />
                            {editForm.errors.available_slot && (
                                <p className="text-sm text-red-500">{editForm.errors.available_slot}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="edit-price-adult">Price per Adult *</Label>
                            <Input
                                id="edit-price-adult"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editForm.data.price_per_adult}
                                onChange={(e) => editForm.setData('price_per_adult', parseFloat(e.target.value))}
                            />
                            {editForm.errors.price_per_adult && (
                                <p className="text-sm text-red-500">{editForm.errors.price_per_adult}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="edit-price-child">Price per Child *</Label>
                            <Input
                                id="edit-price-child"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editForm.data.price_per_child}
                                onChange={(e) => editForm.setData('price_per_child', parseFloat(e.target.value))}
                            />
                            {editForm.errors.price_per_child && (
                                <p className="text-sm text-red-500">{editForm.errors.price_per_child}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="edit-status">Status *</Label>
                            <Select
                                value={editForm.data.status}
                                onValueChange={(value) =>
                                    editForm.setData('status', value as 'onride' | 'booked' | 'available')
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="booked">Booked</SelectItem>
                                    <SelectItem value="onride">On Ride</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-image">Image</Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('image', e.target.files?.[0] || null)}
                            />
                            {editForm.errors.image && (
                                <p className="text-sm text-red-500">{editForm.errors.image}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEdit} disabled={editForm.processing}>
                                {editForm.processing ? 'Updating...' : 'Update Boat'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the boat "{boatToDelete?.boat_no}". This action cannot be
                            undone.
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
