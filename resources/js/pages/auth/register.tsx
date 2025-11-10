import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthGlassLayout from '@/layouts/auth/auth-glass-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthGlassLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-white">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                        />
                        <InputError message={errors.name} className="text-red-300" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                        />
                        <InputError message={errors.email} className="text-red-300" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-white">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                        />
                        <InputError message={errors.password} className="text-red-300" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-white">
                            Confirm password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                        />
                        <InputError message={errors.password_confirmation} className="text-red-300" />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full border border-white/30 bg-[#203620]/50 font-medium text-white backdrop-blur-sm hover:bg-[#162516]/50"
                        tabIndex={5}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-white/70">
                    Already have an account?{' '}
                    <TextLink href={route('login')} className="text-white underline underline-offset-4 hover:text-white/90" tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthGlassLayout>
    );
}
