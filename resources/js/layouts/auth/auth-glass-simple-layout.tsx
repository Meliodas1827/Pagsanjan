import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthGlassSimpleLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthGlassSimpleLayout({ children, title, description }: PropsWithChildren<AuthGlassSimpleLayoutProps>) {
    return (
        <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: 'url(/images/mainbg.jpg)' }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
                <div className="bg-white/5 p-6 backdrop-blur-sm lg:p-8">
                    <div className="mb-6 flex justify-center">
                        <Link href={route('home')} className="inline-flex items-center text-base font-bold">
                            <AppLogoIcon className="size-10 fill-current text-white" />
                        </Link>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <div className="space-y-1 text-center text-white">
                            <h2 className="text-xl font-semibold">{title}</h2>
                            <p className="text-sm text-white/70">{description}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
