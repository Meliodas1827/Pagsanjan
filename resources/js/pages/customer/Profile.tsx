import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { User, Lock, Trash2, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import CustomerLayout from './layout/layout';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    created_at: string;
}

interface Props {
    user: User;
}

export default function Profile({ user }: Props) {
    const [deletePassword, setDeletePassword] = useState('');

    // Profile update form
    const profileForm = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
    });

    // Password update form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put(route('profile.update'), {
            onSuccess: () => {
                toast.success('Profile updated successfully!');
            },
            onError: (errors) => {
                toast.error('Failed to update profile');
                console.error(errors);
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put(route('profile.password'), {
            onSuccess: () => {
                toast.success('Password changed successfully!');
                passwordForm.reset();
            },
            onError: (errors) => {
                if (errors.current_password) {
                    toast.error(errors.current_password);
                } else {
                    toast.error('Failed to change password');
                }
            },
        });
    };

    const handleDeleteAccount = () => {
        router.delete(route('profile.delete'), {
            data: { password: deletePassword },
            onSuccess: () => {
                toast.success('Account deleted successfully');
            },
            onError: (errors) => {
                if (errors.password) {
                    toast.error(errors.password);
                } else {
                    toast.error('Failed to delete account');
                }
            },
        });
    };

    return (
        <CustomerLayout>
            <Head title="Account Management" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
                    <p className="mt-2 text-gray-600">Manage your profile, security, and account settings</p>
                </div>

                {/* Account Overview Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Account Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Mail className="mt-1 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-gray-900">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="mt-1 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="text-gray-900">{user.address || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                                    <p className="text-gray-900">{user.created_at}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for different sections */}
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Profile Information</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                    </TabsList>

                    {/* Profile Information Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your account information and contact details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            required
                                        />
                                        {profileForm.errors.name && (
                                            <p className="text-sm text-red-600">{profileForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            required
                                        />
                                        {profileForm.errors.email && (
                                            <p className="text-sm text-red-600">{profileForm.errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={profileForm.data.phone}
                                            onChange={(e) => profileForm.setData('phone', e.target.value)}
                                            placeholder="Enter your phone number"
                                        />
                                        {profileForm.errors.phone && (
                                            <p className="text-sm text-red-600">{profileForm.errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={profileForm.data.address}
                                            onChange={(e) => profileForm.setData('address', e.target.value)}
                                            placeholder="Enter your address"
                                        />
                                        {profileForm.errors.address && (
                                            <p className="text-sm text-red-600">{profileForm.errors.address}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                profileForm.setData({
                                                    name: user.name,
                                                    email: user.email,
                                                    phone: user.phone || '',
                                                    address: user.address || '',
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                        >
                                            {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-blue-600" />
                                    Change Password
                                </CardTitle>
                                <CardDescription>
                                    Update your password to keep your account secure
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={passwordForm.data.current_password}
                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                            required
                                        />
                                        {passwordForm.errors.current_password && (
                                            <p className="text-sm text-red-600">{passwordForm.errors.current_password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            required
                                        />
                                        {passwordForm.errors.password && (
                                            <p className="text-sm text-red-600">{passwordForm.errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => passwordForm.reset()}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                        >
                                            {passwordForm.processing ? 'Changing...' : 'Change Password'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Danger Zone Tab */}
                    <TabsContent value="danger">
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                    Delete Account
                                </CardTitle>
                                <CardDescription>
                                    Permanently delete your account and all associated data
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-red-50 p-4">
                                        <h4 className="font-semibold text-red-900">Warning</h4>
                                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-800">
                                            <li>This action cannot be undone</li>
                                            <li>All your bookings history will be permanently deleted</li>
                                            <li>You cannot delete your account if you have pending bookings</li>
                                            <li>You will be immediately logged out</li>
                                        </ul>
                                    </div>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete My Account
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription className="space-y-3">
                                                    <p>
                                                        This action cannot be undone. This will permanently delete your
                                                        account and remove all your data from our servers.
                                                    </p>
                                                    <div className="space-y-2 pt-2">
                                                        <Label htmlFor="delete-password">
                                                            Enter your password to confirm
                                                        </Label>
                                                        <Input
                                                            id="delete-password"
                                                            type="password"
                                                            value={deletePassword}
                                                            onChange={(e) => setDeletePassword(e.target.value)}
                                                            placeholder="Enter your password"
                                                        />
                                                    </div>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={() => setDeletePassword('')}>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDeleteAccount}
                                                    className="bg-red-600 hover:bg-red-700"
                                                    disabled={!deletePassword}
                                                >
                                                    Delete Account
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </CustomerLayout>
    );
}
