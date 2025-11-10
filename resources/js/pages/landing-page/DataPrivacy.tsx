import PrivacyPolicy from '@/components/privacypolicy';
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
import { LogOut, NotebookTabs, User, UserRoundCog } from 'lucide-react';

// Public NavBar Component
const PublicNavBar = ({ role }: { role: number }) => {
    const handleLogout = () => {
        router.post(route('logout'));
        router.flushAll();
    };

    return (
        <nav className="w-full bg-[#18371e] text-white">
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
                                    className="hover:bg-opacity-10 rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                >
                                    Home
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* Accommodations Dropdown */}
                            <NavigationMenuItem value="accommodations">
                                <NavigationMenuTrigger className="hover:bg-opacity-10 data-[state=open]:bg-opacity-10 rounded border-none bg-transparent px-4 py-2 text-white transition-colors duration-200 hover:bg-white data-[state=open]:bg-white">
                                    Accommodations
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="w-64 rounded-md bg-green-600 p-2">
                                        <NavigationMenuLink
                                            href="/accommodations/landing-area"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                        >
                                            Landing Area
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/accommodations/hotel-landing-area"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                        >
                                            Hotel/Landing Area
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/accommodations/restaurant-landing-area"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                        >
                                            Restaurant/Landing Area
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/accommodations/resort-landing-area"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                        >
                                            Resort/Landing Area
                                        </NavigationMenuLink>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Pagsanjan Falls Boat Tour */}
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/boat-tour"
                                    className="hover:bg-opacity-10 rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                >
                                    Pagsanjan Falls Boat Tour
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* About Us Dropdown */}
                            <NavigationMenuItem value="about">
                                <NavigationMenuTrigger className="hover:bg-opacity-10 data-[state=open]:bg-opacity-10 rounded border-none bg-transparent px-4 py-2 text-white transition-colors duration-200 hover:bg-white data-[state=open]:bg-white">
                                    About Us
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="w-48 rounded-md bg-green-600 p-2">
                                        <NavigationMenuLink
                                            href="/promo"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                        >
                                            Promo
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/contacts"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                        >
                                            Contacts
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/reviews"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                        >
                                            Reviews
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            href="/about-website"
                                            className="hover:bg-opacity-10 block rounded px-4 py-2 text-white transition-colors duration-200 hover:bg-white"
                                        >
                                            About Website
                                        </NavigationMenuLink>
                                    </div>
                                </NavigationMenuContent>
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
                                    <DropdownMenuItem className="text-xs">
                                        <UserRoundCog />
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-xs">
                                        <NotebookTabs />
                                        Bookings
                                    </DropdownMenuItem>
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

// Contact Section Component
const ContactSection = () => {
    return (
        <section className="bg-gray-900 py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-3">
                    <div>
                        <h3 className="mb-6 text-2xl font-semibold">Visit Us Today</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-green-400">Address</h4>
                                <p className="text-gray-300">
                                    Pagsanjan Falls Resort
                                    <br />
                                    Barangay Pinagsanjan, Laguna
                                    <br />
                                    Philippines
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-400">Phone</h4>
                                <p className="text-gray-300">+63 XXX XXX XXXX</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-400">Email</h4>
                                <p className="text-gray-300">info@pagsanjanfallsresort.com</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-6 text-2xl font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-300 transition-colors hover:text-green-400">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 transition-colors hover:text-green-400">
                                    Accommodations
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 transition-colors hover:text-green-400">
                                    Boat Tours
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 transition-colors hover:text-green-400">
                                    Gallery
                                </a>
                            </li>
                            <li>
                                <a href="/data-privacy" className="text-gray-300 transition-colors hover:text-green-400">
                                    Data Privacy
                                </a>
                            </li>
                            <li>
                                <a href="/terms-conditions" className="text-gray-300 transition-colors hover:text-green-400">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 transition-colors hover:text-green-400">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-2xl font-semibold">Newsletter</h3>
                        <p className="mb-4 text-gray-300">Subscribe for updates on special offers and events</p>
                        <div className="flex">
                            <input type="email" placeholder="Your email" className="flex-1 rounded-l-md px-4 py-2 text-gray-900" />
                            <button className="rounded-r-md bg-green-600 px-6 py-2 transition-colors hover:bg-green-700">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400">&copy; 2025 Pagsanjan Falls Resort. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
};

// Main Component
const DataPrivacyPage = ({ role }: { role: number }) => {
    return (
        <div className="relative">
            <div className="fixed top-0 right-0 left-0 z-50">
                <PublicNavBar role={role} />
            </div>

            {/* Add padding to prevent content from hiding under fixed navbar */}
            <div className="pt-16">
                <PrivacyPolicy />
                <ContactSection />
            </div>
        </div>
    );
};

export default DataPrivacyPage;
