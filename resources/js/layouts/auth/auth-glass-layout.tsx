import AppLogoIcon from '@/components/app-logo-icon';
import AnimatedContent from '@/pages/admin/fx/animatedcontent';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthGlassLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthGlassLayout({ children, title, description }: PropsWithChildren<AuthGlassLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: 'url(/images/mainbg.jpg)' }}
        >
            <AnimatedContent
                distance={150}
                direction="vertical"
                reverse={false}
                duration={1.2}
                ease="power3.out"
                initialOpacity={0.2}
                animateOpacity
                scale={1.1}
                threshold={0.2}
                delay={0.3}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Glassmorphism Card */}
                <div className="backdrop-blur-l relative z-10 w-full max-w-3xl overflow-hidden rounded-lg border border-white/20 bg-white/10 shadow-2xl">
                    <div className="grid lg:grid-cols-2">
                        {/* Left Side - Text Content */}
                        <div className="flex flex-col justify-between p-5 text-white lg:p-6">
                            <div>
                                <Link href={route('home')} className="mb-4 inline-flex items-center text-base font-bold">
                                    <AppLogoIcon className="size-7 fill-current text-white" />
                                </Link>

                                <h1 className="mb-2 text-2xl leading-tight font-bold lg:text-3xl">Welcome Back</h1>
                                <p className="mb-4 text-sm text-white/80">Sign in to access your dashboard and manage your reservations.</p>

                                {/* Features List */}
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                                            <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-semibold">Easy Reservation Management</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                                            <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-semibold">Real-time Analytics</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                                            <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-semibold">Secure & Reliable</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Quote */}
                            <blockquote className="mt-4 hidden border-l-2 border-white/30 pl-2 lg:block">
                                <p className="text-xs text-white/90 italic">"Simplifying tourism management, one reservation at a time."</p>
                            </blockquote>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="bg-white/5 p-5 backdrop-blur-sm lg:p-6">
                            <div className="flex flex-col space-y-4">
                                <div className="space-y-1 text-white">
                                    <h2 className="text-lg font-semibold">{title}</h2>
                                    <p className="text-xs text-white/70">{description}</p>
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedContent>
        </div>
    );
}
