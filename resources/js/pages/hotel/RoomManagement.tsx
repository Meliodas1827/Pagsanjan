import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import { Ban, Edit2, MousePointerClick, Search, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import AddRoomsBtn from './components/add-rooms-btn';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Rooms', href: '/room-management' }];

// Room TypeScript interface based on new schema
interface Room {
    id: number;

    // Basic Information
    room_name: string;
    room_type?: string;
    promo_label?: string;

    // Description
    description?: string;
    location_details?: string;

    // Capacity
    max_adults: number;
    max_children: number;
    children_age_limit: number;

    // Room Specifications
    room_size_sqm?: number;
    number_of_beds?: number;
    bed_type?: string;
    view_type?: string;

    // Bathroom Features
    bathroom_sinks: number;
    has_rain_shower: boolean;
    has_premium_toiletries: boolean;

    // Personal Care Amenities
    has_algotherm_toiletries: boolean;

    // Entertainment Amenities
    has_tv: boolean;
    has_movie_channels: boolean;
    has_wifi: boolean;

    // Refreshments
    has_welcome_drink: boolean;
    has_bottled_water: boolean;
    has_mini_refrigerator: boolean;

    // Location
    building_name?: string;
    floor_number?: number;
    full_address?: string;

    // Media
    main_image?: string;
    image_gallery?: string[];

    // Status
    is_active: boolean;
    is_bookable: boolean;

    // Related data
    features?: RoomFeature[];
    pricing?: RoomPricing[];
    inventory?: RoomInventory[];
    images?: RoomImage[];

    // Legacy fields for backwards compatibility
    room_no?: string;
    price_per_night?: number;
    image_url?: string;
    is_posted?: boolean;
}

interface RoomFeature {
    id: number;
    room_id: number;
    category: string;
    feature_name: string;
    feature_value?: string;
    description?: string;
    sort_order: number;
    icon?: string;
}

interface RoomPricing {
    id: number;
    room_id: number;
    season: string;
    price_per_night: number;
    currency: string;
    valid_from?: string;
    valid_to?: string;
    weekend_price?: number;
    holiday_price?: number;
    early_bird_discount?: number;
    early_bird_days?: number;
    extended_stay_discount?: number;
    extended_stay_nights?: number;
    extra_adult_charge?: number;
    extra_child_charge?: number;
    is_active: boolean;
}

interface RoomInventory {
    id: number;
    room_id: number;
    room_number: string;
    room_code?: string;
    status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'blocked';
    notes?: string;
    last_maintenance_date?: string;
    next_maintenance_date?: string;
    status_changed_at?: string;
    status_changed_by?: number;
}

interface RoomImage {
    id: number;
    room_id: number;
    image_path: string;
    image_name?: string;
    caption?: string;
    alt_text?: string;
    image_type: 'main' | 'gallery' | 'thumbnail' | 'floor_plan';
    sort_order: number;
    mime_type?: string;
    file_size?: number;
    width?: number;
    height?: number;
    is_active: boolean;
}

interface RoomTypeOption {
    id: number;
    room_type: string;
}

export default function RoomManagement() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    // Extract rooms and room types from Inertia props safely
    const { props } = usePage<{ rooms?: Room[]; roomTypes?: RoomTypeOption[]; hotels?: { id: number; hotel_name: string }[] }>();
    const rooms: Room[] = props.rooms || [];
    const roomTypes: RoomTypeOption[] = props.roomTypes || [];
    const hotels = props.hotels || [];

    console.log(rooms);

    // Optional: map status to badge variants
    const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        available: 'default',
        occupied: 'secondary',
        maintenance: 'destructive',
        reserved: 'outline',
        blocked: 'destructive',
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        // Basic Information
        room_name: '',
        room_type: '',
        promo_label: '',

        // Description
        description: '',
        location_details: '',

        // Capacity
        max_adults: 2,
        max_children: 2,
        children_age_limit: 7,

        // Room Specifications
        room_size_sqm: '' as any,
        number_of_beds: '' as any,
        bed_type: '',
        view_type: '',

        // Bathroom Features
        bathroom_sinks: 1,
        has_rain_shower: false,
        has_premium_toiletries: false,

        // Personal Care Amenities
        has_algotherm_toiletries: false,

        // Entertainment Amenities
        has_tv: false,
        has_movie_channels: false,
        has_wifi: false,

        // Refreshments
        has_welcome_drink: false,
        has_bottled_water: false,
        has_mini_refrigerator: false,

        // Location
        building_name: '',
        floor_number: '' as any,
        full_address: '',

        // Status
        is_active: true,
        is_bookable: true,

        // Media
        main_image: null as File | null,
        gallery_images: [] as File[],
    });

    const openEdit = (room: Room) => {
        setEditingRoom(room);
        setData({
            // Basic Information
            room_name: room.room_name || '',
            room_type: room.room_type || '',
            promo_label: room.promo_label || '',

            // Description
            description: room.description || '',
            location_details: room.location_details || '',

            // Capacity
            max_adults: room.max_adults || 2,
            max_children: room.max_children || 2,
            children_age_limit: room.children_age_limit || 7,

            // Room Specifications
            room_size_sqm: (room.room_size_sqm as any) || '',
            number_of_beds: (room.number_of_beds as any) || '',
            bed_type: room.bed_type || '',
            view_type: room.view_type || '',

            // Bathroom Features
            bathroom_sinks: room.bathroom_sinks || 1,
            has_rain_shower: room.has_rain_shower || false,
            has_premium_toiletries: room.has_premium_toiletries || false,

            // Personal Care Amenities
            has_algotherm_toiletries: room.has_algotherm_toiletries || false,

            // Entertainment Amenities
            has_tv: room.has_tv || false,
            has_movie_channels: room.has_movie_channels || false,
            has_wifi: room.has_wifi || false,

            // Refreshments
            has_welcome_drink: room.has_welcome_drink || false,
            has_bottled_water: room.has_bottled_water || false,
            has_mini_refrigerator: room.has_mini_refrigerator || false,

            // Location
            building_name: room.building_name || '',
            floor_number: (room.floor_number as any) || '',
            full_address: room.full_address || '',

            // Status
            is_active: room.is_active ?? true,
            is_bookable: room.is_bookable ?? true,

            // Media
            main_image: null,
            gallery_images: [],
        });
        setEditOpen(true);
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('main_image', file);
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('gallery_images', files);
    };

    const submitEdit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!editingRoom) return;
        post(route('hotel.rooms.update', editingRoom.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Room updated');
                setEditOpen(false);
                setEditingRoom(null);
            },
            onError: () => {
                toast.error('Failed to update room');
            },
            onFinish: () => {},
        });
    };

    const deleteRoom = (room: Room) => {
        if (!confirm(`Delete room ${room.room_name}?`)) return;
        router.delete(route('hotel.rooms.destroy', room.id), {
            onSuccess: () => toast.success('Room deleted'),
            onError: () => toast.error('Failed to delete room'),
        });
    };

    const toggleBookable = (room: Room) => {
        router.post(
            route('hotel.rooms.toggle-bookable', room.id),
            {},
            {
                onSuccess: () => toast.success(room.is_bookable ? 'Room marked as not bookable' : 'Room marked as bookable'),
                onError: () => toast.error('Failed to update bookable status'),
            },
        );
    };

    const toggleActive = (room: Room) => {
        router.post(
            route('hotel.rooms.toggle-active', room.id),
            {},
            {
                onSuccess: () => toast.success(room.is_active ? 'Room deactivated' : 'Room activated'),
                onError: () => toast.error('Failed to update active status'),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Room Management" />

            <div className="mx-4 my-2">
                <div className="mb-4 flex items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input placeholder="Search by room number" className="pl-10" />
                    </div>

                    {/* Add Room Button */}
                    <div className="flex items-center justify-center gap-2">
                        <AddRoomsBtn roomTypes={roomTypes} hotels={hotels} />

                        <Link href={'hotel-room-type'}>
                            <Button className="cursor-pointer bg-green-600 hover:bg-green-700" size={'sm'}>
                                Go to Room Types
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Room Table */}
                <div className="min-h-[71vh] overflow-auto rounded-xl p-6 shadow-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Price / Night</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-4 text-center text-gray-500">
                                        No rooms found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rooms.map((room) => {
                                    // Get the first active pricing or fallback
                                    const currentPricing = room.pricing?.find((p) => p.is_active) || room.pricing?.[0];
                                    const displayPrice = currentPricing?.price_per_night || room.price_per_night || 0;

                                    // Get inventory status
                                    const inventoryStatuses = room.inventory?.map((inv) => inv.status) || [];
                                    const hasAvailable = inventoryStatuses.includes('available');

                                    return (
                                        <TableRow key={room.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{room.room_name}</div>
                                                    {room.promo_label && (
                                                        <Badge variant="secondary" className="mt-1 text-xs">
                                                            {room.promo_label}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize">{room.room_type || 'N/A'}</TableCell>
                                            <TableCell>
                                                {room.max_adults}A / {room.max_children}C
                                            </TableCell>
                                            <TableCell>₱{displayPrice.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {room.is_active ? (
                                                        <Badge variant="default">Active</Badge>
                                                    ) : (
                                                        <Badge variant="destructive">Inactive</Badge>
                                                    )}
                                                    {room.is_bookable ? (
                                                        <Badge variant="default">Bookable</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Not Bookable</Badge>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Image Preview Button */}
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                    size="sm"
                                                    onClick={() => {
                                                        const imagePath = room.main_image || room.image_url;
                                                        if (imagePath) {
                                                            setPreviewImage(imagePath.startsWith('/storage') ? imagePath : `/storage/${imagePath}`);
                                                        }
                                                    }}
                                                    disabled={!room.main_image && !room.image_url}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="space-x-2 text-right">
                                                <Button
                                                    onClick={() => toggleBookable(room)}
                                                    className="cursor-pointer bg-blue-500 hover:bg-blue-600"
                                                    size="sm"
                                                >
                                                    {room.is_bookable ? <Ban /> : <MousePointerClick />}
                                                    {room.is_bookable ? 'Disable' : 'Enable'}
                                                </Button>

                                                <Button
                                                    onClick={() => openEdit(room)}
                                                    className="cursor-pointer bg-yellow-500 hover:bg-yellow-600"
                                                    size="sm"
                                                >
                                                    <Edit2 size={14} className="mr-1" />
                                                    Edit
                                                </Button>
                                                <Button onClick={() => deleteRoom(room)} variant="destructive" size="sm">
                                                    <TrashIcon />
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Room Image Preview</DialogTitle>
                    </DialogHeader>
                    {previewImage && <img src={previewImage} alt="Room preview" className="max-h-[400px] w-full rounded-lg object-cover" />}
                </DialogContent>
            </Dialog>

            <Dialog
                open={editOpen}
                onOpenChange={(o) => {
                    setEditOpen(o);
                    if (!o) setEditingRoom(null);
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Edit Room</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Basic Information */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold" htmlFor="room_name">
                                    Room Name *
                                </Label>
                                <Input id="room_name" value={data.room_name} onChange={(e) => setData('room_name', e.target.value)} />
                                {errors.room_name && <p className="text-sm text-red-500">{errors.room_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="room_type">
                                    Room Type
                                </Label>
                                <Select value={data.room_type} onValueChange={(v) => setData('room_type', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select room type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roomTypes.length === 0 ? (
                                            <SelectItem value="" disabled>
                                                No room types available
                                            </SelectItem>
                                        ) : (
                                            roomTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.room_type}>
                                                    {type.room_type}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.room_type && <p className="text-sm text-red-500">{errors.room_type}</p>}
                                {roomTypes.length === 0 && (
                                    <p className="text-xs text-yellow-600">
                                        No room types found. Please create room types first in Room Type Management.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="promo_label">
                                    Promo Label
                                </Label>
                                <Input id="promo_label" value={data.promo_label} onChange={(e) => setData('promo_label', e.target.value)} />
                                {errors.promo_label && <p className="text-sm text-red-500">{errors.promo_label}</p>}
                            </div>

                            {/* Capacity */}
                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="max_adults">
                                    Max Adults
                                </Label>
                                <Input
                                    id="max_adults"
                                    type="number"
                                    min="1"
                                    value={data.max_adults}
                                    onChange={(e) => setData('max_adults', parseInt(e.target.value))}
                                />
                                {errors.max_adults && <p className="text-sm text-red-500">{errors.max_adults}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="max_children">
                                    Max Children
                                </Label>
                                <Input
                                    id="max_children"
                                    type="number"
                                    min="0"
                                    value={data.max_children}
                                    onChange={(e) => setData('max_children', parseInt(e.target.value))}
                                />
                                {errors.max_children && <p className="text-sm text-red-500">{errors.max_children}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="children_age_limit">
                                    Children Age Limit
                                </Label>
                                <Input
                                    id="children_age_limit"
                                    type="number"
                                    min="0"
                                    value={data.children_age_limit}
                                    onChange={(e) => setData('children_age_limit', parseInt(e.target.value))}
                                />
                                {errors.children_age_limit && <p className="text-sm text-red-500">{errors.children_age_limit}</p>}
                            </div>

                            {/* Room Specifications */}
                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="room_size_sqm">
                                    Room Size (sqm)
                                </Label>
                                <Input
                                    id="room_size_sqm"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.room_size_sqm}
                                    onChange={(e) => setData('room_size_sqm', e.target.value)}
                                />
                                {errors.room_size_sqm && <p className="text-sm text-red-500">{errors.room_size_sqm}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="number_of_beds">
                                    Number of Beds
                                </Label>
                                <Input
                                    id="number_of_beds"
                                    type="number"
                                    min="0"
                                    value={data.number_of_beds}
                                    onChange={(e) => setData('number_of_beds', e.target.value)}
                                />
                                {errors.number_of_beds && <p className="text-sm text-red-500">{errors.number_of_beds}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="bed_type">
                                    Bed Type
                                </Label>
                                <Input id="bed_type" value={data.bed_type} onChange={(e) => setData('bed_type', e.target.value)} />
                                {errors.bed_type && <p className="text-sm text-red-500">{errors.bed_type}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="view_type">
                                    View Type
                                </Label>
                                <Input id="view_type" value={data.view_type} onChange={(e) => setData('view_type', e.target.value)} />
                                {errors.view_type && <p className="text-sm text-red-500">{errors.view_type}</p>}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="building_name">
                                    Building Name
                                </Label>
                                <Input id="building_name" value={data.building_name} onChange={(e) => setData('building_name', e.target.value)} />
                                {errors.building_name && <p className="text-sm text-red-500">{errors.building_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="floor_number">
                                    Floor Number
                                </Label>
                                <Input
                                    id="floor_number"
                                    type="number"
                                    min="0"
                                    value={data.floor_number}
                                    onChange={(e) => setData('floor_number', e.target.value)}
                                />
                                {errors.floor_number && <p className="text-sm text-red-500">{errors.floor_number}</p>}
                            </div>

                            {/* Description - Full Width */}
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs" htmlFor="description">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs" htmlFor="location_details">
                                    Location Details
                                </Label>
                                <Textarea
                                    id="location_details"
                                    rows={2}
                                    value={data.location_details}
                                    onChange={(e) => setData('location_details', e.target.value)}
                                />
                                {errors.location_details && <p className="text-sm text-red-500">{errors.location_details}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs" htmlFor="full_address">
                                    Full Address
                                </Label>
                                <Input id="full_address" value={data.full_address} onChange={(e) => setData('full_address', e.target.value)} />
                                {errors.full_address && <p className="text-sm text-red-500">{errors.full_address}</p>}
                            </div>

                            {/* Amenities - Checkboxes */}
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs font-semibold">Amenities</Label>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_tv}
                                            onChange={(e) => setData('has_tv', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">TV</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_wifi}
                                            onChange={(e) => setData('has_wifi', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">WiFi</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_movie_channels}
                                            onChange={(e) => setData('has_movie_channels', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Movie Channels</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_mini_refrigerator}
                                            onChange={(e) => setData('has_mini_refrigerator', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Mini Refrigerator</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_welcome_drink}
                                            onChange={(e) => setData('has_welcome_drink', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Welcome Drink</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_bottled_water}
                                            onChange={(e) => setData('has_bottled_water', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Bottled Water</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_rain_shower}
                                            onChange={(e) => setData('has_rain_shower', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Rain Shower</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_premium_toiletries}
                                            onChange={(e) => setData('has_premium_toiletries', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Premium Toiletries</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.has_algotherm_toiletries}
                                            onChange={(e) => setData('has_algotherm_toiletries', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Algotherm Toiletries</span>
                                    </label>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium">Is Active</span>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_bookable}
                                        onChange={(e) => setData('is_bookable', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium">Is Bookable</span>
                                </label>
                            </div>

                            {/* Images */}
                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="main_image">
                                    Main Image
                                </Label>
                                <Input id="main_image" type="file" accept="image/*" onChange={handleMainImageChange} />
                                {errors.main_image && <p className="text-sm text-red-500">{errors.main_image}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="gallery_images">
                                    Gallery Images
                                </Label>
                                <Input id="gallery_images" type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} />
                                {errors.gallery_images && <p className="text-sm text-red-500">{errors.gallery_images}</p>}
                            </div>
                        </div>
                        <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditOpen(false);
                                    setEditingRoom(null);
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
