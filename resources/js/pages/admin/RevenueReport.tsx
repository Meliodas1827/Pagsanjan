import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Rainbow, ChartLine, ChartNoAxesCombined, Image } from 'lucide-react';
import { JSX } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Revenue Report',
        href: '/revenue-report',
    },
];


export interface ContentCardItem {
    title: string;
    value: number;
    logo: JSX.Element;
}

const contentCard: ContentCardItem[] = [
    { title: 'Booking Revenue', value: 10000, logo: <ChartNoAxesCombined /> },
    { title: 'Seeking Today', value: 15000, logo: <Rainbow /> },
    { title: `Monthly Target`, value: 20000, logo: <ChartLine /> },
];

export default function BookingReport() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revenue Report" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {contentCard.map((item, index) => {
                        return (
                            <Card key={index} >
                                <CardContent>
                                    <CardTitle className="text-slate-800 text-sm">
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <span>{item.title}</span>
                                            <div
                                                className={`p-2 rounded-md border-1 `}
                                            >
                                                {item.logo}
                                            </div>
                                        </div>
                                    </CardTitle>
                                    <div className='flex flex-row items-center justify-between'>
                                        <h1 className="text-start font-bold">
                                            {item.value.toLocaleString()}
                                        </h1>
                                        <span className='text-green-700 text-xs font-bold'>
                                            +100%
                                        </span>
                                    </div>



                                </CardContent>
                            </Card>
                        );
                    })}

                </div>
                <div className='grid grid-cols-2 gap-4'>

                    <Card style={{ minHeight: '90vh', maxHeight: '90vh' }}>
                        <CardContent>
                            <div className='flex flex-row items-center justify-between'>
                                <CardTitle>
                                    Active Landing Area / Restaurant
                                </CardTitle>
                                <span className='text-sm text-blue-500 font-bold cursor-pointer'>View all</span>

                            </div>
                            <div className='w-full h-20 bg-slate-200 rounded-lg'>
                                <div className="flex flex-col gap-2 items-center justify-center my-4 bg-blue-200 p-2 rounded-2xl">
                                    <Image size={40} />
                                    <span className="text-center text-sm font-bold">
                                        Place Title
                                    </span>
                                </div>
                            </div>


                        </CardContent>

                    </Card>
                    <Card style={{ minHeight: '90vh', maxHeight: '90vh' }}>
                        <CardContent>
                            <div className='flex flex-row items-center justify-between'>
                                <CardTitle>
                                    Active Resort / Hotel
                                </CardTitle>
                                <span className='text-sm text-blue-500 font-bold cursor-pointer'>View all</span>

                            </div>
                            <div className="flex flex-col gap-2 items-center justify-center my-4 bg-blue-200 p-2 rounded-2xl">
                                <Image size={40} />
                                <span className="text-center text-sm font-bold">
                                    Place Title
                                </span>
                            </div>

                        </CardContent>

                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
