import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Notebook, CalendarCheck, CalendarX2, ChevronRight, Search, SquarePen, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { JSX } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Booking Report',
        href: '/booking-report',
    },
];

// Define allowed colors
type CardColor = 'red' | 'green' | 'yellow';

// Predefine Tailwind classes with the correct key type
const colorClasses: Record<CardColor, { bg: string; innerBg: string; border: string }> = {
    red: {
        bg: 'bg-blue-300',
        innerBg: 'bg-blue-200',
        border: 'border-blue-400',
    },
    green: {
        bg: 'bg-green-500',
        innerBg: 'bg-green-200',
        border: 'border-green-400',
    },
    yellow: {
        bg: 'bg-red-300',
        innerBg: 'bg-red-200',
        border: 'border-red-400',
    },
};

export interface ContentCardItem {
    title: string;
    value: number;
    logo: JSX.Element;
    color: CardColor;
}

export default function BookingReport() {
    const contentCard: ContentCardItem[] = [
        { title: 'Total Reservation', value: 500, logo: <Notebook />, color: 'red' },
        { title: 'New Booking', value: 1000, logo: <CalendarCheck />, color: 'green' },
        { title: `Cancel Booking`, value: 20, logo: <CalendarX2 />, color: 'yellow' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Report" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {contentCard.map((item, index) => {
                        const colors = colorClasses[item.color];
                        return (
                            <Card key={index} className={colors.bg}>
                                <CardContent>
                                    <CardTitle className="text-slate-800 text-sm">
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <span>{item.title}</span>
                                            <div
                                                className={`p-2 rounded-md ${colors.innerBg} border-1 ${colors.border}`}
                                            >
                                                {item.logo}
                                            </div>
                                        </div>
                                    </CardTitle>

                                    <h1 className="text-start font-bold">
                                        {item.value.toLocaleString()}
                                    </h1>

                                    <hr className="my-3" />
                                    <div className="flex flex-row items-center justify-between text-blue-800 cursor-pointer">
                                        <span className="text-xs">View details</span>
                                        <ChevronRight size={16} />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                </div>

                <Card style={{ minHeight: '90vh', maxHeight: '90vh' }}>
                    <CardContent>
                        <div className='flex flex-row items-center justify-between'>
                            <CardTitle>
                                Booking History
                            </CardTitle>
                            <span className='text-sm text-blue-500 font-bold cursor-pointer'>View all</span>

                        </div>
                            <div className="relative flex-1 max-w-md flex flex-row gap-2 mb-3">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search"
                                    className="pl-10"
                                />

                                <Select defaultValue="thisweek">
                                    <SelectTrigger className="w-[180px] cursor-pointer">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="thisweek">This Week</SelectItem>
                                         <SelectItem value="thismonth">This Month</SelectItem>
                                          <SelectItem value="thisyear">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                             <TooltipProvider>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-sm text-center'>Reference</TableHead>
                                <TableHead className='text-sm text-center'>Name</TableHead>
                                <TableHead className='text-sm text-center'>Landing Area</TableHead>
                                <TableHead className='text-sm text-center'>Schedule Date</TableHead>
                                <TableHead className='text-sm text-center'>Status</TableHead>
                                <TableHead className='text-sm text-center'>Action</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className='text-sm text-center'>2025-00001</TableCell>
                                <TableCell className='text-sm text-center'>Admin 101</TableCell>
                                <TableCell className='text-sm text-center'>Aria</TableCell>
                                <TableCell className='text-sm text-center'>10/20/25</TableCell>
                                <TableCell className='text-sm text-center text-green-700 '>Processed</TableCell>

                                <TableCell className='text-sm text-center space-x-2'>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={null} size={'sm'} className='bg-yellow-400'>
                                                <SquarePen className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={'destructive'} size={'sm'}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TooltipProvider>


                    </CardContent>

                </Card>
            </div>
        </AppLayout>
    );
}
