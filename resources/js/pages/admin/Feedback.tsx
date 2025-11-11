import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Filter, Search, Star, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

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

interface CategoryStat {
    category: string;
    count: number;
    avg_rating: number;
}

interface PageProps {
    feedbacks: {
        data: Feedback[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        category: string | null;
        rating: string | null;
        date_from: string | null;
        date_to: string | null;
        search: string | null;
    };
    statistics: {
        total: number;
        average_rating: number;
        category_stats: Record<string, CategoryStat>;
        rating_distribution: Record<number, number>;
        recent_trend: Array<{ date: string; count: number; avg_rating: number }>;
        top_rated_categories: CategoryStat[];
        latest_feedbacks: Feedback[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Feedback Report', href: '/admin/feedback-report' }];

export default function AdminFeedbackReport() {
    const { feedbacks, filters, statistics } = usePage<PageProps>().props;

    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [ratingFilter, setRatingFilter] = useState(filters.rating || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const applyFilters = () => {
        router.get(
            route('admin.feedback-report'),
            {
                category: categoryFilter || undefined,
                rating: ratingFilter || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                search: searchTerm || undefined,
            },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        setCategoryFilter('');
        setRatingFilter('');
        setDateFrom('');
        setDateTo('');
        setSearchTerm('');
        router.get(route('admin.feedback-report'));
    };

    const getCategoryLabel = (cat: string) => {
        const labels: Record<string, string> = {
            landing_area: 'Landing Area',
            resort: 'Resort',
            restaurant: 'Restaurant',
            hotel: 'Hotel',
            ubaap: 'UBAAP/Boat',
        };
        return labels[cat] || cat;
    };

    const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
        const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClass} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feedback Report" />

            <div className="mx-4 my-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Feedback Report & Analytics</h1>
                    <p className="text-muted-foreground">Comprehensive view of all customer feedback across all categories</p>
                </div>

                {/* Statistics Overview */}
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Users className="h-4 w-4 text-blue-500" />
                                Total Feedbacks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Star className="h-4 w-4 text-yellow-500" />
                                Average Rating
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.average_rating}</div>
                            <div className="mt-1">{renderStars(Math.round(statistics.average_rating), 'sm')}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Top Category
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {statistics.top_rated_categories[0] && (
                                <>
                                    <div className="text-xl font-bold">
                                        {getCategoryLabel(statistics.top_rated_categories[0].category)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {Number(statistics.top_rated_categories[0].avg_rating).toFixed(2)} ★
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 text-xs">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            {rating} <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                                        </span>
                                        <span className="text-muted-foreground">{statistics.rating_distribution[rating] || 0}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Statistics */}
                <div className="mb-6 grid gap-4 md:grid-cols-5">
                    {Object.entries(statistics.category_stats).map(([category, stats]) => (
                        <Card key={category}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">{getCategoryLabel(category)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xl font-bold">{stats.count}</div>
                                        <p className="text-xs text-muted-foreground">feedbacks</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-yellow-600">{Number(stats.avg_rating).toFixed(1)}</div>
                                        <p className="text-xs text-muted-foreground">avg rating</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                        <CardDescription>Filter feedback by category, rating, date, or search terms</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <Select value={categoryFilter || undefined} onValueChange={setCategoryFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="resort">Resort</SelectItem>
                                        <SelectItem value="hotel">Hotel</SelectItem>
                                        <SelectItem value="ubaap">UBAAP/Boat</SelectItem>
                                        <SelectItem value="restaurant">Restaurant</SelectItem>
                                        <SelectItem value="landing_area">Landing Area</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Rating</label>
                                <Select value={ratingFilter || undefined} onValueChange={setRatingFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Ratings" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 Stars</SelectItem>
                                        <SelectItem value="4">4 Stars</SelectItem>
                                        <SelectItem value="3">3 Stars</SelectItem>
                                        <SelectItem value="2">2 Stars</SelectItem>
                                        <SelectItem value="1">1 Star</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">From Date</label>
                                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                            </div>

                            <div>
                                <label className="text-sm font-medium">To Date</label>
                                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Search</label>
                                <Input
                                    type="text"
                                    placeholder="Name, email, comment..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button onClick={applyFilters}>
                                <Search className="mr-2 h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Feedbacks Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Feedbacks ({feedbacks.total})</CardTitle>
                        <CardDescription>
                            {filters.category && `Filtered by: ${getCategoryLabel(filters.category)}`}
                            {filters.rating && ` | Rating: ${filters.rating} stars`}
                            {filters.search && ` | Search: "${filters.search}"`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="min-w-[300px]">Comment</TableHead>
                                    <TableHead>Date</TableHead>
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
                                            <TableCell>
                                                <Badge variant="outline">{getCategoryLabel(feedback.category)}</Badge>
                                            </TableCell>
                                            <TableCell>{renderStars(feedback.rating)}</TableCell>
                                            <TableCell>
                                                <p className="text-sm line-clamp-2">{feedback.comment}</p>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No feedbacks found matching your filters
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {feedbacks.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Page {feedbacks.current_page} of {feedbacks.last_page}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={feedbacks.current_page === 1}
                                        onClick={() =>
                                            router.get(
                                                route('admin.feedback-report'),
                                                { ...filters, page: feedbacks.current_page - 1 },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={feedbacks.current_page === feedbacks.last_page}
                                        onClick={() =>
                                            router.get(
                                                route('admin.feedback-report'),
                                                { ...filters, page: feedbacks.current_page + 1 },
                                                { preserveState: true }
                                            )
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
