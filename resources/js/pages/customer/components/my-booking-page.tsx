import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePage } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { BookingData } from '../types/booking';

// Interface for the actual API data structure

const getStatusColor = (status: string) => {
    switch (status) {
        case 'accepted':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        case 'declined':
            return 'bg-red-100 text-red-800 hover:bg-red-200';
        case 'cancelled':
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
};

export default function MyBookingPage() {
    const { props } = usePage();
    const bookingData = props.resortbookings as BookingData[];
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    return (
        <>
            <div className="mx-auto mt-4">
                {/* Search and Filter Controls */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            placeholder="Search by room name or booking reference..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Bookings</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </>
    );
}
