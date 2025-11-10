import { useState, ReactNode, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm, usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    hotelid?: number | null;
    restoid?: number | null;
    landing_area_id?: number | null;
    role: {
        id: number;
        role_name: string;
    };
}

interface Hotel {
    id: number;
    hotel_name: string;
}

interface Restaurant {
    id: number;
    resto_name: string;
}

interface LandingArea {
    id: number;
    name: string;
}

interface EditUserDialogProps {
    user: User;
    children: ReactNode;
}

export default function EditUserDialog({ user, children }: EditUserDialogProps) {
    const [open, setOpen] = useState(false);
    const { hotels, restaurants, landingAreas } = usePage().props as {
        hotels: Hotel[],
        restaurants: Restaurant[],
        landingAreas: LandingArea[]
    };
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        role: user.role_id.toString(),
        hotelid: user.hotelid?.toString() || '',
        restoid: user.restoid?.toString() || '',
        landing_area_id: user.landing_area_id?.toString() || '',
    });

    useEffect(() => {
        if (open) {
            setData({
                name: user.name,
                email: user.email,
                role: user.role_id.toString(),
                hotelid: user.hotelid?.toString() || '',
                restoid: user.restoid?.toString() || '',
                landing_area_id: user.landing_area_id?.toString() || '',
            });
        }
    }, [open, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('manage-users.update', user.id), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                            id="edit-name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-role">Role</Label>
                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Admin</SelectItem>
                                <SelectItem value="3">Customer</SelectItem>
                                <SelectItem value="4">Resort</SelectItem>
                                <SelectItem value="5">UBAAP</SelectItem>
                                <SelectItem value="6">Hotel</SelectItem>
                                <SelectItem value="7">Restaurant</SelectItem>
                                <SelectItem value="8">Landing Area</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                    </div>

                    {data.role === '6' && (
                        <div className="space-y-2">
                            <Label htmlFor="edit-hotel">Assign Hotel</Label>
                            <Select value={data.hotelid} onValueChange={(value) => setData('hotelid', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a hotel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hotels.map((hotel) => (
                                        <SelectItem key={hotel.id} value={hotel.id.toString()}>
                                            {hotel.hotel_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.hotelid && <p className="text-sm text-red-500">{errors.hotelid}</p>}
                        </div>
                    )}

                    {data.role === '7' && (
                        <div className="space-y-2">
                            <Label htmlFor="edit-restaurant">Assign Restaurant</Label>
                            <Select value={data.restoid} onValueChange={(value) => setData('restoid', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a restaurant" />
                                </SelectTrigger>
                                <SelectContent>
                                    {restaurants.map((restaurant) => (
                                        <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                                            {restaurant.resto_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.restoid && <p className="text-sm text-red-500">{errors.restoid}</p>}
                        </div>
                    )}

                    {data.role === '8' && (
                        <div className="space-y-2">
                            <Label htmlFor="edit-landing-area">Assign Landing Area</Label>
                            <Select value={data.landing_area_id} onValueChange={(value) => setData('landing_area_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a landing area" />
                                </SelectTrigger>
                                <SelectContent>
                                    {landingAreas.map((area) => (
                                        <SelectItem key={area.id} value={area.id.toString()}>
                                            {area.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.landing_area_id && <p className="text-sm text-red-500">{errors.landing_area_id}</p>}
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}