import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import AnimatedContent from '@/pages/admin/fx/animatedcontent';
import Magnet from '@/pages/admin/fx/magnet';
import SplitText from '@/pages/admin/fx/splittext';
import { Link, router, useForm } from '@inertiajs/react';
import { LogOut, Sailboat, User, UserRoundCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Your Navigation Component
const PublicNavBar = ({ role }: { role: number }) => {
    const handleLogout = () => {
        router.post(route('logout'));
        router.flushAll();
    };

    // Check if we're on the landing page to determine link behavior
    const isLandingPage = window.location.pathname === '/';
    const linkPrefix = isLandingPage ? '' : '/';

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

const handleAnimationComplete = () => {
    console.log('All letters have animated!');
};

// Hero Section Component
const HeroSection = () => {
    return (
        <div className="fixed top-0 left-0 z-0 h-screen w-full">
            <div className="relative h-full w-full">
                <img src="/images/mainbg.jpg" alt="Pagsanjan Falls Hero" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div className="max-w-2xl px-4">
                        <SplitText
                            text="Pagsanjan Falls"
                            className="mb-4 text-center text-3xl font-semibold md:text-7xl"
                            delay={100}
                            duration={0.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: -10 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                            onLetterAnimationComplete={handleAnimationComplete}
                        />

                        <SplitText
                            text="Experience the adventure of a lifetime with our world-famous boat tours"
                            className="mb-8 text-xl font-light md:text-2xl"
                            delay={100}
                            duration={2}
                            ease="power3.out"
                            splitType="words"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.3}
                            rootMargin="-100px"
                            textAlign="center"
                            onLetterAnimationComplete={handleAnimationComplete}
                        />

                        <Magnet padding={300} disabled={false} magnetStrength={5}>
                            <button
                                onClick={() => {
                                    document.getElementById('bookSection')?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start',
                                    });
                                }}
                                className="rounded-md bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700"
                            >
                                Book Your Adventure
                            </button>
                        </Magnet>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sliding Images Component
const SlidingGallery = () => {
    const images = ['/images/couple.png', '/images/res.png', '/images/download.png', '/images/bamboo.png'];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative h-96 overflow-hidden rounded-lg">
            <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((img, index) => (
                    <div key={index} className="h-full min-w-full">
                        <img src={img} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                ))}
            </div>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`h-3 w-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-opacity-50 bg-white'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

// About Section Component
const AboutSection = () => {
    const galleryImages = [
        { src: '/images/couple.png', alt: 'Couple enjoying the tour' },
        { src: '/images/download.png', alt: 'Waterfall view' },
        { src: '/images/res.png', alt: 'Restaurant' },
        { src: '/images/bamboo.png', alt: 'Bamboo scenery' },
        { src: '/images/bed.png', alt: 'Comfortable rooms' },
        { src: '/images/pool.png', alt: 'Swimming pool' },
        { src: '/images/room.png', alt: 'Resort room' },
    ];

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollContainerRef, setScrollContainerRef] = useState<HTMLDivElement | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollContainerRef) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.offsetLeft);
        setScrollLeft(scrollContainerRef.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <section id="about" className="scroll-mt-16 bg-[#093517] py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-light text-white">Pagsanjan Falls Resort</h2>
                    <p className="mx-auto text-sm text-white">
                        Hidden in the heart of Laguna, Pagsanjan Falls is a breathtaking natural wonder that offers an unforgettable adventure for
                        every traveler. Experience the thrill of the legendary boat ride, guided by skilled boatmen who navigate through scenic river
                        rapids, leading to the majestic three-tiered waterfall. Surrounded by lush greenery and towering rock formations, Pagsanjan
                        Falls is more than just a tourist destination—it's a gateway to nature, culture, and sustainable ecotourism. With the support
                        of local resorts and the United Boatmen Association of Pagsanjan (UBAP), every visit contributes to the preservation of this
                        iconic landmark and the livelihood of the community.
                    </p>

                    <br />
                    <p className="mx-auto max-w-3xl text-sm font-bold text-white">
                        Create a wonderful and meaningful experience with your friends, family and loved ones and even yourself
                    </p>
                </div>

                {/* Draggable Gallery */}
                <div className="relative">
                    <div
                        ref={setScrollContainerRef}
                        className="cursor-grab overflow-x-scroll active:cursor-grabbing"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                        <style>
                            {`
                                .overflow-x-scroll::-webkit-scrollbar {
                                    display: none;
                                }
                            `}
                        </style>
                        <div className="flex gap-4 pb-4 select-none">
                            {galleryImages.map((image, index) => (
                                <AnimatedContent
                                    key={index}
                                    distance={150}
                                    direction="vertical"
                                    reverse={false}
                                    duration={1.2}
                                    ease="power3.out"
                                    initialOpacity={0.2}
                                    animateOpacity
                                    scale={1.1}
                                    threshold={0.2}
                                    delay={0.1 * index}
                                >
                                    <div className="w-72 flex-shrink-0">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="pointer-events-none h-56 w-full rounded-lg object-cover shadow-lg transition-transform hover:scale-105"
                                            draggable="false"
                                        />
                                    </div>
                                </AnimatedContent>
                            ))}
                        </div>
                    </div>

                    {/* Drag indicator */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-white/60">← Drag to view more →</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Experience Section Component
const ExperienceSection = () => {
    const experiences = [
        {
            image: '/images/room.png',
            title: 'Luxurious Accommodations',
            description:
                'Rest in comfort after your adventure. Our rooms feature modern amenities, plush bedding, and stunning views of the surrounding nature.',
        },
        {
            image: '/images/res.png',
            title: 'Authentic Local Cuisine',
            description:
                'Savor the flavors of Laguna with our carefully crafted dishes. Fresh ingredients and traditional recipes bring you the best of Filipino hospitality.',
        },
        {
            image: '/images/pool.png',
            title: 'Resort Relaxation',
            description:
                'Unwind by our pristine pool surrounded by tropical gardens. Perfect for families and groups seeking relaxation and fun under the sun.',
        },
    ];

    return (
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900">Experience Paradise</h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                        Discover the perfect blend of adventure, comfort, and authentic Filipino hospitality
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {experiences.map((experience, index) => (
                        <AnimatedContent
                            key={index}
                            distance={100}
                            direction="vertical"
                            reverse={false}
                            duration={1}
                            ease="power3.out"
                            initialOpacity={0}
                            animateOpacity
                            scale={1.05}
                            threshold={0.2}
                            delay={0.1 * index}
                        >
                            <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-2xl">
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={experience.image}
                                        alt={experience.title}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-3 text-xl font-bold text-gray-900">{experience.title}</h3>
                                    <p className="text-gray-600">{experience.description}</p>
                                </div>
                            </div>
                        </AnimatedContent>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Mini Feature Section Component
const MiniFeatureSection = () => {
    return (
        <section className="bg-[#062d19] py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    <AnimatedContent
                        distance={100}
                        direction="horizontal"
                        reverse={false}
                        duration={1}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        threshold={0.3}
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-white">Discover the Adventure of a Lifetime</h2>
                            <p className="text-base leading-relaxed text-white">
                                Navigate through the stunning rapids of Pagsanjan Falls with our expert boatmen. Experience the thrill of the journey
                                as you make your way through lush tropical scenery, towering rock formations, and pristine waters.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 text-sm text-white">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Expert Local Guides</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Safe & Memorable</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Eco-Friendly Tourism</span>
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent
                        distance={100}
                        direction="horizontal"
                        reverse={true}
                        duration={1}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        threshold={0.3}
                    >
                        <div className="relative h-64 overflow-hidden rounded-2xl shadow-2xl lg:h-80">
                            <img
                                src="/images/bamboo.png"
                                alt="Pagsanjan Adventure"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                    </AnimatedContent>
                </div>
            </div>
        </section>
    );
};

// Gallery Cards Section Component
const GalleryCardsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const galleryCards = [
        {
            image: '/images/room.png',
            title: 'Hotel Rooms',
            description: 'Experience comfort and luxury in our well-appointed hotel rooms with modern amenities and stunning views.',
            buttonText: 'Explore Rooms',
            link: '/hotel-list',
        },
        {
            image: '/images/bamboo.png',
            title: 'Landing Areas',
            description: 'Discover scenic boat ride destinations and explore the natural beauty of Pagsanjan from the water.',
            buttonText: 'View Destinations',
            link: '/landing-areas',
        },
        {
            image: '/images/res.png',
            title: 'Restaurant',
            description: 'Indulge in authentic Filipino cuisine prepared with fresh local ingredients and traditional recipes.',
            buttonText: 'See Menu',
            link: '/restaurant-list',
        },
        {
            image: '/images/pool.png',
            title: 'Resort',
            description: 'Relax and unwind at our beautiful resort facilities featuring pools, gardens, and recreational amenities.',
            buttonText: 'Learn More',
            link: '/resort-list',
        },
        // {
        //     image: '/images/download.png',
        //     title: 'Boat Tours',
        //     description: 'Embark on an unforgettable journey through the rapids with our expert boatmen and traditional bancas.',
        //     buttonText: 'Book a Tour',
        //     link: '#boat',
        // },
    ];

    const itemsPerView = 3;
    const totalCards = galleryCards.length;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalCards);
    };

    return (
        <section className="bg-gray-100 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900">Explore Our Offerings</h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                        From comfortable accommodations to thrilling adventures, discover everything we have to offer
                    </p>
                </div>

                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        aria-label="Previous cards"
                    >
                        <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        aria-label="Next cards"
                    >
                        <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Cards Container */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                            }}
                        >
                            {galleryCards.map((card, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/3">
                                    <AnimatedContent
                                        distance={80}
                                        direction="vertical"
                                        reverse={false}
                                        duration={0.8}
                                        ease="power3.out"
                                        initialOpacity={0}
                                        animateOpacity
                                        scale={1.03}
                                        threshold={0.1}
                                        delay={0.1 * (index % itemsPerView)}
                                    >
                                        <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-2xl">
                                            <div className="aspect-[2/3] overflow-hidden">
                                                <img
                                                    src={card.image}
                                                    alt={card.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                />
                                            </div>
                                            <div className="space-y-3 p-6">
                                                <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                                                <p className="line-clamp-2 text-sm text-gray-600">{card.description}</p>
                                                <a
                                                    href={card.link}
                                                    className="block w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-lg"
                                                >
                                                    {card.buttonText}
                                                </a>
                                            </div>
                                        </div>
                                    </AnimatedContent>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="mt-8 flex justify-center gap-2">
                        {galleryCards.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all ${
                                    currentIndex === index ? 'w-8 bg-green-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to card ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Policies Accordion Section Component
const PoliciesSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const policies = [
        {
            title: 'Reservation',
            content:
                'All reservations must be made in advance through our online booking system or by contacting our front desk. A valid ID and contact information are required. Payment confirmation is needed to secure your reservation. We recommend booking at least 2 weeks in advance during peak seasons.',
        },
        {
            title: 'Cancellation and No Show Policy',
            content:
                'Cancellations made 7 days or more before arrival date will receive a full refund. Cancellations made 3-6 days before arrival will incur a 50% charge. Cancellations within 48 hours or no-shows will be charged the full amount. Refunds will be processed within 14 business days.',
        },
        {
            title: 'Arrival and Departure',
            content:
                'Check-in time is from 2:00 PM onwards. Early check-in may be requested subject to availability. Check-out time is 12:00 PM noon. Late check-out may be arranged with prior notice and additional charges may apply. Please present a valid ID during check-in.',
        },
        {
            title: 'Boat Ride',
            content:
                'Boat rides are operated by the United Boatmen Association of Pagsanjan (UBAP). Life jackets must be worn at all times during the ride. Follow all safety instructions from your boatman. The boat ride is weather-dependent and may be cancelled for safety reasons. Rates include boat rental and boatman fees.',
        },
        {
            title: 'Food and Dining',
            content:
                'Restaurant operating hours: Breakfast 6:00 AM - 10:00 AM, Lunch 11:00 AM - 2:00 PM, Dinner 6:00 PM - 10:00 PM. Outside food is not allowed in the restaurant area. Special dietary requirements should be communicated in advance. Room service is available with additional charges.',
        },
        {
            title: 'Pets',
            content:
                'Pets are allowed in designated areas only with prior approval. Pet owners must keep their pets on a leash at all times. Pet cleaning fees may apply. Owners are responsible for any damage caused by their pets. Vaccination records may be required upon check-in.',
        },
    ];

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleKeyPress = (event: React.KeyboardEvent, index: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleAccordion(index);
        }
    };

    return (
        <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-8 md:px-6 md:py-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-semibold text-slate-700 md:text-3xl">
                        Landing Area / Resort / Restaurant / Hotel & Pagsanjan Policies
                    </h2>
                </div>

                <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                    {policies.map((policy, index) => (
                        <AnimatedContent
                            key={index}
                            distance={60}
                            direction="vertical"
                            reverse={false}
                            duration={0.6}
                            ease="power3.out"
                            initialOpacity={0}
                            animateOpacity
                            threshold={0.1}
                            delay={0.1 * (index % 2)}
                        >
                            <div
                                className={`overflow-hidden rounded-md bg-gray-50 shadow-sm transition-all hover:bg-gray-100 hover:shadow ${
                                    openIndex === index ? 'ring-opacity-20 bg-gray-100 ring-1 ring-[#2F5F5D]' : ''
                                }`}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleAccordion(index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                aria-expanded={openIndex === index}
                                aria-label={`${policy.title} policy`}
                            >
                                <div className="flex cursor-pointer items-center justify-between px-4 py-3">
                                    <h3 className="text-sm font-semibold text-[#2F5F5D] md:text-base">{policy.title}</h3>
                                    <div
                                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2F5F5D] text-white transition-transform duration-300 ${
                                            openIndex === index ? 'rotate-45' : ''
                                        }`}
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                </div>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        openIndex === index ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="border-t border-gray-200 px-4 pt-2.5 pb-3">
                                        <p className="text-xs leading-relaxed font-normal text-gray-700">{policy.content}</p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedContent>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-600">
                        For more information about our policies, please contact our front desk or visit our information center.
                    </p>
                </div>
            </div>
        </section>
    );
};

// Hotel Rooms Section Component with Carousel
const HotelRoomsSection = ({ hotels, role }: { hotels: any[]; role: number }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Determine items per slide based on screen size (we'll show 3 on desktop, 2 on tablet, 1 on mobile)
    const itemsPerSlide = 3;
    const totalSlides = Math.ceil(hotels.length / itemsPerSlide);

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying || hotels.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, totalSlides, hotels.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsAutoPlaying(false); // Stop auto-play when user manually navigates
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        setIsAutoPlaying(false); // Stop auto-play when user manually navigates
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false); // Stop auto-play when user manually navigates
    };

    if (hotels.length === 0) {
        return (
            <section id="bookSection" className="bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-4xl font-light text-gray-900">Our Hotels</h2>
                        <p className="mx-auto max-w-3xl text-xl text-gray-600">Discover our premium hotel accommodations</p>
                    </div>
                    <p className="text-center text-gray-600">No hotels available at the moment.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="hotel" className="scroll-mt-16 bg-[#13431a] py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-white">Our Hotels</h2>
                    <p className="mx-auto max-w-3xl text-xl text-white">Discover our premium hotel accommodations</p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                aria-label="Previous slide"
                            >
                                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                aria-label="Next slide"
                            >
                                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Carousel Track */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div key={slideIndex} className="min-w-full">
                                    <div className="grid gap-8 px-2 md:grid-cols-2 lg:grid-cols-3">
                                        {hotels.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((hotel) => (
                                            <div
                                                key={hotel.id}
                                                className="overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
                                            >
                                                {hotel.image_url ? (
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={hotel.image_url}
                                                            alt={hotel.hotel_name}
                                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-48 w-full items-center justify-center bg-gray-200 text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                                <div className="p-6">
                                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{hotel.hotel_name}</h3>
                                                    <p className="mb-2 text-sm font-medium text-green-600">{hotel.location}</p>
                                                    <p className="mb-4 line-clamp-2 text-gray-600">
                                                        {hotel.description || 'Discover our premium accommodations'}
                                                    </p>
                                                    <Link
                                                        href={`/hotel/${hotel.id}`}
                                                        className="block w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-center font-semibold text-white shadow-md transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-lg"
                                                    >
                                                        Explore
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Indicator Dots */}
                    {totalSlides > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-3 rounded-full transition-all ${
                                        currentSlide === index ? 'w-8 bg-green-600' : 'w-3 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Auto-play indicator */}
                    {totalSlides > 1 && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                className="text-sm text-gray-600 transition-colors hover:text-gray-800"
                            >
                                {isAutoPlaying ? '⏸ Pause Auto-Play' : '▶ Resume Auto-Play'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// Boat Tours Section Component - Request Button Only
const BoatToursSection = ({ role }: { role: number }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        date_of_booking: '',
        ride_time: '',
        no_of_adults: 1,
        no_of_children: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!role) {
            toast.error('Please login to request a boat ride');
            router.visit('/login');
            return;
        }

        post(route('boat.request'), {
            onSuccess: () => {
                toast.success('Boat ride request submitted successfully! UBAAP will assign a boat to your request.');
                setIsModalOpen(false);
                reset();
            },
            onError: () => {
                toast.error('Failed to submit boat ride request. Please try again.');
            },
        });
    };

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-light text-gray-900">Boat Ride Experience</h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                        Request a boat ride and our UBAAP team will assign the best boat for your adventure
                    </p>
                </div>

                <div className="flex justify-center">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 px-12 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
                    >
                        <Sailboat className="mr-2 h-6 w-6" />
                        Request for a Boat Ride
                    </Button>
                </div>

                {/* Boat Request Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-2xl">
                                <Sailboat className="h-6 w-6 text-blue-600" />
                                Request Boat Ride
                            </DialogTitle>
                            <DialogDescription>Fill in your ride details and UBAAP will assign a boat for you</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="date_of_booking">Ride Date</Label>
                                <Input
                                    id="date_of_booking"
                                    type="date"
                                    value={data.date_of_booking}
                                    onChange={(e) => setData('date_of_booking', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {errors.date_of_booking && <p className="mt-1 text-sm text-red-600">{errors.date_of_booking}</p>}
                            </div>

                            <div>
                                <Label htmlFor="ride_time">Ride Time</Label>
                                <Input
                                    id="ride_time"
                                    type="time"
                                    value={data.ride_time}
                                    onChange={(e) => setData('ride_time', e.target.value)}
                                    required
                                />
                                {errors.ride_time && <p className="mt-1 text-sm text-red-600">{errors.ride_time}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="no_of_adults">Adults</Label>
                                    <Input
                                        id="no_of_adults"
                                        type="number"
                                        min="1"
                                        value={data.no_of_adults}
                                        onChange={(e) => setData('no_of_adults', parseInt(e.target.value))}
                                        required
                                    />
                                    {errors.no_of_adults && <p className="mt-1 text-sm text-red-600">{errors.no_of_adults}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="no_of_children">Children</Label>
                                    <Input
                                        id="no_of_children"
                                        type="number"
                                        min="0"
                                        value={data.no_of_children}
                                        onChange={(e) => setData('no_of_children', parseInt(e.target.value))}
                                        required
                                    />
                                    {errors.no_of_children && <p className="mt-1 text-sm text-red-600">{errors.no_of_children}</p>}
                                </div>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> UBAAP will assign the most suitable boat for your group based on availability and capacity
                                    requirements.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        reset();
                                    }}
                                    className="flex-1"
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                    disabled={processing}
                                >
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
};

// Restaurant Section Component
const RestaurantSection = ({ restaurants, role }: { restaurants: any[]; role: number }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerSlide = 3;
    const totalSlides = Math.ceil((restaurants?.length || 0) / itemsPerSlide);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    if (!restaurants || restaurants.length === 0) {
        return null;
    }

    return (
        <section id="restaurant" className="scroll-mt-16 bg-gradient-to-b from-green-50 to-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900">Dine at Our Restaurants</h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                        Experience authentic local cuisine at our partner restaurants with fresh ingredients and traditional recipes
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                aria-label="Previous slide"
                            >
                                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                aria-label="Next slide"
                            >
                                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Carousel Track */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div key={slideIndex} className="min-w-full">
                                    <div className="grid gap-8 px-2 md:grid-cols-2 lg:grid-cols-3">
                                        {restaurants.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((restaurant) => {
                                            const activeTables = restaurant.resto_tables?.filter((t: any) => !t.deleted) || [];
                                            const availableTables = activeTables.filter((t: any) => t.status === 'available');
                                            const totalCapacity = activeTables.reduce((sum: number, table: any) => sum + table.no_of_chairs, 0);

                                            return (
                                                <div
                                                    key={restaurant.id}
                                                    className="overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
                                                >
                                                    {restaurant.img ? (
                                                        <div className="relative h-48 overflow-hidden">
                                                            <img
                                                                src={restaurant.img}
                                                                alt={restaurant.resto_name}
                                                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                                                            <svg
                                                                className="h-16 w-16 text-orange-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="p-6">
                                                        <h3 className="mb-2 text-xl font-semibold text-gray-900">{restaurant.resto_name}</h3>
                                                        <div className="mb-4 space-y-2 text-sm text-gray-600">
                                                            <p className="flex items-center gap-2">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                                    />
                                                                </svg>
                                                                {activeTables.length} Tables Available
                                                            </p>
                                                            <p className="flex items-center gap-2">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                                    />
                                                                </svg>
                                                                Seats {totalCapacity} Guests
                                                            </p>
                                                        </div>
                                                        <div className="mb-4 rounded-lg bg-green-50 p-3">
                                                            <p className="text-sm font-medium text-green-800">
                                                                {availableTables.length} {availableTables.length === 1 ? 'table' : 'tables'} ready for
                                                                booking
                                                            </p>
                                                        </div>
                                                        <Link
                                                            href={`/restaurant/${restaurant.id}`}
                                                            className="block w-full rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3 text-center font-semibold text-white shadow-md transition-all hover:from-orange-700 hover:to-red-700 hover:shadow-lg"
                                                        >
                                                            View Menu & Reserve
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Indicators */}
                    {totalSlides > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-3 w-3 rounded-full transition-all ${
                                        currentSlide === index ? 'w-8 bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/restaurant-list"
                        className="inline-block rounded-lg border-2 border-green-600 px-8 py-3 font-semibold text-green-600 transition-all hover:bg-green-600 hover:text-white"
                    >
                        View All Restaurants
                    </Link>
                </div>
            </div>
        </section>
    );
};

// Resorts Section Component
const ResortsSection = ({ resorts, role }: { resorts: any[]; role: number }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerSlide = 3;
    const totalSlides = Math.ceil((resorts?.length || 0) / itemsPerSlide);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    if (!resorts || resorts.length === 0) {
        return null;
    }

    return (
        <section id="resort" className="scroll-mt-16 bg-gradient-to-b from-emerald-50 to-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900">Stay at Our Resorts</h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                        Relax and unwind at our beautiful resorts with stunning views and modern amenities
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                aria-label="Previous slide"
                            >
                                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                aria-label="Next slide"
                            >
                                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Carousel Track */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div key={slideIndex} className="min-w-full">
                                    <div className="grid gap-8 px-2 md:grid-cols-2 lg:grid-cols-3">
                                        {resorts.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((resort) => (
                                            <div
                                                key={resort.id}
                                                className="overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
                                            >
                                                {resort.img ? (
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={resort.img}
                                                            alt={resort.resort_name}
                                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
                                                        <svg
                                                            className="h-16 w-16 text-emerald-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="p-6">
                                                    <h3 className="mb-4 text-xl font-semibold text-gray-900">{resort.resort_name}</h3>
                                                    <p className="mb-4 text-sm text-gray-600">
                                                        Discover our beautiful resort with stunning views and excellent amenities for your perfect
                                                        getaway.
                                                    </p>
                                                    <Link
                                                        href={role === 3 ? route('customer.resort.show', { id: resort.id }) : '/login'}
                                                        className="block w-full rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-center font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-green-700 hover:shadow-lg"
                                                    >
                                                        {role === 3 ? 'Book Now' : 'Login to Book'}
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Indicators */}
                    {totalSlides > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-3 w-3 rounded-full transition-all ${
                                        currentSlide === index ? 'w-8 bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// Call to Action Section Component
const CallToActionSection = () => {
    return (
        <section className="bg-[#18371e] py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="mb-4 text-4xl font-light text-white">Plan Your Visit</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-xl text-green-100">
                        Ready to experience the adventure of Pagsanjan Falls? Book your boat tour and accommodation with us today.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <button className="rounded-md bg-white px-8 py-3 font-medium text-green-600 transition-colors hover:bg-gray-100">
                            Book Boat Tour
                        </button>
                        <button className="rounded-md border-2 border-white px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-green-600">
                            View Accommodations
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Accommodation Showcase Component
const AccommodationSection = () => {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-6 text-4xl font-light text-gray-900">Comfort Meets Adventure</h2>
                        <p className="mb-6 text-xl text-gray-600">
                            Our resort offers comfortable accommodations ranging from cozy rooms to spacious cottages, all designed to provide you
                            with a relaxing stay after your thrilling boat tour adventure.
                        </p>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <img src="/images/bed.png" alt="Hotel Room" className="mb-3 h-32 w-full rounded-lg object-cover" />
                                <h4 className="font-semibold">Hotel Rooms</h4>
                                <p className="text-sm text-gray-600">Air-conditioned rooms with modern amenities</p>
                            </div>
                            <div>
                                <img src="/images/pool.png" alt="Cottage" className="mb-3 h-32 w-full rounded-lg object-cover" />
                                <h4 className="font-semibold">Family Pool</h4>
                                <p className="text-sm text-gray-600">Spacious pool perfect for groups</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img src="/images/room.png" alt="Resort View" className="w-full rounded-lg shadow-lg" />
                    </div>
                </div>
            </div>
        </section>
    );
};

// Contact & Footer Section Component
const ContactSection = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Contact Information Section */}
            <section className="bg-[#093517] py-16 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold md:text-5xl">Get In Touch With Us</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Column 1 - Tourist Advisory */}
                        <div className="border-r-0 pr-0 md:border-r md:border-white/20 md:pr-8">
                            <h3 className="mb-4 text-xl font-bold">Tourist Advisory</h3>
                            <p className="mb-4 text-sm leading-relaxed font-semibold text-yellow-300">
                                DON'T STOP & DEAL WITH ILLEGAL BOATMEN FLAGGERS RUNNING ALONG THE ROAD!
                            </p>
                            <div className="space-y-3 text-sm">
                                <p className="leading-relaxed">If you experience harassment or overpricing, please contact:</p>
                                <div>
                                    <p className="font-semibold">Tourist Police Force:</p>
                                    <a href="tel:+639178095213" className="text-white/90 hover:text-white hover:underline">
                                        +63 917 809 5213
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Municipal Tourism Office:</p>
                                    <a href="tel:+639176238764" className="text-white/90 hover:text-white hover:underline">
                                        +63 917 623 8764
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 - Hotline Numbers */}
                        <div className="border-r-0 pr-0 md:border-r md:border-white/20 md:pr-8">
                            <h3 className="mb-4 text-xl font-bold">HOTLINE NUMBERS</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="font-semibold">Office of the Mayor</p>
                                    <a href="tel:+63495014355" className="text-white/90 hover:text-white hover:underline">
                                        (049) 501-4355
                                    </a>
                                    {' / '}
                                    <a href="tel:+63495014356" className="text-white/90 hover:text-white hover:underline">
                                        (049) 501-4356
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Tourism, Culture & Arts Office</p>
                                    <a href="tel:+639176238764" className="text-white/90 hover:text-white hover:underline">
                                        +63 917 623 8764
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Pagsanjan Police Station</p>
                                    <a href="tel:+639178095213" className="text-white/90 hover:text-white hover:underline">
                                        +63 917 809 5213
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Pagsanjan Fire Station</p>
                                    <a href="tel:+639989997845" className="text-white/90 hover:text-white hover:underline">
                                        +63 998 999 7845
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Pagsanjan Health Center</p>
                                    <a href="tel:+639178841234" className="text-white/90 hover:text-white hover:underline">
                                        +63 917 884 1234
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Pagsanjan Medical Clinic</p>
                                    <a href="tel:+639175551234" className="text-white/90 hover:text-white hover:underline">
                                        +63 917 555 1234
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Christian General Hospital</p>
                                    <a href="tel:+63495014789" className="text-white/90 hover:text-white hover:underline">
                                        (049) 501-4789
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Laguna AAAWATER Corp</p>
                                    <a href="tel:+63495014200" className="text-white/90 hover:text-white hover:underline">
                                        (049) 501-4200
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">First Laguna Electric Coop</p>
                                    <a href="tel:+63495014300" className="text-white/90 hover:text-white hover:underline">
                                        (049) 501-4300
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Column 3 - GSIS Pagsanjan */}
                        <div>
                            <h3 className="mb-4 text-xl font-bold">GSIS-PAGSANJAN</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <a href="tel:+63495014400" className="text-white/90 hover:text-white hover:underline">
                                        (049) 501-4400
                                    </a>
                                </div>
                                <div className="mt-4">
                                    <p className="font-semibold">Diocesan Shrine of Our Lady of Guadalupe</p>
                                    <a href="tel:+63495014500" className="text-white/90 hover:text-white hover:underline">
                                        (049) 501-4500
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold">Pagsanjan Rescue Team</p>
                                    <a href="tel:+639178095555" className="text-white/90 hover:text-white hover:underline">
                                        +63 917 809 5555
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
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
                                {/*<a
                                    href="#about"
                                    className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                                >
                                    ABOUT US
                                </a>
                                * <a
                                    href="#activities"
                                    className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                                >
                                    ACTIVITIES
                                </a> */}
                                <a
                                    href="/contact-us"
                                    className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]"
                                >
                                    CONTACT US
                                </a>
                                <a href="/faq" className="block text-sm font-semibold tracking-wide uppercase transition-colors hover:text-[#000000]">
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
                                        disabled={loading}
                                        className="flex-1 border-0 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#2d5f5d] focus:outline-none disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-md bg-[#2d5f5d] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3d6b68] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading ? 'Subscribing...' : 'Subscribe'}
                                    </button>
                                </div>
                                {message && (
                                    <p className={`text-sm ${message.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>{message.text}</p>
                                )}
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
        </>
    );
};

// Landing Areas Section Component
const LandingAreasSection = ({ landingAreas, role }: { landingAreas: any[]; role: number }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerSlide = 3;
    const totalSlides = Math.ceil((landingAreas?.length || 0) / itemsPerSlide);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    if (!landingAreas || landingAreas.length === 0) {
        return null;
    }

    return (
        <section id="landing-area" className="scroll-mt-16 bg-gradient-to-b from-blue-50 to-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900">Boat Rides to Landing Areas</h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                        Explore scenic destinations by boat and experience the beauty of Pagsanjan from the water
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                aria-label="Previous slide"
                            >
                                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                aria-label="Next slide"
                            >
                                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Carousel Track */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div key={slideIndex} className="min-w-full">
                                    <div className="grid gap-8 px-2 md:grid-cols-2 lg:grid-cols-3">
                                        {landingAreas.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((landingArea) => (
                                            <div
                                                key={landingArea.id}
                                                className="overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
                                            >
                                                {landingArea.image ? (
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={`/storage/${landingArea.image}`}
                                                            alt={landingArea.name}
                                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                                                        <Sailboat className="h-16 w-16 text-blue-600" />
                                                    </div>
                                                )}
                                                <div className="p-6">
                                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{landingArea.name}</h3>
                                                    {landingArea.description && (
                                                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{landingArea.description}</p>
                                                    )}
                                                    <div className="mb-4 space-y-2 text-sm">
                                                        {landingArea.location && (
                                                            <div className="flex items-center text-gray-700">
                                                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                </svg>
                                                                <span className="truncate">{landingArea.location}</span>
                                                            </div>
                                                        )}
                                                        {landingArea.price && (
                                                            <div className="flex items-center font-semibold text-blue-600">
                                                                <span>₱{landingArea.price} per trip</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {role === 3 ? (
                                                        <Link
                                                            href={`/landing-area/${landingArea.id}/book`}
                                                            className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700"
                                                        >
                                                            Book Boat Ride
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href="/login"
                                                            className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700"
                                                        >
                                                            Login to Book
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Slide Indicators */}
                    {totalSlides > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-3 w-3 rounded-full transition-all ${
                                        index === currentSlide ? 'w-8 bg-blue-600' : 'bg-blue-300 hover:bg-blue-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// Main App Component
const MainComponent = ({
    role,
    hotels = [],
    restaurants = [],
    landingAreas = [],
    resorts = [],
}: {
    role: number;
    hotels?: any[];
    restaurants?: any[];
    landingAreas?: any[];
    resorts?: any[];
}) => {
    // Add smooth scroll behavior
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    return (
        <div className="relative">
            <div className="fixed top-0 right-0 left-0 z-50">
                <PublicNavBar role={role} />
            </div>
            <HeroSection />

            {/* Main content that will scroll over the fixed hero */}
            <div className="mt-screen relative z-10" style={{ marginTop: '100vh' }}>
                <AboutSection />
                <ExperienceSection />
                <MiniFeatureSection />
                <GalleryCardsSection />
                <PoliciesSection />
                {/* <LandingAreasSection landingAreas={landingAreas} role={role} /> */}
                {/* <HotelRoomsSection hotels={hotels} role={role} />
                <BoatToursSection role={role} />
                <RestaurantSection restaurants={restaurants} role={role} />
                <ResortsSection resorts={resorts} role={role} /> */}
                {/* <AccommodationSection />
                <CallToActionSection /> */}
                <ContactSection />
            </div>
        </div>
    );
};

export default MainComponent;
