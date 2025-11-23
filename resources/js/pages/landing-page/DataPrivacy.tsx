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
import { useState } from 'react';

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

// Footer Component
const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle subscription logic here
        console.log('Subscribed with email:', email);
        setEmail('');
    };

    return (
        <footer className="bg-[#5a5a5a] py-12 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Column 1 - Logo & Location */}
                    <div className="text-center md:text-left">
                        <div className="mb-4 flex justify-center md:justify-start">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                                <img src="/images/logo.png" alt="Pagsanjan Falls" className="h-12 w-12" />
                            </div>
                        </div>
                        <p className="text-sm text-white/90">
                            Municipality of Pagsanjan,
                            <br />
                            Laguna, Philippines
                        </p>
                    </div>

                    {/* Column 2 - Navigation Links */}
                    <div className="text-start">
                        <nav className="space-y-2">
                            <a
                                href="#about"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                ABOUT US
                            </a>
                            <a
                                href="#activities"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                ACTIVITIES
                            </a>
                            <a
                                href="#contact"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                CONTACT US
                            </a>
                            <a
                                href="#faqs"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                FAQS
                            </a>
                            <a
                                href="/data-privacy"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                PRIVACY POLICY
                            </a>
                            <a
                                href="/terms-conditions"
                                className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                            >
                                TERMS AND CONDITIONS
                            </a>
                        </nav>
                    </div>

                    {/* Column 3 - Newsletter Signup */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold">Be the first to discover exclusive deals. Subscribe now!</h3>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="flex-1 border-0 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#2d5f5d] focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-[#2d5f5d] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d6b68]"
                                >
                                    Subscribe
                                </button>
                            </div>
                            <p className="text-xs text-white/70">
                                By subscribing to our mailing list, you agree with our{' '}
                                <a href="/data-privacy" className="underline hover:text-white">
                                    Privacy Policy
                                </a>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-white/20 pt-8 text-center">
                    <p className="text-sm text-white/70">COPYRIGHT PAGSANJAN FALLS 2025</p>
                </div>
            </div>
        </footer>
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
                <Footer />
            </div>
        </div>
    );
};

export default DataPrivacyPage;
