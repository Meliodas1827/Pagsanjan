import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PieChartCo from '@/components/charts/piechart';
import { ReservationTable } from '@/pages/admin/component/RecentReservation';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

// Reservation Stats data
const reservationStats = [
  { day: 'MON', newBooking: 45, confirmed: 30, checkIn: 20, checkOut: 65 },
  { day: 'TUE', newBooking: 20, confirmed: 50, checkIn: 70, checkOut: 40 },
  { day: 'WED', newBooking: 35, confirmed: 40, checkIn: 65, checkOut: 70 },
  { day: 'THU', newBooking: 30, confirmed: 35, checkIn: 40, checkOut: 30 },
  { day: 'FRI', newBooking: 90, confirmed: 60, checkIn: 70, checkOut: 50 },
  { day: 'SAT', newBooking: 45, confirmed: 55, checkIn: 60, checkOut: 30 },
  { day: 'SUN', newBooking: 35, confirmed: 40, checkIn: 30, checkOut: 90 },
];

// Week comparison data
const weekComparison = [
  { label: 'New Bookings', lastWeek: 50, thisWeek: 80 },
  { label: 'Confirmed Bookings', lastWeek: 40, thisWeek: 75 },
  { label: 'Check-Ins', lastWeek: 60, thisWeek: 90 },
  { label: 'Check-Outs', lastWeek: 55, thisWeek: 70 },
];

// Pie chart data
const touristTypeData = [
  { name: 'Local Tourists', value: 465 },
  { name: 'Walk-Ins', value: 110 },
  { name: 'Group Tours', value: 135 },
  { name: 'Foreign Tourists', value: 273 },
];

const bookingCompletionData = [
  { name: 'Successfully Completed', value: 68 },
  { name: 'Abandoned', value: 20 },
  { name: 'Delayed', value: 12 },
];

export default function ResortDashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

        {/* Row 1: Today's Schedule + Reservation Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-3">
            <CardContent>
              <CardTitle>Today's Schedule</CardTitle>
              <ReservationTable />
            </CardContent>
          </Card>

          {/* Reservation Stats */}
          <Card className="lg:col-span-2">
            <CardContent>
              <CardTitle>Reservation Stats</CardTitle>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reservationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#555' }}/>
                  <YAxis tick={{ fontSize: 12, fill: '#555' }}/>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newBooking" fill="#faff00" name="New Booking" />
                  <Bar dataKey="confirmed" fill="#80ff00" name="Confirmed Booking" />
                  <Bar dataKey="checkIn" fill="#0080ff" name="Check In" />
                  <Bar dataKey="checkOut" fill="#ff0066" name="Check Out" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* This Week vs Last Week */}
          <Card>
            <CardContent>
              <CardTitle>This Week vs Last Week Booking</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weekComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#555' }}/>
                  <YAxis dataKey="label" type="category" tick={{ fontSize: 10, fill: '#555' }}/>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lastWeek" fill="#4F9DFF" name="Last Week" />
                  <Bar dataKey="thisWeek" fill="#00C49F" name="This Week" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tourist Type */}
          <PieChartCo
            data={touristTypeData}
            height={250}
            outerRadius={60}
            title="Tourist Type"
          />

          {/* Booking Completion */}
          <PieChartCo
            data={bookingCompletionData}
            height={250}
            outerRadius={60}
            title="Booking Completion Rate"
          />
        </div>

      </div>
    </AppLayout>
  );
}
