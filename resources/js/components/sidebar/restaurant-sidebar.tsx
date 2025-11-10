import { NavItem } from '@/types';
import { CalendarCheck, Table } from 'lucide-react';
import { NavMain } from '../nav-main';
import { SidebarContent } from '../ui/sidebar';

const mainNavItems: NavItem[] = [
    {
        title: 'Table Management',
        href: '/restaurant-portal',
        icon: Table,
    },
    {
        title: 'Bookings',
        href: '/restaurant-bookings',
        icon: CalendarCheck,
    },
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

export default function RestaurantSidebar() {
    return (
        <SidebarContent className="bg-[#275430] text-white">
            <NavMain items={mainNavItems} subtitle="Restaurant Panel" />
        </SidebarContent>
    );
}
