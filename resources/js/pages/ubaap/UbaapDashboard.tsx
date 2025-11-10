import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarRange, Users, ChartNoAxesCombined, CalendarClock } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const contentCard = [
    { title: `This Month's Total Schedule`, value: 500, logo: <CalendarRange />, color: 'red' },
    { title: `Today's Schedule`, value: 1000, logo: <CalendarClock />, color: 'green' },
    { title: `Today's Income`, value: 20, logo: <ChartNoAxesCombined />, color: 'yellow' },
    { title: 'Tourist Check in', value: 40, logo: <Users />, color: 'blue' }

];


export default function UbaapDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className='my-4 mx-4'>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {contentCard.map((item, index) => (
                        <Card key={index}>
                            <CardContent>
                                <CardTitle className='text-slate-800 text-sm'>
                                    <div className='flex flex-row items-center gap-2'>
                                        <div className={`p-2 rounded-md border-1`}>
                                            {item.logo}

                                        </div>

                                        <span>
                                            {item.title}
                                        </span>
                                    </div>


                                </CardTitle>
                                <h1 className='text-center my-3 font-bold'>
                                    {/* value */}
                                    {item.value.toLocaleString()}
                                </h1>
                            </CardContent>
                        </Card>
                    ))}

                </div>





                <div className='grid grid-cols-2 gap-4 mt-4'>

                    <Card style={{ minHeight: '90vh', maxHeight: '90vh' }}>
                        <CardContent>
                            <CardTitle>
                                Upcoming Boat Rides
                            </CardTitle>



                        </CardContent>

                    </Card>
                    <Card style={{ minHeight: '90vh', maxHeight: '90vh' }}>
                        <CardContent>
                            <CardTitle>
                                Today's Schedule
                            </CardTitle>




                        </CardContent>

                    </Card>

                </div>
            </div>




        </AppLayout>
    );
}
