import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, } from '@inertiajs/react';
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
import { Sailboat, PhilippinePeso, ChevronRight, CalendarClock, Search } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { JSX } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'UBAAP Revenue',
        href: '/ubaap-revenue',
    },
];

export interface ContentCardItem {
    title: string;
    value: number;
    logo: JSX.Element;
}
const contentCard: ContentCardItem[] = [
    { title: 'Total Boatrides', value: 500, logo: <Sailboat /> },
    { title: `Today's Boatrides Schedule`, value: 1000, logo: <CalendarClock /> },
    { title: `Today's Income`, value: 20000, logo: <PhilippinePeso /> },
];




export default function Ubaap() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubaap Report" />
            <div className='my-4 mx-4'>

                <div className="flex flex-col gap-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                        {contentCard.map((item, index) => {
                            return (
                                <Card key={index} >
                                    <CardContent>
                                        <CardTitle className="text-slate-800 text-sm">
                                            <div className="flex flex-row items-center gap-2">
                                                <div
                                                    className='p-2 rounded-md border-1'
                                                >
                                                    {item.logo}
                                                </div>
                                                <span>{item.title}</span>

                                            </div>
                                        </CardTitle>

                                        <h1 className="text-start font-bold">
                                            {item.value.toLocaleString()}
                                        </h1>

                                        <hr className="my-3" />
                                        <div className="flex flex-row items-center justify-between text-blue-800 font-bold cursor-pointer">
                                            <span className="text-xs">View details</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                    </div>



                </div>

                <div className='grid grid-cols-2 gap-4 mt-4'>

                    <Card>
                        <CardContent>
                            <div className='grid grid-cols-2 gap-2'>
                                <CardTitle className='text-md'>
                                    Upcoming Boatrides
                                </CardTitle>

                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search"
                                        className="pl-10"
                                    />
                                </div>

                            </div>
                            <div className='overflow-auto'>

                                <Table className='mt-2'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Boat no.</TableHead>
                                            <TableHead>Guest name</TableHead>
                                            <TableHead>Schedule date</TableHead>
                                            <TableHead>Schedule Time</TableHead>
                                        </TableRow>

                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>101</TableCell>
                                            <TableCell>Juan Dela Cruz</TableCell>
                                            <TableCell>August 20, 2025</TableCell>
                                            <TableCell className='text-center'>7:30 am</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className='grid grid-cols-2 gap-2'>
                                <CardTitle className='text-md'>
                                    Boatrides History
                                </CardTitle>
                                <div className='flex flex-row gap-2'>

                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> 
                                        <Input
                                            placeholder="Search"
                                            className="pl-10"
                                        />
                                        </div>

                                        <Select defaultValue="">
                                            <SelectTrigger className="w-[120px] cursor-pointer">
                                                <SelectValue placeholder="Filter" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="something">Something</SelectItem>
                                            </SelectContent>
                                        </Select>
                                </div>


                            </div>
                            <div className='overflow-auto'>

                                <Table className='mt-2'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Boat no.</TableHead>
                                            <TableHead>Guest name</TableHead>
                                            <TableHead>Schedule date</TableHead>
                                            <TableHead>Schedule Time</TableHead>
                                        </TableRow>

                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>101</TableCell>
                                            <TableCell>Juan Dela Cruz</TableCell>
                                            <TableCell>August 20, 2025</TableCell>
                                            <TableCell className='text-center'>7:30 am</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                        </CardContent>
                    </Card>


                </div>


            </div>
        </AppLayout>
    );

}
