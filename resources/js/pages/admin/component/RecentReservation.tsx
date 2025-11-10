import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'checked in':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

interface Reservation {
  id: number;
  guest_name: string;
  hotel_name: string;
  check_in: string;
  guests: number;
  status: string;
  created_at: string;
}

interface ReservationTableProps {
  data?: Reservation[];
}

export function ReservationTable({ data = [] }: ReservationTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-lg overflow-hidden max-h-[120px]">
      <Table >
        <TableHeader className="text-xs">
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900">ID</TableHead>
            <TableHead className="font-semibold text-gray-900">Guest</TableHead>
            <TableHead className="font-semibold text-gray-900">Hotel</TableHead>
            <TableHead className="font-semibold text-gray-900">Check In</TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                No recent reservations
              </TableCell>
            </TableRow>
          ) : (
            data.map((res) => (
              <TableRow key={res.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium text-gray-900">#{res.id}</TableCell>
                <TableCell className="text-gray-700">{res.guest_name}</TableCell>
                <TableCell className="text-gray-600 text-sm">{res.hotel_name}</TableCell>
                <TableCell className="text-gray-600 text-sm">{formatDate(res.check_in)}</TableCell>
                <TableCell>
                  <StatusBadge status={res.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}