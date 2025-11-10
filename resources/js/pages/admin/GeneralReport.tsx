import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PieChartCo from '@/components/charts/piechart';
import DoughnutChartCo from '@/components/charts/doughnutchart';
import BarChartCo from '@/components/charts/barchart';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'General Report',
        href: '/general-report',
    },
];


const pieData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home & Garden', value: 250 },
    { name: 'Sports', value: 200 },
    { name: 'Toys', value: 150 },
];


export const sampleDoughnutData = [
    { name: 'Male', value: 400 },
    { name: 'Female', value: 300 },


];

const barChartData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 2780 },
    { month: 'May', sales: 3890 },
    { month: 'Jun', sales: 4390 },
    { month: 'Jul', sales: 4490 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 2780 },
    { month: 'May', sales: 3890 },
    { month: 'Jun', sales: 4390 },
    { month: 'Jul', sales: 4490 },
];


export default function GeneralReport() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="General Report" />
            <div className='grid grid-cols-4 gap-4 p-4'>
                <div className="col-span-4 lg:col-span-2">
                    {/* Pie Chart */}
                    <PieChartCo data={pieData} title='Booking Source Chart' height={200} outerRadius={100} />

                </div>
                <div className="col-span-4 lg:col-span-2">

                    {/* Pie Chart */}
                    <PieChartCo data={pieData} title='Payment Method Chart' height={200} outerRadius={100} />
                </div>
                <div className="col-span-4 lg:col-span-2">

                    {/* Doughnut Chart */}
                    <DoughnutChartCo
                        data={sampleDoughnutData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        height={200}
                        title='Trips by Gender Chart'
                    />

                </div>
                <div className="col-span-4 lg:col-span-2">

                    {/* Bar Chart */}
                    <BarChartCo
                        data={barChartData}
                        xKey="month"
                        barKey="sales"
                        barColor="#82ca9d"
                        title="Monthly Sales"
                        height={200}
                    />

                </div>
            </div>

        </AppLayout>
    );
}
