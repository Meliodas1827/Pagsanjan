import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Feedback {
    id: number;
    user: {
        name: string;
        email: string;
    };
    category: string;
    booking_reference: string | null;
    rating: number;
    comment: string;
    created_at: string;
}

interface PageProps {
    feedbacks: {
        data: Feedback[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    statistics: {
        total: number;
        average_rating: number;
        distribution: Record<number, number>;
    };
    category: string | null;
    auth: {
        user: {
            role: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Feedbacks', href: '/feedbacks' }];

export default function Feedbacks() {
    const { feedbacks, statistics, category, auth } = usePage<PageProps>().props;

    const getCategoryBadgeColor = (cat: string) => {
        switch (cat) {
            case 'landing_area':
                return 'default';
            case 'resort':
                return 'default';
            case 'restaurant':
                return 'default';
            case 'hotel':
                return 'default';
            case 'ubaap':
                return 'default';
            default:
                return 'secondary';
        }
    };

    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'landing_area':
                return 'Landing Area';
            case 'resort':
                return 'Resort';
            case 'restaurant':
                return 'Restaurant';
            case 'hotel':
                return 'Hotel';
            case 'ubaap':
                return 'UBAAP';
            default:
                return cat;
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this feedback?')) {
            router.delete(route('feedbacks.destroy', { feedback: id }), {
                onSuccess: () => {
                    toast.success('Feedback deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete feedback');
                },
            });
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feedbacks" />

            <div className="mx-4 my-4">
                <h1 className="text-2xl font-semibold">Customer Feedbacks</h1>
                <p className="text-muted-foreground">{category ? `Viewing ${getCategoryLabel(category)} feedbacks` : 'Viewing all feedbacks'}</p>
            </div>

            {/* Statistics Cards */}
            <div className="mx-4 mb-4 grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statistics.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold">{statistics.average_rating}</div>
                            {renderStars(Math.round(statistics.average_rating))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1 text-sm">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        {rating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </span>
                                    <span className="text-muted-foreground">{statistics.distribution[rating] || 0}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Feedbacks Table */}
            <div className="mx-4">
                <Card>
                    <CardHeader>
                        <CardTitle>All Feedbacks</CardTitle>
                        <CardDescription>Customer feedback and ratings for your services</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    {!category && <TableHead>Category</TableHead>}
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Date</TableHead>
                                    {auth.user.role === 'admin' && <TableHead>Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feedbacks.data.length > 0 ? (
                                    feedbacks.data.map((feedback) => (
                                        <TableRow key={feedback.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{feedback.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{feedback.user.email}</div>
                                                </div>
                                            </TableCell>
                                            {!category && (
                                                <TableCell>
                                                    <Badge variant={getCategoryBadgeColor(feedback.category)}>{getCategoryLabel(feedback.category)}</Badge>
                                                </TableCell>
                                            )}
                                            <TableCell>{feedback.booking_reference || 'N/A'}</TableCell>
                                            <TableCell>{renderStars(feedback.rating)}</TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="line-clamp-2 text-sm">{feedback.comment}</p>
                                            </TableCell>
                                            <TableCell>{new Date(feedback.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>
                                            {auth.user.role === 'admin' && (
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(feedback.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={!category ? 7 : 6} className="text-center text-muted-foreground">
                                            No feedbacks yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
