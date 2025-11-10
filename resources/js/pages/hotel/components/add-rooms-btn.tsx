import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RoomTypeOption {
    id: number;
    room_type: string;
}

interface HotelOption {
    id: number;
    hotel_name: string;
}

interface RoomFormDialogProps {
    roomTypes?: RoomTypeOption[];
    hotels?: HotelOption[];
}

const RoomFormDialog = ({ roomTypes = [], hotels = [] }: RoomFormDialogProps) => {
    const [open, setOpen] = useState(false);

    const { data, setData, post, errors, processing, reset } = useForm({
        hotelid: '',
        room_name: '',
        room_type: '',
        promo_label: '',
        description: '',
        location_details: '',
        max_adults: 2,
        max_children: 2,
        children_age_limit: 7,
        room_size_sqm: '',
        number_of_beds: '',
        bed_type: '',
        view_type: '',
        bathroom_sinks: 1,
        has_rain_shower: false,
        has_premium_toiletries: false,
        has_algotherm_toiletries: false,
        has_tv: false,
        has_movie_channels: false,
        has_wifi: false,
        has_welcome_drink: false,
        has_bottled_water: false,
        has_mini_refrigerator: false,
        building_name: '',
        floor_number: '',
        full_address: '',
        is_active: true,
        is_bookable: true,
        main_image: null as any,
        price_per_night: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setData('main_image', file as any);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('add.rooms'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Room added successfully!');
                setOpen(false);
                reset();
            },
            onError: () => {
                console.log(errors);
                toast.error('Error: Unable to add room!');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger Button */}
            <Button size="sm" onClick={() => setOpen(true)} className="flex items-center gap-2">
                <Plus size={18} /> Add Room
            </Button>

            {/* Dialog Content */}
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs" htmlFor="hotelid">
                                Hotel <span className="text-red-600">*</span>
                            </Label>
                            <Select value={data.hotelid} onValueChange={(value) => setData('hotelid', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select hotel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hotels.length === 0 ? (
                                        <SelectItem value="" disabled>
                                            No hotels available
                                        </SelectItem>
                                    ) : (
                                        hotels.map((hotel) => (
                                            <SelectItem key={hotel.id} value={hotel.id.toString()}>
                                                {hotel.hotel_name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.hotelid && <p className="text-sm text-red-500">{errors.hotelid}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs" htmlFor="room_name">
                                Room Name <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="room_name"
                                placeholder="e.g., Deluxe Queen"
                                value={data.room_name}
                                onChange={(e) => setData('room_name', e.target.value)}
                            />
                            {errors.room_name && <p className="text-sm text-red-500">{errors.room_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs" htmlFor="description">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Enter room description and features"
                                value={data.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                rows={3}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs" htmlFor="room_type">
                                Room Type <span className="text-red-600">*</span>
                            </Label>
                            <Select value={data.room_type} onValueChange={(value) => setData('room_type', value)}>
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

                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-2">
                                <Label className="text-xs" htmlFor="max_adults">
                                    Max Adults
                                </Label>
                                <Input
                                    id="max_adults"
                                    type="number"
                                    min={0}
                                    max={10}
                                    value={data.max_adults}
                                    onChange={(e) => setData('max_adults', Number(e.target.value))}
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
                                    min={0}
                                    max={10}
                                    value={data.max_children}
                                    onChange={(e) => setData('max_children', Number(e.target.value))}
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
                                    min={0}
                                    max={17}
                                    value={data.children_age_limit}
                                    onChange={(e) => setData('children_age_limit', Number(e.target.value))}
                                />
                                {errors.children_age_limit && <p className="text-sm text-red-500">{errors.children_age_limit}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs" htmlFor="price_per_night">
                                Price Per Night <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="price_per_night"
                                type="number"
                                step="0.01"
                                placeholder="Enter price (e.g., 99.99)"
                                value={data.price_per_night}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('price_per_night', e.target.value)}
                                min="0"
                            />
                            {errors.price_per_night && <p className="text-sm text-red-500">{errors.price_per_night}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs" htmlFor="main_image">
                                Main Image
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input id="main_image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('main_image')?.click()}
                                    className="flex w-full items-center justify-center gap-2"
                                >
                                    <Upload size={16} />
                                    {data.main_image ? (data.main_image as any).name : 'Choose Image'}
                                </Button>
                            </div>
                            {errors.main_image && <p className="text-sm text-red-500">{errors.main_image}</p>}
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto" disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto">
                            {processing ? 'Saving...' : 'Save Room'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RoomFormDialog;
