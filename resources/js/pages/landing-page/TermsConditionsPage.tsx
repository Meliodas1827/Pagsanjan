import { useState } from 'react';
import PublicNavBar from './components/public-nav-bar';
import TermsAndConditions from './TermsConditions';

// Footer Component
const Footer = () => {
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
                            {message && <p className={`text-sm ${message.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>{message.text}</p>}
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
