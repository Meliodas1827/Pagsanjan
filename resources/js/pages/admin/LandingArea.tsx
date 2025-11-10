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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { MapPin, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LandingArea {
    id: number;
    name: string;
    description: string | null;
    location: string | null;
    address: string | null;
    is_active: boolean;
    capacity: number | null;
    image: string | null;
    price: number | null;
}

interface PageProps {
    landingAreas: LandingArea[];
}

export default function LandingArea() {
    const { landingAreas } = usePage<PageProps>().props;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [areaToDelete, setAreaToDelete] = useState<LandingArea | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [areaToEdit, setAreaToEdit] = useState<LandingArea | null>(null);

    const addForm = useForm({
        name: '',
        description: '',
        location: '',
        address: '',
        is_active: true,
        capacity: '',
        price: '',
        image: null as File | null,
    });

    const editForm = useForm({
        name: '',
        description: '',
        location: '',
        address: '',
        is_active: true,
        capacity: '',
        price: '',
        image: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Landing Areas',
            href: '/manage-landing-areas',
        },
    ];

    const handleAdd = () => {
        addForm.post(route('manage-landing-area.store'), {
            forceFormData: true,
            onSuccess: () => {
                setAddDialogOpen(false);
                addForm.reset();
                toast.success('Landing area created successfully');
            },
            onError: () => {
                toast.error('Failed to create landing area');
            },
        });
    };

    const handleEdit = () => {
        if (areaToEdit) {
            editForm.post(route('manage-landing-area.update', areaToEdit.id), {
                forceFormData: true,
                onSuccess: () => {
                    setEditDialogOpen(false);
                    setAreaToEdit(null);
                    editForm.reset();
                    toast.success('Landing area updated successfully');
                },
                onError: () => {
                    toast.error('Failed to update landing area');
                },
            });
        }
    };

    const handleDelete = () => {
        if (areaToDelete) {
            router.delete(route('manage-landing-area.destroy', areaToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setAreaToDelete(null);
                    toast.success('Landing area deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete landing area');
                },
            });
        }
    };

    const openDeleteDialog = (area: LandingArea) => {
        setAreaToDelete(area);
        setDeleteDialogOpen(true);
    };

    const openEditDialog = (area: LandingArea) => {
        setAreaToEdit(area);
        editForm.setData({
            name: area.name,
            description: area.description || '',
            location: area.location || '',
            address: area.address || '',
            is_active: area.is_active,
            capacity: area.capacity?.toString() || '',
            price: area.price?.toString() || '',
            image: null,
        });
        setEditDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Landing Areas" />
            <div className="mx-4 my-4 flex flex-row items-center justify-between gap-2">
                <h1 className="text-2xl font-semibold">Manage Landing Areas</h1>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Landing Area
                </Button>
            </div>

            <div className="mx-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {landingAreas.map((area) => (
                            <TableRow key={area.id}>
                                <TableCell>
                                    {area.image ? (
                                        <img
                                            src={`/storage/${area.image}`}
                                            alt={area.name}
                                            className="h-16 w-16 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-gray-400">
                                            <MapPin className="h-8 w-8" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{area.name}</div>
                                        {area.description && (
                                            <div className="text-sm text-muted-foreground">
                                                {area.description.length > 50
                                                    ? `${area.description.substring(0, 50)}...`
                                                    : area.description}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {area.location && <div>{area.location}</div>}
                                        {area.address && (
                                            <div className="text-muted-foreground">{area.address}</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{area.capacity || 'N/A'}</TableCell>
                                <TableCell>{area.price ? `₱${area.price}` : 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={area.is_active ? 'default' : 'secondary'}>
                                        {area.is_active ? 'Active' : 'Inactive'}
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
                                                        onClick={() => openEditDialog(area)}
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
                                                        onClick={() => openDeleteDialog(area)}
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
                <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Landing Area</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="add-name">Name *</Label>
                            <Input
                                id="add-name"
                                value={addForm.data.name}
                                onChange={(e) => addForm.setData('name', e.target.value)}
                                placeholder="e.g., Pagsanjan Falls"
                            />
                            {addForm.errors.name && (
                                <p className="text-sm text-red-500">{addForm.errors.name}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="add-description">Description</Label>
                            <Textarea
                                id="add-description"
                                value={addForm.data.description}
                                onChange={(e) => addForm.setData('description', e.target.value)}
                                placeholder="Brief description of the landing area"
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label htmlFor="add-location">Location</Label>
                            <Input
                                id="add-location"
                                value={addForm.data.location}
                                onChange={(e) => addForm.setData('location', e.target.value)}
                                placeholder="e.g., Barangay Pinagsanjan"
                            />
                        </div>
                        <div>
                            <Label htmlFor="add-address">Address</Label>
                            <Input
                                id="add-address"
                                value={addForm.data.address}
                                onChange={(e) => addForm.setData('address', e.target.value)}
                                placeholder="Full address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="add-capacity">Capacity (Max People)</Label>
                            <Input
                                id="add-capacity"
                                type="number"
                                min="1"
                                value={addForm.data.capacity}
                                onChange={(e) => addForm.setData('capacity', e.target.value)}
                                placeholder="e.g., 50"
                            />
                        </div>
                        <div>
                            <Label htmlFor="add-price">Additional Price</Label>
                            <Input
                                id="add-price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={addForm.data.price}
                                onChange={(e) => addForm.setData('price', e.target.value)}
                                placeholder="e.g., 100.00"
                            />
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
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="add-is-active"
                                checked={addForm.data.is_active}
                                onChange={(e) => addForm.setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="add-is-active" className="cursor-pointer">
                                Active
                            </Label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAdd} disabled={addForm.processing}>
                                {addForm.processing ? 'Adding...' : 'Add Landing Area'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Landing Area</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name *</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                            />
                            {editForm.errors.name && (
                                <p className="text-sm text-red-500">{editForm.errors.name}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-location">Location</Label>
                            <Input
                                id="edit-location"
                                value={editForm.data.location}
                                onChange={(e) => editForm.setData('location', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-address">Address</Label>
                            <Input
                                id="edit-address"
                                value={editForm.data.address}
                                onChange={(e) => editForm.setData('address', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-capacity">Capacity (Max People)</Label>
                            <Input
                                id="edit-capacity"
                                type="number"
                                min="1"
                                value={editForm.data.capacity}
                                onChange={(e) => editForm.setData('capacity', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-price">Additional Price</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editForm.data.price}
                                onChange={(e) => editForm.setData('price', e.target.value)}
                            />
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
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit-is-active"
                                checked={editForm.data.is_active}
                                onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="edit-is-active" className="cursor-pointer">
                                Active
                            </Label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEdit} disabled={editForm.processing}>
                                {editForm.processing ? 'Updating...' : 'Update Landing Area'}
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
                            This will permanently delete the landing area "{areaToDelete?.name}". This action cannot be
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
