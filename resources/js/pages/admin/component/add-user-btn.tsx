import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Plus, Upload, User } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: string;
    entity_name: string;
    entity_description: string;
    location: string;
    image: File | null;
    [key: string]: any;
}

const ROLE_OPTIONS = [
    { value: '1', label: 'Admin' },
    { value: '2', label: 'Staff' },
    { value: '3', label: 'Customer' },
    { value: '4', label: 'Resort Owner' },
    { value: '5', label: 'Ubaap' },
    { value: '6', label: 'Hotel Owner' },
    { value: '6', label: 'Restaurant' },
];

const INITIAL_FORM_DATA: UserFormData = {
    name: '',
    email: '',
    password: '',
    role: '',
    entity_name: '',
    entity_description: '',
    location: '',
    image: null,
};

const UserFormDialog: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { data, setData, post, errors, processing, reset } = useForm<UserFormData>(INITIAL_FORM_DATA);

    // show entity fields only for roles 4–6
    const isEntityRole = data.role !== '' && !['1', '2', '3'].includes(data.role);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);
    };

    const handleRoleChange = (value: string) => {
        setData('role', value);

        if (['1', '2', '3'].includes(value)) {
            setData('entity_name', '');
            setData('entity_description', '');
            setData('location', '');
            setData('image', null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                toast.success('User added successfully!');
                setOpen(false);
                reset();
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
                toast.error('Error: Unable to add user. Please check the form.');
            },
        });
    };

    const handleCancel = () => {
        setOpen(false);
        reset();
    };

    const handleImageUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.getElementById('image-upload')?.click();
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                <Plus size={18} />
                Add User
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDownOutside={(e) => {
                        if (processing) e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User size={20} />
                            Add New User
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic User Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter user's full name"
                                    value={data.name ?? ''}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={data.email ?? ''}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={data.password ?? ''}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    disabled={processing}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">User Role *</Label>
                                <Select value={data.role ?? ''} onValueChange={handleRoleChange} disabled={processing} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLE_OPTIONS.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                            </div>
                        </div>

                        {/* Entity Fields */}
                        {isEntityRole && (
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="text-sm font-semibold">Entity Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="entity_name">Entity Name *</Label>
                                    <Input
                                        id="entity_name"
                                        name="entity_name"
                                        type="text"
                                        placeholder="Enter business/entity name"
                                        value={data.entity_name ?? ''}
                                        onChange={(e) => setData('entity_name', e.target.value)}
                                        required={isEntityRole}
                                        disabled={processing}
                                    />
                                    {errors.entity_name && <p className="text-sm text-red-500">{errors.entity_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="entity_description">Entity Description</Label>
                                    <Textarea
                                        id="entity_description"
                                        name="entity_description"
                                        placeholder="Describe the business/entity"
                                        value={data.entity_description ?? ''}
                                        onChange={(e) => setData('entity_description', e.target.value)}
                                        rows={3}
                                        disabled={processing}
                                    />
                                    {errors.entity_description && <p className="text-sm text-red-500">{errors.entity_description}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        type="text"
                                        placeholder="Enter business location/address"
                                        value={data.location ?? ''}
                                        onChange={(e) => setData('location', e.target.value)}
                                        required={isEntityRole}
                                        disabled={processing}
                                    />
                                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image-upload">Entity Image</Label>
                                    <Input
                                        id="image-upload"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={processing}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleImageUploadClick}
                                        className="flex w-full items-center justify-center gap-2"
                                        disabled={processing}
                                    >
                                        <Upload size={16} />
                                        {data.image ? data.image.name : 'Choose Entity Image'}
                                    </Button>
                                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                                    <p className="text-xs text-gray-500">Upload logo or representative image (optional)</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <DialogFooter className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto" disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto">
                                {processing ? 'Creating...' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserFormDialog;
