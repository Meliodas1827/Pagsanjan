import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Calendar from './component/Calendar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Resort Schedule', href: '/resort-schedule' },
];


export default function ResortSchedule() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className='my-4 mx-4'>
                <Calendar />
            </div>
        </AppLayout>
    );
}
