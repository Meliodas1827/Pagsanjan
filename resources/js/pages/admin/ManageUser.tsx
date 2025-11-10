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
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Search, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserFormDialog from './component/add-user-btn';
import EditUserDialog from './component/edit-user-dialog';

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    resort_id?: number | null;
    hotelid?: number | null;
    restoid?: number | null;
    landing_area_id?: number | null;
    email_verified_at: string | null;
    role: {
        id: number;
        role_name: string;
    };
}

interface PageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function ManageUser() {
    const { users, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Users',
            href: '/manage-users',
        },
    ];

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                '/manage-users',
                { search },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleDelete = () => {
        if (userToDelete) {
            router.delete(route('manage-users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    const openDeleteDialog = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="mx-4 my-4 flex flex-row items-center justify-between gap-2">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                        placeholder="Search users by name, email, or role..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <UserFormDialog />
            </div>

            {/* table */}
            <div className="mx-3 overflow-auto rounded-xl p-4 shadow-lg" style={{ minHeight: '71vh', maxHeight: '71vh' }}>
                <TooltipProvider>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center text-sm">ID</TableHead>
                                <TableHead className="text-center text-sm">Name</TableHead>
                                <TableHead className="text-center text-sm">Email</TableHead>
                                <TableHead className="text-center text-sm">Role</TableHead>
                                <TableHead className="text-center text-sm">Status</TableHead>
                                <TableHead className="text-center text-sm">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="text-center text-sm">{user.id}</TableCell>
                                        <TableCell className="text-center text-sm">{user.name}</TableCell>
                                        <TableCell className="text-center text-sm">{user.email}</TableCell>
                                        <TableCell className="text-center text-sm">
                                            <Badge variant="outline">{user.role.role_name}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-sm">
                                            <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                                {user.email_verified_at ? 'Verified' : 'Unverified'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="space-x-2 text-center text-sm">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <EditUserDialog user={user}>
                                                        <Button variant={null} size={'sm'} className="bg-yellow-400 hover:bg-yellow-500">
                                                            <SquarePen className="h-4 w-4" />
                                                        </Button>
                                                    </EditUserDialog>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant={'destructive'} size={'sm'} onClick={() => openDeleteDialog(user)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TooltipProvider>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the user <strong>{userToDelete?.name}</strong> and all associated data. This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
