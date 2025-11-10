import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import CardFeedback from '@/pages/admin/component/feedback-card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Feedback', href: '/feedback' },
];

export default function BookingReport() {
    const Page = usePage<SharedData>();
    const { auth } = Page.props;
    const roleId = auth.user.role_id; // this is an int

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Feedback" />
            <div className="my-4 mx-4">
                <div className="flex flex-row gap-2 mb-4">

                    {/* Hide for resort role (4) */}
                    {roleId !== 4 && (
                        <Select defaultValue="">
                            <SelectTrigger className="w-[180px] cursor-pointer">
                                <SelectValue placeholder="Landing Area" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="arealanding">Landing Area</SelectItem>
                                <SelectItem value="thismonth">This Month</SelectItem>
                                <SelectItem value="thisyear">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    {/* Show only for admin (1) */}
                    {roleId === 1 && (
                        <Select defaultValue="">
                            <SelectTrigger className="w-[180px] cursor-pointer">
                                <SelectValue placeholder="Hotel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="thismonth">This Month</SelectItem>
                                <SelectItem value="thisyear">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    {/* Hide for hotel role (6) */}
                    {roleId === 6 && (
                        <Select defaultValue="">
                            <SelectTrigger className="w-[180px] cursor-pointer">
                                <SelectValue placeholder="Restaurant" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="resto">Restaurant</SelectItem>
                                <SelectItem value="thismonth">This Month</SelectItem>
                                <SelectItem value="thisyear">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    {/* Show only for admin (1) or resort (5) */}
                    {(roleId === 1 || roleId === 4) && (
                        <Select defaultValue="">
                            <SelectTrigger className="w-[180px] cursor-pointer">
                                <SelectValue placeholder="Resort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="resort">Resort</SelectItem>
                                <SelectItem value="thismonth">This Month</SelectItem>
                                <SelectItem value="thisyear">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                </div>

                <CardFeedback />
            </div>
        </AppLayout>
    );
}
