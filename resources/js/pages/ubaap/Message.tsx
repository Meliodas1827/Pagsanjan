import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { SendHorizonal, Menu } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Message', href: '/message' },
];

export default function Ubaap() {
    const [showAccounts, setShowAccounts] = useState(false);

    const accountsList = (
        <div className="space-y-2">
            <div className="h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                Landing Area
            </div>
            <div className="h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                Resort
            </div>
            <div className="h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                Ubaap
            </div>
            <div className="h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                Hotel
            </div>
            {/* Add more accounts here */}

        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Message" />
            <div className="my-4 mx-4">
                <div className="grid grid-cols-4 gap-4" style={{ minHeight: '84vh', maxHeight: '84vh' }}>

                    {/* Desktop sidebar */}
                    <Card className="col-span-1 hidden md:block">
                        <CardContent>
                            <CardTitle>Accounts</CardTitle>
                            {accountsList}
                        </CardContent>
                    </Card>

                    {/* Mobile accounts dropdown */}
                    <div className="md:hidden relative col-span-4">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-between"
                            onClick={() => setShowAccounts(!showAccounts)}
                        >
                            <span>Select Account</span>
                            <Menu size={18} />
                        </Button>

                        {showAccounts && (
                            <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg p-3">
                                {accountsList}
                            </div>
                        )}
                    </div>

                    {/* Message area */}
                    <Card className="col-span-4 md:col-span-3">
                        <CardContent>
                            <CardTitle>Account Name</CardTitle>
                            <div className="h-[400px] bg-slate-200 text-white rounded-md p-2 overflow-y-auto">
                                {/* message content */}
                            </div>

                            {/* Chat input */}
                            <div className="flex w-full my-4">
                                <Input
                                    placeholder="Send message ..."
                                    className="rounded-r-none"
                                />
                                <Button
                                    variant="default"
                                    className="bg-blue-800 rounded-l-none cursor-pointer px-6"
                                >
                                    <SendHorizonal />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
