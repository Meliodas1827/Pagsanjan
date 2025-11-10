import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler } from 'react';
import { Mail, Lock, Server, User } from 'lucide-react';

interface EmailConfig {
    id?: number;
    mail_host: string;
    mail_port: number;
    mail_username: string;
    mail_password?: string;
    mail_encryption: string;
    mail_from_address: string;
    mail_from_name: string;
}

interface PageProps {
    emailConfig?: EmailConfig;
}

export default function EmailConfiguration() {
    const { emailConfig } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Email Configuration',
            href: '/email-configuration',
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        mail_host: emailConfig?.mail_host || '',
        mail_port: emailConfig?.mail_port || 587,
        mail_username: emailConfig?.mail_username || '',
        mail_password: '',
        mail_encryption: emailConfig?.mail_encryption || 'tls',
        mail_from_address: emailConfig?.mail_from_address || '',
        mail_from_name: emailConfig?.mail_from_name || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (emailConfig?.id) {
            put(route('email-configuration.update', emailConfig.id));
        } else {
            post(route('email-configuration.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Email Configuration" />

            <div className="container mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email Server Configuration
                        </CardTitle>
                        <CardDescription>
                            Configure the SMTP email settings for sending OTP and notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Mail Host */}
                                <div className="space-y-2">
                                    <Label htmlFor="mail_host" className="flex items-center gap-2">
                                        <Server className="h-4 w-4" />
                                        SMTP Host
                                    </Label>
                                    <Input
                                        id="mail_host"
                                        type="text"
                                        value={data.mail_host}
                                        onChange={(e) => setData('mail_host', e.target.value)}
                                        placeholder="smtp.gmail.com"
                                        required
                                    />
                                    {errors.mail_host && (
                                        <p className="text-sm text-red-500">{errors.mail_host}</p>
                                    )}
                                </div>

                                {/* Mail Port */}
                                <div className="space-y-2">
                                    <Label htmlFor="mail_port">SMTP Port</Label>
                                    <Input
                                        id="mail_port"
                                        type="number"
                                        value={data.mail_port}
                                        onChange={(e) => setData('mail_port', parseInt(e.target.value))}
                                        placeholder="587"
                                        required
                                    />
                                    {errors.mail_port && (
                                        <p className="text-sm text-red-500">{errors.mail_port}</p>
                                    )}
                                </div>

                                {/* Mail Encryption */}
                                <div className="space-y-2">
                                    <Label htmlFor="mail_encryption" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Encryption
                                    </Label>
                                    <Select
                                        value={data.mail_encryption}
                                        onValueChange={(value) => setData('mail_encryption', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select encryption" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tls">TLS</SelectItem>
                                            <SelectItem value="ssl">SSL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.mail_encryption && (
                                        <p className="text-sm text-red-500">{errors.mail_encryption}</p>
                                    )}
                                </div>

                                {/* Mail Username */}
                                <div className="space-y-2">
                                    <Label htmlFor="mail_username" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Username (Email)
                                    </Label>
                                    <Input
                                        id="mail_username"
                                        type="text"
                                        value={data.mail_username}
                                        onChange={(e) => setData('mail_username', e.target.value)}
                                        placeholder="your-email@gmail.com"
                                        required
                                    />
                                    {errors.mail_username && (
                                        <p className="text-sm text-red-500">{errors.mail_username}</p>
                                    )}
                                </div>

                                {/* Mail Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="mail_password" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Password {emailConfig?.id && '(Leave blank to keep current)'}
                                    </Label>
                                    <Input
                                        id="mail_password"
                                        type="password"
                                        value={data.mail_password}
                                        onChange={(e) => setData('mail_password', e.target.value)}
                                        placeholder="••••••••••••••••"
                                        required={!emailConfig?.id}
                                    />
                                    {errors.mail_password && (
                                        <p className="text-sm text-red-500">{errors.mail_password}</p>
                                    )}
                                </div>

                                {/* From Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="mail_from_address" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        From Email Address
                                    </Label>
                                    <Input
                                        id="mail_from_address"
                                        type="email"
                                        value={data.mail_from_address}
                                        onChange={(e) => setData('mail_from_address', e.target.value)}
                                        placeholder="noreply@pagsanjanfallsresort.com"
                                        required
                                    />
                                    {errors.mail_from_address && (
                                        <p className="text-sm text-red-500">{errors.mail_from_address}</p>
                                    )}
                                </div>

                                {/* From Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="mail_from_name">From Name</Label>
                                    <Input
                                        id="mail_from_name"
                                        type="text"
                                        value={data.mail_from_name}
                                        onChange={(e) => setData('mail_from_name', e.target.value)}
                                        placeholder="Pagsanjan Falls Resort"
                                        required
                                    />
                                    {errors.mail_from_name && (
                                        <p className="text-sm text-red-500">{errors.mail_from_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : emailConfig?.id ? 'Update Configuration' : 'Save Configuration'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}