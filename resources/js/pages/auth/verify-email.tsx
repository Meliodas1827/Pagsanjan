// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthGlassSimpleLayout from '@/layouts/auth/auth-glass-simple-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthGlassSimpleLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-md border border-green-400/30 bg-green-500/20 p-3 text-center text-sm font-medium text-green-100">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit} className="align-center space-y-6 text-center">
                <Button
                    disabled={processing}
                    className="w-full border border-white/30 bg-[#203620]/50 font-medium text-white backdrop-blur-sm hover:bg-[#162516]/50"
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Resend verification email
                </Button>

                <TextLink
                    href={route('logout')}
                    method="post"
                    className="mx-auto block text-sm text-white/70 underline underline-offset-4 hover:text-white/90"
                >
                    Log out
                </TextLink>
            </form>
        </AuthGlassSimpleLayout>
    );
}
