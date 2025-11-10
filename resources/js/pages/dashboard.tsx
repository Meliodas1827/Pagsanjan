import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { JSX } from 'react';
import AdminDashboard from './admin/AdminDashboard';
import CustomerDashboard from './customer/CustomerDashboard';
import HotelDashboard from './hotel/HotelDashboard';
import ResortDashboard from './resort/ResortDashboard';
import UbaapDashboard from './ubaap/UbaapDashboard';

export default function Dashboard() {
    const Page = usePage<SharedData>();
    const { auth } = Page.props;
    const dashboards: Record<number, JSX.Element> = {
        1: <AdminDashboard />,
        3: <CustomerDashboard />,
        4: <ResortDashboard />,
        5: <UbaapDashboard />,
        6: <HotelDashboard hotelName={auth.user.name} />,
    };

    return <>{dashboards[auth.user.role_id]}</>;
}
