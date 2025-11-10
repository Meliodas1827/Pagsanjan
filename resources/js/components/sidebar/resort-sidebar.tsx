import { NavItem } from '@/types';
import { BookOpen, DollarSign, MessageSquare, QrCode } from 'lucide-react';
import { NavMain } from '../nav-main';
import { SidebarContent } from '../ui/sidebar';

const mainNavItems: NavItem[] = [
    {
        title: 'Bookings',
        href: '/resort-bookings',
        icon: BookOpen,
    },
    {
        title: 'Payment QR',
        href: '/resort-payment-qr',
        icon: QrCode,
    },
    {
        title: 'Entrance Fee',
        href: '/resort-entrance-fee',
        icon: DollarSign,
    },
    {
        title: 'Feedbacks',
        href: '/feedbacks',
        icon: MessageSquare,
    },
];

export default function ResortSidebar() {
    return (
        <SidebarContent className="bg-[#275430] text-white">
            <NavMain items={mainNavItems} subtitle="Resort Panel" />
        </SidebarContent>
    );
}
