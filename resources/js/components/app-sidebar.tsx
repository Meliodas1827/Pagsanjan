import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';
import AdminSideBar from './sidebar/admin-sidebar';
import HotelSidebar from './sidebar/hotel-sidebar';
import ResortSidebar from './sidebar/resort-sidebar';
import LandingAreaSidebar from './sidebar/landing-area-sidebar';
import RestaurantSidebar from './sidebar/restaurant-sidebar';
import UbaapSidebar from './sidebar/ubaap';

const roleSidebar = {
    1: <AdminSideBar />,
    4: <ResortSidebar />,
    5: <UbaapSidebar />,
    6: <HotelSidebar />,
    7: <RestaurantSidebar />,
    8: <LandingAreaSidebar />,
};

export function AppSidebar() {
    const Page = usePage<SharedData>();
    const { auth } = Page.props;
    const role = auth.user.role_id as keyof typeof roleSidebar;

    // Determine dashboard link based on role
    const dashboardLink =
        auth.user.role_id === 7 ? '/restaurant-portal' :
        auth.user.role_id === 8 ? '/landing-area-dashboard' :
        '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader className="rounded-t-md bg-[#18371e] text-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardLink} prefetch className="flex items-center gap-3">
                                <AppLogo role={auth.user.role_id} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* sidebarcontent */}
            {roleSidebar[role] ?? null}

            <SidebarFooter className="rounded-b-md bg-[#18371e] text-white">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
