import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Edit, Images, Search, Trash2, X, Power, QrCode } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Hotels', href: '/manage-hotels' }];

interface HotelImage {
    id: number;
    hotelid: number;
    image_url: string;
}

interface Hotel {
    id: number;
    hotel_name: string;
    location: string;
    description: string;
    image_url: string;
    qrcode_image_payment: string | null;
    hotel_images: HotelImage[];
    isdeleted: number;
}

export default function HotelManagement() {
    const { hotels } = usePage().props as { hotels: Hotel[] };
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        hotel_name: '',
        location: '',
        description: '',
        image: null as File | null,
    });

    const editForm = useForm({
        hotel_name: '',
        location: '',
        description: '',
        image: null as File | null,
    });

    const galleryForm = useForm({
        images: [] as File[],
    });

    const qrCodeForm = useForm({
        qrcode_image: null as File | null,
    });

    const handleCreate = () => {
        createForm.post(route('manage-hotel.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Hotel created successfully!');
            },
            onError: () => {
                toast.error('Failed to create hotel');
            },
        });
    };

    const handleEdit = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        editForm.setData({
            hotel_name: hotel.hotel_name,
            location: hotel.location,
            description: hotel.description || '',
            image: null,
        });
        setIsEditOpen(true);
    };

    const handleManageGallery = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setIsGalleryOpen(true);
    };

    const handleManageQrCode = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setIsQrCodeOpen(true);
    };

    const handleUploadQrCode = () => {
        if (selectedHotel) {
            qrCodeForm.post(route('manage-hotel.update-qrcode', selectedHotel.id), {
                forceFormData: true,
                onSuccess: (page) => {
                    qrCodeForm.reset();
                    // Update selectedHotel with fresh data
                    const updatedHotel = (page.props.hotels as Hotel[]).find(h => h.id === selectedHotel.id);
                    if (updatedHotel) {
                        setSelectedHotel(updatedHotel);
                    }
                    toast.success('QR Code updated successfully!');
                },
                onError: (errors) => {
                    const errorMsg = errors.qrcode_image || 'Failed to upload QR Code';
                    toast.error(errorMsg);
                },
            });
        }
    };

    const handleUploadImages = () => {
        if (selectedHotel) {
            galleryForm.post(route('manage-hotel.store-images', selectedHotel.id), {
                forceFormData: true,
                onSuccess: (page) => {
                    galleryForm.reset();
                    // Update selectedHotel with fresh data from the server
                    const updatedHotel = (page.props.hotels as Hotel[]).find(h => h.id === selectedHotel.id);
                    if (updatedHotel) {
                        setSelectedHotel(updatedHotel);
                    }
                    toast.success('Images uploaded successfully!');
                },
                onError: (errors) => {
                    console.log('Upload errors:', errors);
                    const errorMsg = errors.images?.[0] || errors.error || 'Failed to upload images';
                    toast.error(errorMsg);
                },
            });
        }
    };

    const handleDeleteImage = (imageId: number) => {
        if (selectedHotel && confirm('Are you sure you want to delete this image?')) {
            router.delete(route('manage-hotel.delete-image', selectedHotel.id), {
                data: { image_id: imageId },
                onSuccess: (page) => {
                    // Update selectedHotel with fresh data from the server
                    const updatedHotel = (page.props.hotels as Hotel[]).find(h => h.id === selectedHotel.id);
                    if (updatedHotel) {
                        setSelectedHotel(updatedHotel);
                    }
                    toast.success('Image deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete image');
                },
            });
        }
    };

    const handleUpdate = () => {
        if (selectedHotel) {
            editForm.post(route('manage-hotel.update', selectedHotel.id), {
                forceFormData: true,
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedHotel(null);
                    editForm.reset();
                    toast.success('Hotel updated successfully!');
                },
                onError: () => {
                    toast.error('Failed to update hotel');
                },
            });
        }
    };

    const handleDelete = (hotel: Hotel) => {
        if (confirm('Are you sure you want to delete this hotel?')) {
            router.delete(route('manage-hotel.destroy', hotel.id), {
                onSuccess: () => {
                    toast.success('Hotel deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete hotel');
                },
            });
        }
    };

    const handleToggleStatus = (hotel: Hotel) => {
        const action = hotel.isdeleted ? 'enable' : 'disable';
        if (confirm(`Are you sure you want to ${action} this hotel?`)) {
            router.post(route('manage-hotel.toggle-status', hotel.id), {}, {
                onSuccess: () => {
                    toast.success(`Hotel ${action}d successfully!`);
                },
                onError: () => {
                    toast.error(`Failed to ${action} hotel`);
                },
            });
        }
    };

    const filteredHotels = hotels.filter(
        (hotel) =>
            hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) || hotel.location.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hotel Management" />

            <div className="mx-4 my-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input placeholder="Search Hotel" className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => setIsCreateOpen(true)}>Add Hotels</Button>
                    </div>
                </div>
                <Card className="shadow-lg">
                    <CardTitle className="p-4 text-lg font-semibold">Hotel Management</CardTitle>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>HotelID</TableHead>
                                    <TableHead>Hotel</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHotels.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                                            No hotels found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredHotels.map((hotel) => (
                                        <TableRow key={hotel.id}>
                                            <TableCell>{hotel.id}</TableCell>
                                            <TableCell>{hotel.hotel_name}</TableCell>
                                            <TableCell>{hotel.location}</TableCell>
                                            <TableCell>{hotel.description}</TableCell>
                                            <TableCell>
                                                {hotel.isdeleted ? (
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
                                                <Button variant="outline" size="sm" onClick={() => handleManageGallery(hotel)}>
                                                    <Images className="mr-1 h-4 w-4" /> Gallery
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleManageQrCode(hotel)}>
                                                    <QrCode className="mr-1 h-4 w-4" /> QR Code
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(hotel)}>
                                                    <Edit className="mr-1 h-4 w-4" /> Edit
                                                </Button>
                                                <Button
                                                    variant={hotel.isdeleted ? "default" : "secondary"}
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(hotel)}
                                                >
                                                    <Power className="mr-1 h-4 w-4" />
                                                    {hotel.isdeleted ? 'Enable' : 'Disable'}
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(hotel)}>
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
                        <DialogTitle>Add New Hotel</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="hotel_name">Hotel Name</Label>
                            <Input
                                id="hotel_name"
                                value={createForm.data.hotel_name}
                                onChange={(e) => createForm.setData('hotel_name', e.target.value)}
                            />
                            {createForm.errors.hotel_name && <p className="text-sm text-red-500">{createForm.errors.hotel_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" value={createForm.data.location} onChange={(e) => createForm.setData('location', e.target.value)} />
                            {createForm.errors.location && <p className="text-sm text-red-500">{createForm.errors.location}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Main Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => createForm.setData('image', e.target.files?.[0] || null)}
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
                        <DialogTitle>Edit Hotel</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_hotel_name">Hotel Name</Label>
                            <Input
                                id="edit_hotel_name"
                                value={editForm.data.hotel_name}
                                onChange={(e) => editForm.setData('hotel_name', e.target.value)}
                            />
                            {editForm.errors.hotel_name && <p className="text-sm text-red-500">{editForm.errors.hotel_name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_location">Location</Label>
                            <Input id="edit_location" value={editForm.data.location} onChange={(e) => editForm.setData('location', e.target.value)} />
                            {editForm.errors.location && <p className="text-sm text-red-500">{editForm.errors.location}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">Description</Label>
                            <Textarea
                                id="edit_description"
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_image">Main Image (optional)</Label>
                            <Input
                                id="edit_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('image', e.target.files?.[0] || null)}
                            />
                            {selectedHotel?.image_url && (
                                <div className="mt-2">
                                    <img src={selectedHotel.image_url} alt="Current" className="h-20 w-20 rounded object-cover" />
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

            {/* Gallery Management Dialog */}
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Manage Gallery - {selectedHotel?.hotel_name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="gallery_images">Upload Multiple Images</Label>
                            <Input
                                id="gallery_images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    galleryForm.setData('images', files);
                                }}
                            />
                            <Button
                                onClick={handleUploadImages}
                                disabled={galleryForm.processing || galleryForm.data.images.length === 0}
                                className="mt-2"
                            >
                                {galleryForm.processing ? 'Uploading...' : 'Upload Images'}
                            </Button>
                        </div>

                        <div className="mt-4">
                            <h3 className="mb-3 text-sm font-semibold">Current Gallery Images</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {selectedHotel && selectedHotel.hotel_images && selectedHotel.hotel_images.length > 0 ? (
                                    selectedHotel.hotel_images.map((image, index) => (
                                        <div key={image.id} className="group relative">
                                            <img src={image.image_url} alt={`Gallery ${index + 1}`} className="h-32 w-full rounded object-cover" />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                                                onClick={() => handleDeleteImage(image.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-4 py-4 text-center text-gray-500">No images uploaded yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGalleryOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* QR Code Management Dialog */}
            <Dialog open={isQrCodeOpen} onOpenChange={setIsQrCodeOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Manage QR Code Payment - {selectedHotel?.hotel_name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="qrcode_image">Upload QR Code Image</Label>
                            <Input
                                id="qrcode_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    qrCodeForm.setData('qrcode_image', e.target.files?.[0] || null);
                                }}
                            />
                            <Button
                                onClick={handleUploadQrCode}
                                disabled={qrCodeForm.processing || !qrCodeForm.data.qrcode_image}
                                className="mt-2"
                            >
                                {qrCodeForm.processing ? 'Uploading...' : 'Upload QR Code'}
                            </Button>
                        </div>

                        {selectedHotel?.qrcode_image_payment && (
                            <div className="mt-4">
                                <h3 className="mb-3 text-sm font-semibold">Current QR Code</h3>
                                <div className="flex justify-center">
                                    <img
                                        src={selectedHotel.qrcode_image_payment}
                                        alt="QR Code Payment"
                                        className="h-64 w-64 rounded border object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        {!selectedHotel?.qrcode_image_payment && (
                            <p className="py-4 text-center text-sm text-gray-500">No QR Code uploaded yet.</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsQrCodeOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
