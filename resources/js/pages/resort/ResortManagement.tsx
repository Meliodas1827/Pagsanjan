import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Edit, Search, Trash2, Power, QrCode } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Resorts', href: '/manage-resorts' }];

interface Resort {
    id: number;
    resort_name: string;
    img: string | null;
    payment_qr: string | null;
    deleted: number;
}

export default function ResortManagement() {
    const { resorts } = usePage().props as { resorts: Resort[] };
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        resort_name: '',
        img: null as File | null,
        payment_qr: null as File | null,
    });

    const editForm = useForm({
        resort_name: '',
        img: null as File | null,
        payment_qr: null as File | null,
    });

    const handleCreate = () => {
        createForm.post(route('manage-resort.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Resort created successfully!');
            },
            onError: () => {
                toast.error('Failed to create resort');
            },
        });
    };

    const handleEdit = (resort: Resort) => {
        setSelectedResort(resort);
        editForm.setData({
            resort_name: resort.resort_name,
            img: null,
            payment_qr: null,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (selectedResort) {
            editForm.post(route('manage-resort.update', selectedResort.id), {
                forceFormData: true,
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedResort(null);
                    editForm.reset();
                    toast.success('Resort updated successfully!');
                },
                onError: () => {
                    toast.error('Failed to update resort');
                },
            });
        }
    };

    const handleDelete = (resort: Resort) => {
        if (confirm('Are you sure you want to delete this resort?')) {
            router.delete(route('manage-resort.destroy', resort.id), {
                onSuccess: () => {
                    toast.success('Resort deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete resort');
                },
            });
        }
    };

    const handleToggleStatus = (resort: Resort) => {
        const action = resort.deleted ? 'enable' : 'disable';
        if (confirm(`Are you sure you want to ${action} this resort?`)) {
            router.post(route('manage-resort.toggle-status', resort.id), {}, {
                onSuccess: () => {
                    toast.success(`Resort ${action}d successfully!`);
                },
                onError: () => {
                    toast.error(`Failed to ${action} resort`);
                },
            });
        }
    };

    const filteredResorts = resorts.filter(
        (resort) =>
            resort.resort_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resort Management" />

            <div className="mx-4 my-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input placeholder="Search Resort" className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => setIsCreateOpen(true)}>Add Resort</Button>
                    </div>
                </div>
                <Card className="shadow-lg">
                    <CardTitle className="p-4 text-lg font-semibold">Resort Management</CardTitle>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Resort Name</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Payment QR</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredResorts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                                            No resorts found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredResorts.map((resort) => (
                                        <TableRow key={resort.id}>
                                            <TableCell>{resort.id}</TableCell>
                                            <TableCell>{resort.resort_name}</TableCell>
                                            <TableCell>
                                                {resort.img ? (
                                                    <img src={resort.img} alt={resort.resort_name} className="h-12 w-12 rounded object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No image</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {resort.payment_qr ? (
                                                    <img src={resort.payment_qr} alt="QR Code" className="h-12 w-12 rounded object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No QR</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {resort.deleted ? (
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
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(resort)}>
                                                    <Edit className="mr-1 h-4 w-4" /> Edit
                                                </Button>
                                                <Button
                                                    variant={resort.deleted ? "default" : "secondary"}
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(resort)}
                                                >
                                                    <Power className="mr-1 h-4 w-4" />
                                                    {resort.deleted ? 'Enable' : 'Disable'}
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(resort)}>
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

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Add New Resort</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="resort_name">Resort Name</Label>
                            <Input
                                id="resort_name"
                                value={createForm.data.resort_name}
                                onChange={(e) => createForm.setData('resort_name', e.target.value)}
                            />
                            {createForm.errors.resort_name && <p className="text-sm text-red-500">{createForm.errors.resort_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="img">Resort Image</Label>
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

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Edit Resort</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_resort_name">Resort Name</Label>
                            <Input
                                id="edit_resort_name"
                                value={editForm.data.resort_name}
                                onChange={(e) => editForm.setData('resort_name', e.target.value)}
                            />
                            {editForm.errors.resort_name && <p className="text-sm text-red-500">{editForm.errors.resort_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_img">Resort Image (optional)</Label>
                            <Input
                                id="edit_img"
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('img', e.target.files?.[0] || null)}
                            />
                            {selectedResort?.img && (
                                <div className="mt-2">
                                    <img src={selectedResort.img} alt="Current" className="h-20 w-20 rounded object-cover" />
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
                            {selectedResort?.payment_qr && (
                                <div className="mt-2">
                                    <img src={selectedResort.payment_qr} alt="Current QR" className="h-20 w-20 rounded object-cover" />
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
        </AppLayout>
    );
}
