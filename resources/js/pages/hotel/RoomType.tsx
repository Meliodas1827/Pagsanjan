import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit2, Plus, Ban, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Room Types', href: '/hotel-room-type' },
];

interface RoomType {
    id: number;
    room_type: string;
    is_active: boolean;
    created_at: string;
}

export default function RoomType() {
    const { props } = usePage<{ roomTypes?: RoomType[] }>();
    const roomTypes: RoomType[] = props.roomTypes || [];

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        room_type: '',
    });

    const submitCreate: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post(route('hotel.room-type.store'), {
            onSuccess: () => {
                toast.success('Room type created successfully');
                setCreateOpen(false);
                reset();
            },
            onError: () => {
                toast.error('Failed to create room type');
            },
        });
    };

    const openEdit = (roomType: RoomType) => {
        setEditingRoomType(roomType);
        setData({
            room_type: roomType.room_type,
        });
        setEditOpen(true);
    };

    const submitEdit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!editingRoomType) return;
        post(route('hotel.room-type.update', editingRoomType.id), {
            onSuccess: () => {
                toast.success('Room type updated successfully');
                setEditOpen(false);
                setEditingRoomType(null);
                reset();
            },
            onError: () => {
                toast.error('Failed to update room type');
            },
        });
    };

    const toggleRoomTypeStatus = (roomType: RoomType) => {
        const action = roomType.is_active ? 'deactivate' : 'activate';
        if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} room type "${roomType.room_type}"?`)) return;
        router.delete(route('hotel.room-type.destroy', roomType.id), {
            onSuccess: () => toast.success(`Room type ${action}d successfully`),
            onError: () => toast.error(`Failed to ${action} room type`),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Room Type Management" />

            <div className="mx-4 my-2">
                <div className="mb-4 flex items-center justify-between">
                    <Button variant={'ghost'} onClick={() => window.history.back()}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button onClick={() => setCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus size={16} className="mr-2" />
                        Add Room Type
                    </Button>
                </div>

                {/* Room Type Table */}
                <div className="min-h-[71vh] overflow-auto rounded-xl p-6 shadow-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roomTypes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-4 text-center text-gray-500">
                                        No room types found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roomTypes.map((roomType) => (
                                    <TableRow key={roomType.id}>
                                        <TableCell className="font-medium">{roomType.room_type}</TableCell>
                                        <TableCell>
                                            {roomType.is_active ? (
                                                <Badge variant="default" className="bg-green-600">Active</Badge>
                                            ) : (
                                                <Badge variant="destructive">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{new Date(roomType.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Button
                                                onClick={() => openEdit(roomType)}
                                                className="cursor-pointer bg-yellow-500 hover:bg-yellow-600"
                                                size="sm"
                                                disabled={!roomType.is_active}
                                            >
                                                <Edit2 size={14} className="mr-1" />
                                                Edit
                                            </Button>
                                            {roomType.is_active ? (
                                                <Button onClick={() => toggleRoomTypeStatus(roomType)} variant="destructive" size="sm">
                                                    <Ban size={14} className="mr-1" />
                                                    Deactivate
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => toggleRoomTypeStatus(roomType)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                    size="sm"
                                                >
                                                    <CheckCircle size={14} className="mr-1" />
                                                    Activate
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Room Type</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="room_type">Room Type Name *</Label>
                                <Input
                                    id="room_type"
                                    value={data.room_type}
                                    onChange={(e) => setData('room_type', e.target.value)}
                                    placeholder="e.g., Deluxe, Suite, Standard"
                                    autoFocus
                                />
                                {errors.room_type && <p className="text-sm text-red-500">{errors.room_type}</p>}
                                <p className="text-xs text-gray-500">Enter a unique room type name. This will be used to categorize rooms.</p>
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                {processing ? 'Creating...' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={editOpen}
                onOpenChange={(o) => {
                    setEditOpen(o);
                    if (!o) setEditingRoomType(null);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Room Type</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_room_type">Room Type Name *</Label>
                                <Input
                                    id="edit_room_type"
                                    value={data.room_type}
                                    onChange={(e) => setData('room_type', e.target.value)}
                                    autoFocus
                                />
                                {errors.room_type && <p className="text-sm text-red-500">{errors.room_type}</p>}
                                <p className="text-xs text-gray-500">Enter a unique room type name.</p>
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditOpen(false);
                                    setEditingRoomType(null);
                                }}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
