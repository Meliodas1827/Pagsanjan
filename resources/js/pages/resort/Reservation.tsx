import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bell, BedDouble } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Reservation', href: '/resort-reservation' },
];

// Sample data
const todayReservations = [
  { guest: 'Ben Aguas', conf: '98245', room: '10', status: 'Confirmed' },
  { guest: 'Roy Magua', conf: '98246', room: '15', status: 'Confirmed' },
  { guest: 'Nash Endio', conf: '98247', room: '24', status: 'Confirmed' },
];

const todayActivity = [
  { guest: 'Andrea B. Borja', payment: '4,936', checkIn: '2/07/25', nights: 2 },
  { guest: 'Israel B. Bautista', payment: '4,000', checkIn: '2/07/25', nights: 3 },
  { guest: 'Rose San Isidro', payment: '5,700', checkIn: '2/07/25', nights: 4 },
];

export default function ResortRevenue() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Resort Reservation" />
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-800'>February 07, 2025</h1>
          <Button className='bg-teal-700 hover:bg-teal-800 text-white px-6'>
            New Reservation
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className='grid grid-cols-2 gap-6'>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">21</p>
                  <p className="text-gray-600 mt-1">Arrivals</p>
                </div>
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">18</p>
                  <p className="text-gray-600 mt-1">Rooms Occupied</p>
                </div>
                <BedDouble className='h-8 w-8 text-gray-400'/>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-2 gap-6'>
          {/* Reservations Section */}
          <Card>
       
         
          
            <CardContent >
                     <CardTitle >RESERVATIONS</CardTitle>

              <Tabs defaultValue="arrivals" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-none">
                  <TabsTrigger value="arrivals" className="data-[state=active]:bg-white">Arrivals</TabsTrigger>
                  <TabsTrigger value="today" className="data-[state=active]:bg-white border-b-2 border-teal-600 data-[state=active]:border-teal-600">Today</TabsTrigger>
                </TabsList>
                
                <TabsContent value="arrivals" className="mt-0">
                  <div className="p-4">
                    <p className="text-gray-500">Arrivals content here...</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="today" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="font-semibold text-gray-900">Guest</TableHead>
                        <TableHead className="font-semibold text-gray-900">Conf #</TableHead>
                        <TableHead className="font-semibold text-gray-900">Room</TableHead>
                        <TableHead className="font-semibold text-gray-900">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayReservations.map((reservation, index) => (
                        <TableRow key={index} className="border-b">
                          <TableCell className="font-medium text-teal-700">{reservation.guest}</TableCell>
                          <TableCell>{reservation.conf}</TableCell>
                          <TableCell>{reservation.room}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                              {reservation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="text-xs">
                              Check In
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Today's Activity Section */}
          <Card>
       
          
            <CardContent >
              <CardTitle >TODAY'S ACTIVITY</CardTitle>

              <Tabs defaultValue="sales" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-none">
                  <TabsTrigger value="sales" className="data-[state=active]:bg-white border-b-2 border-teal-600 data-[state=active]:border-teal-600">Sales</TabsTrigger>
                  <TabsTrigger value="cancellation" className="data-[state=active]:bg-white">Cancellation</TabsTrigger>
                  <TabsTrigger value="overbookings" className="data-[state=active]:bg-white">Overbookings</TabsTrigger>
                </TabsList>
                
                {/* Sales Tab Stats */}
                <div className="grid grid-cols-3 text-center py-4 bg-gray-50 border-b">
                  <div>
                    <p className="text-2xl font-bold text-teal-700">3</p>
                    <p className="text-sm text-gray-600">Booked Today</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">9</p>
                    <p className="text-sm text-gray-600">Room Nights</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                    <p className="text-sm text-gray-600">Fully Paid or not fully paid yet</p>
                  </div>
                </div>
                
                <TabsContent value="sales" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="font-semibold text-gray-900">Guest</TableHead>
                        <TableHead className="font-semibold text-gray-900">Payment</TableHead>
                        <TableHead className="font-semibold text-gray-900">Check In</TableHead>
                        <TableHead className="font-semibold text-gray-900">Nights</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayActivity.map((activity, index) => (
                        <TableRow key={index} className="border-b">
                          <TableCell className="font-medium text-teal-700">{activity.guest}</TableCell>
                          <TableCell>{activity.payment}</TableCell>
                          <TableCell>{activity.checkIn}</TableCell>
                          <TableCell>{activity.nights}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="cancellation" className="mt-0">
                  <div className="p-4">
                    <p className="text-gray-500">Cancellation content here...</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="overbookings" className="mt-0">
                  <div className="p-4">
                    <p className="text-gray-500">Overbookings content here...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}