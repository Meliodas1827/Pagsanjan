import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import LineChartCo from '@/components/charts/linechart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import HorizontalBarList from '@/pages/admin/component/horizonta-bar-list';
import LatestBookingCard from '@/pages/admin/component/latest-tourist-booking';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tourist Arrival Trend',
        href: '/tourist-arrival-trend',
    },
];

const year = 2024

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

export default function TouristReport() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tourist Arrival Trend" />
            <div className='my-4 mx-4 grid grid-cols-2 gap-4' style={{ minHeight: '84vh' }}>
                <div>
               <div className='flex flex-row gap-2 items-center justify-between mb-4'>
                  <CardTitle className="text-muted-foreground text-md font-bold">
                           Tourist Arrival during {year}
                          </CardTitle>
                    <div className='flex flex-row gap-2'>
                        <Select defaultValue="2025">
                            <SelectTrigger className="w-[120px] cursor-pointer">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="Jan">
                            <SelectTrigger className="w-[120px] cursor-pointer">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Jan">Jan</SelectItem>
                                <SelectItem value="Feb">Feb</SelectItem>
                                <SelectItem value="Mar">Mar</SelectItem>
                                <SelectItem value="Apr">Apr</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    
                    </div>
                 <LineChartCo data={lineChartData} lineKeys={lineChartKeys} xKey='month' height={200} title='Tourist Arrival Trend' />
                    <HorizontalBarList />

                   </div>
                     
                     <div>
                        <LatestBookingCard />
                        
                     </div>
                        

        
            </div>

        </AppLayout>
    );
}

   

