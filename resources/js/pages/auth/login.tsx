import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthGlassLayout from '@/layouts/auth/auth-glass-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthGlassLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />
            {status && (
                <div className="mb-4 rounded-md border border-green-400/30 bg-green-500/20 p-3 text-center text-sm font-medium text-green-100">
                    {status}
                </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                        />
                        <InputError message={errors.email} className="text-red-300" />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-white">
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-white/70 hover:text-white" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                        />
                        <InputError message={errors.password} className="text-red-300" />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:text-white"
                        />
                        <Label htmlFor="remember" className="text-white/90">
                            Remember me
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full border border-white/30 bg-[#203620]/50 font-medium text-white backdrop-blur-sm hover:bg-[#162516]/50"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>

                <div className="text-center text-sm text-white/70">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} className="text-white underline underline-offset-4 hover:text-white/90" tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>
        </AuthGlassLayout>
    );
}
