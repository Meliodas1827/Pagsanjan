import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import LineChartCo from '@/components/charts/linechart';
import AreaChartComponent from './component/AreaChart';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Revenue', href: '/resort-revenue' },
];  

export const lineChartData = [
    { month: 'Jan', value: 4000 },
    { month: 'Feb', value: 3000 },
    { month: 'Mar', value: 2000 },
    { month: 'Apr', value: 2780 },
    { month: 'May', value: 1890 },
    { month: 'Jun', value: 2390 },
    { month: 'Jul', value: 3490 },
    { month: 'Aug', value: 4000 },
    { month: 'Sep', value: 3000 },
    { month: 'Oct', value: 2000 },
    { month: 'Nov', value: 2780 },
    { month: 'Dec', value: 1890 },
];

const lineChartKeys = [
    { key: 'value', color: '#8884d8' },
];
// Reservation Stats data

export default function ResortRevenue() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className='my-4 mx-4'>
          <div className='grid grid-cols-5 gap-4'>
             {/* card */}
             <div className='flex flex-col gap-2 col-span-1'>
                 <Card>
                    <CardContent>
                        <CardTitle>
                            Annual Income
                        </CardTitle>
                         <span className='font-bold'>
                            10,000
                        </span>
                    </CardContent>
                 </Card>
                  <Card>
                    <CardContent>
                        <CardTitle>
                            Monthly Income
                        </CardTitle>
                         <span className='font-bold'>
                            10,000
                        </span>
                    </CardContent>
                 </Card>
                  <Card>
                    <CardContent>
                        <CardTitle>
                            Weekly Income
                        </CardTitle>
                        <span className='font-bold'>
                            10,000
                        </span>
                    </CardContent>
                 </Card>
             </div>

             <div className='col-span-4'>
                <LineChartCo data={lineChartData} lineKeys={lineChartKeys} xKey='month' height={340} title='Value over the time'/>
             </div>
          </div>

          <AreaChartComponent title='Yearly Comparison from 2023 to 2025'/>
      </div>
   
    </AppLayout>
  );
}
