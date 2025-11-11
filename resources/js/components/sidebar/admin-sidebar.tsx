import { NavItem } from '@/types';
import { CalendarCog, ChefHat, Hotel, LayoutGrid, Mail, MapPin, MessageSquare, MountainSnow, SailboatIcon, UserRoundPen } from 'lucide-react';
import { NavMain } from '../nav-main';
import { SidebarContent } from '../ui/sidebar';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Reservation',
        href: '/reservation',
        icon: CalendarCog,
    },
];

// const reportItems: NavItem[] = [
//     {
//         title: 'General Report',
//         href: '/general-report',
//         icon: ChartLine,
//     },
//     {
//         title: 'Tourist Arrival Trend',
//         href: '/tourist-arrival-trend',
//         icon: Plane,
//     },
//     {
//         title: 'Booking Report',
//         href: '/booking-report',
//         icon: NotebookPen,
//     },
//     {
//         title: 'Revenue Report',
//         href: '/revenue-report',
//         icon: HandCoins,
//     },
// ];

const Ubaap: NavItem[] = [
    {
        title: 'UBAAP Revenue',
        href: '/ubaap-revenue',
        icon: SailboatIcon,
    },
];

const other: NavItem[] = [
    {
        title: 'Feedback Report',
        href: '/admin/feedback-report',
        icon: MessageSquare,
    },
];

const settings: NavItem[] = [
    {
        title: 'Email Configuration',
        href: '/email-configuration',
        icon: Mail,
    },
    {
        title: 'Hotel Management',
        href: '/manage-hotels',
        icon: Hotel,
    },
    {
        title: 'Resort Management',
        href: '/manage-resorts',
        icon: MountainSnow,
    },
    {
        title: 'Restaurant',
        href: '/manage-restaurants',
        icon: ChefHat,
    },
    {
        title: 'Landing Area',
        href: '/manage-landing-areas',
        icon: MapPin,
    },
    {
        title: 'Manage Users',
        href: '/manage-users',
        icon: UserRoundPen,
    },
];

export default function AdminSideBar() {
    return (
        <SidebarContent className="bg-[#275430] text-white">
            <NavMain items={mainNavItems} />
            {/* <hr /> */}
            {/* <NavMain items={reportItems} subtitle="Reports" /> */}
            <hr />
            <NavMain items={Ubaap} subtitle="UBAAP" />
            <hr />
            <NavMain items={other} subtitle="Other" />
            <hr />
            <NavMain items={settings} subtitle="Settings" />
        </SidebarContent>
    );
}
