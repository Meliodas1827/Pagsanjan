import { SidebarContent } from "../ui/sidebar";
import { NavMain } from "../nav-main";
import { NavItem } from "@/types";
import { CalendarClock, CalendarArrowDown, ContactRound, HandCoins, ChartLine, LayoutGrid, CalendarCog, Star, MessageSquare } from 'lucide-react';



const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Calendar Schedule',
        href: '/resort-schedule',
        icon: CalendarCog,
    },    {
        title: 'Revenue',
        href: '/resort-revenue',
        icon: HandCoins,
    },
        {
        title: 'Reservation',
        href: '/resort-reservation',
        icon: CalendarClock,
    },
          {
        title: 'Payment',
        href: '/resort-payment',
        icon: HandCoins,
    },
     {
        title: 'Message',
        href: '/message',
        icon: MessageSquare,
    },    
     {
        title: 'Booking Information',
        href: '/resort-booking-information',
        icon: CalendarArrowDown,
    },   
     {
        title: 'Guest Information',
        href: '/resort-guest-information',
        icon: ContactRound,
    },    
     {
        title: 'Feedback',
        href: '/feedback',
        icon: Star,
    }

];





export default function LandingSidebar() {
    return (
        <SidebarContent>
            <NavMain items={mainNavItems} subtitle='Reports' />
        </SidebarContent>
    );
}