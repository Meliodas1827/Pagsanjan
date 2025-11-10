import { NavItem } from '@/types';
import { LayoutGrid, MessageSquare, Ship } from 'lucide-react';
import { NavMain } from '../nav-main';
import { SidebarContent } from '../ui/sidebar';

const Ubaap: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/ubaap-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Landing Area Requests',
        href: '/ubaap-landing-area-requests',
        icon: Ship,
    },
    {
        title: 'Assign Boat',
        href: '/boat-bookings',
        icon: Ship,
    },
    {
        title: 'Boat Management',
        href: '/manage-boats',
        icon: Ship,
    },
    {
        title: 'Feedbacks',
        href: '/feedbacks',
        icon: MessageSquare,
    },
];

export default function UbaapSidebar() {
    return (
        <SidebarContent className="bg-[#275430] text-white">
            <NavMain items={Ubaap} subtitle="UBAAP" />
        </SidebarContent>
    );
}
