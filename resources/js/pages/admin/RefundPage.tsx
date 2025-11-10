import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCheck, Search, SquareCheckBig, Vote } from 'lucide-react';
import {
    
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import RefundBtnDialog from './component/refund-approve-btn';


// 👇 Define your refund type
interface Refund {
    id: number
    transaction_ref: string;
    service_date: string;
    original_amount: string;
    refunded_amount: string;
    created_at: string;
    approved_at: string;
    status: string
    booked_place: string;
    guest_name: string;
    phone: string;
}

interface PageProps {
    refunds: Refund[];
    [key: string]: any
}

export default function RefundPage() {
    const { props } = usePage<PageProps>();
    const { refunds } = props;
    console.log(refunds)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Users',
            href: '/manage-users',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className='my-4 mx-4'>
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search Transaction Reference"
                        className="pl-10"
                    />
                </div>

                {/* table */}
                <div className='overflow-auto shadow-lg p-4 rounded-xl' style={{ minHeight: '71vh', maxHeight: '71vh' }}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-sm text-center'>Transaction Ref.</TableHead>
                                <TableHead className='text-sm text-center'>Booked Place</TableHead>
                                <TableHead className='text-sm text-center'>Guest Name</TableHead>
                                <TableHead className='text-sm text-center'>Original Amount</TableHead>
                                <TableHead className='text-sm text-center'>Refunded Amount</TableHead>
                                <TableHead className='text-sm text-center'>Requested Date</TableHead>
                                <TableHead className='text-sm text-center'>Refunded Date</TableHead>
                                <TableHead className='text-sm text-center'>Status</TableHead>
                                <TableHead className='text-sm text-center'>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {refunds && refunds.length > 0 ? (
                                refunds.map((refund, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">{refund.transaction_ref}</TableCell>
                                        <TableCell className="text-center">{refund.booked_place}</TableCell>
                                        <TableCell className="text-center">{refund.guest_name}</TableCell>
                                        <TableCell className="text-center text-green-800">
                                            ₱{Number(refund.original_amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-center text-red-600">
                                            ₱{Number(refund.refunded_amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            {new Date(refund.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {refund.approved_at ?
                                                new Date(refund.approved_at).toLocaleDateString()
                                                :
                                                '-'
                                            }

                                        </TableCell>
                                        <TableCell className="text-center">
                                            {refund.status}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <TooltipProvider>
                                                <Tooltip >
                                                    <TooltipTrigger asChild>
                                                       {/* <span className='flex items-center justify-center cursor-pointer' >
                                                            <SquareCheckBig size={24}className='text-blue-600'/>

                                                       </span> */}
                                                       <RefundBtnDialog id={refund.id} amount={Number(refund.refunded_amount)} 
                                                        transaction_ref={refund.transaction_ref}
                                                        guest_name={refund.guest_name}
                                                        booked_place={refund.booked_place}
                                                        phone={refund.phone}
                                                        status={refund.status}
                                                       />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p>Approve</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-gray-400">
                                        No refunds found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
