import { NavItem } from '@/types';
import { ImageIcon, LayoutGrid, MessageSquare, QrCode } from 'lucide-react';
import { NavMain } from '../nav-main';
import { SidebarContent } from '../ui/sidebar';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/landing-area-dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Customer Requests',
        href: '/landing-area-requests',
        icon: MessageSquare,
    },
    {
        title: 'Landing Area Images',
        href: '/landing-area-images',
        icon: ImageIcon,
    },
    {
        title: 'Payment QR',
        href: '/landing-area-payment-qr',
        icon: QrCode,
    },
    {
        title: 'Feedbacks',
        href: '/feedbacks',
        icon: MessageSquare,
    },
];

export default function LandingAreaSidebar() {
    return (
        <SidebarContent className="bg-[#275430] text-white">
            <NavMain items={mainNavItems} subtitle="Landing Area Panel" />
        </SidebarContent>
    );
}
