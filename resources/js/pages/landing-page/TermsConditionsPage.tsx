import PublicNavBar from './components/public-nav-bar';
import TermsAndConditions from './TermsConditions';
import { useState } from 'react';

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
const TermsConditionsPage = ({ role }: { role: number }) => {
    return (
        <div className="relative">
            <PublicNavBar role={role} />
            <TermsAndConditions role={role} />
            <Footer />
        </div>
    );
};

export default TermsConditionsPage;
