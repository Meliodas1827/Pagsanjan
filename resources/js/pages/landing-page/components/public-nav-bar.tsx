import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link, router } from '@inertiajs/react';
import { LogOut, User, UserRoundCog } from 'lucide-react';
import React from 'react';

interface navProps {
    role: number;
}

const PublicNavBar: React.FC<navProps> = ({ role }) => {
    const handleLogout = () => {
        router.post(route('logout'));
        router.flushAll();
    };

    // Check if we're on the landing page to determine link behavior
    const isLandingPage = window.location.pathname === '/';
    const linkPrefix = isLandingPage ? '' : '/';

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#18371e] text-white">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-2">
                        <div className="bg-opacity-20 flex h-12 w-13 items-center justify-center rounded">
                            <img src="/images/logo.png" alt="logo" title="logo" />
                        </div>
                        <div className="font-bold text-white">
                            <div className="text-lg leading-tight">PAGSANJAN</div>
                            <div className="text-sm leading-tight">FALLS RESORT</div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <NavigationMenu className="hidden md:flex" delayDuration={0} viewport={false}>
                        <NavigationMenuList className="space-x-1">
                            {/* Home */}
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/"
                                    className="hover:bg-opacity-10 rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white hover:text-green-900"
                                >
                                    Home
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* Accommodations Dropdown */}
                            <NavigationMenuItem value="accommodations">
                                <NavigationMenuTrigger className="hover:bg-opacity-10 data-[state=open]:bg-opacity-10 rounded border-none bg-transparent px-4 py-2 text-white transition-colors duration-200 hover:bg-white hover:text-green-900 data-[state=open]:bg-white data-[state=open]:text-green-900">
                                    Accommodations
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="w-64 rounded-md bg-green-600 p-2">
                                        <NavigationMenuLink
                                            href="/landing-areas"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white hover:text-green-900"
                                        >
                                            Landing Area
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/hotel-list"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white hover:text-green-900"
                                        >
                                            Hotel
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/restaurant-list"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white hover:text-green-900"
                                        >
                                            Restaurant
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/resort-list"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white hover:text-green-900"
                                        >
                                            Resort
                                        </NavigationMenuLink>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* About Us */}
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href={`${linkPrefix}#about`}
                                    className="hover:bg-opacity-10 rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white hover:text-green-900"
                                >
                                    About Us
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right Side Buttons */}
                    {!role ? (
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/login"
                                className="hover:bg-opacity-10 hidden rounded-md border-1 border-white bg-white px-2 py-1 text-sm font-bold text-green-900 hover:bg-white hover:text-green-900 sm:inline-flex"
                            >
                                Book Now
                            </Link>
                            <Link
                                href="/register"
                                className="hover:bg-opacity-10 hidden rounded-md border-1 border-white bg-transparent px-2 py-1 text-sm font-bold text-white hover:bg-white hover:text-green-900 sm:inline-flex"
                            >
                                Register
                            </Link>
                        </div>
                    ) : role && role === 3 ? (
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/my-bookings"
                                className="hidden rounded-md border-1 border-white bg-white px-2 py-1 text-sm font-bold text-black hover:bg-green-900 hover:text-white sm:inline-flex"
                            >
                                Bookings
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <User className="h-7 w-7 cursor-pointer rounded-full bg-slate-200 p-1 text-black" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40 font-bold" align="end">
                                    <Link href="/account">
                                        <DropdownMenuItem className="text-xs">
                                            <div className="flex gap-2">
                                                <UserRoundCog />
                                                Account
                                            </div>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem className="cursor-pointer text-xs text-destructive" onClick={handleLogout}>
                                        <LogOut className="text-destructive" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/dashboard"
                                className="hidden rounded-md border-1 border-white bg-white px-2 py-1 text-sm font-bold text-black hover:bg-green-900 hover:text-white sm:inline-flex"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PublicNavBar;
