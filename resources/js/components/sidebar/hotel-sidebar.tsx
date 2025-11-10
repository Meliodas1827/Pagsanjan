import { NavItem } from '@/types';
import { BookCheck, CalendarCog, LayoutGrid, MessageSquare, QrCode } from 'lucide-react';
import { NavMain } from '../nav-main';
import { SidebarContent } from '../ui/sidebar';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Booking Management',
        href: '/booking-management',
        icon: BookCheck,
    },
    {
        title: 'Room Management',
        href: '/room-management',
        icon: CalendarCog,
    },
    {
        title: 'Payment QR Code',
        href: '/payment-qrcode',
        icon: QrCode,
    },
    {
        title: 'Feedbacks',
        href: '/feedbacks',
        icon: MessageSquare,
    },
    // {
    //     title: 'Guest Information',
    //     href: '/hotel-guest-information',
    //     icon: ContactRound,
    // },
    // {
    //     title: 'General Report',
    //     href: '/hotel-general-report',
    //     icon: ChartLine,
    // },
    // {
    //     title: 'Message',
    //     href: '/message',
    //     icon: MessageSquare,
    // },
    // {
    //     title: 'Feedback',
    //     href: '/feedback',
    //     icon: Star,
    // },
];

export default function HotelSidebar() {
    return (
        <SidebarContent className="bg-[#275430] text-white">
            <NavMain items={mainNavItems} subtitle="Reports" />
        </SidebarContent>
    );
}
