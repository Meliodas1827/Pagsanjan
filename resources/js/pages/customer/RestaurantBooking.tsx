import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    MapPin,
    Users,
    UtensilsCrossed,
    DollarSign,
    LogOut,
    NotebookTabs,
    User,
    UserRoundCog,
} from 'lucide-react';
import { type SharedData } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';

interface RestoTable {
    id: number;
    resto_id: number;
    status: 'reserved' | 'available';
    no_of_chairs: number;
    price: number | string;
    deleted: number;
}

interface Restaurant {
    id: number;
    resto_name: string;
    img: string | null;
    payment_qr: string | null;
    deleted: number;
    resto_tables: RestoTable[];
    available_tables_count: number;
    total_capacity: number;
}

interface PageProps {
    restaurant: Restaurant;
}

const PublicNavBar = ({ role }: { role: number }) => {
    const handleLogout = () => {
        router.post(route('logout'));
        router.flushAll();
    };

    return (
        <nav className="w-full bg-[#18371e] text-white">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-opacity-20 flex h-12 w-13 items-center justify-center rounded">
                            <img src="/images/logo.png" alt="logo" title="logo" />
                        </div>
                        <div className="font-bold text-white">
                            <div className="text-lg leading-tight">PAGSANJAN</div>
                            <div className="text-sm leading-tight">FALLS RESORT</div>
                        </div>
                    </Link>

                    {/* User Menu */}
                    {role > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center space-x-2 rounded-md px-3 py-2 text-white transition-colors hover:bg-white hover:bg-opacity-10">
                                <User className="h-5 w-5" />
                                <span>Account</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href={route('dashboard')} className="flex w-full items-center">
                                        <NotebookTabs className="mr-2 h-4 w-4" />
                                        <span>My Bookings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')} className="flex w-full items-center">
                                        <UserRoundCog className="mr-2 h-4 w-4" />
                                        <span>Account</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="flex w-full items-center">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default function RestaurantBooking() {
    const { auth } = usePage<SharedData>().props;
    const { restaurant } = usePage<PageProps>().props;
    const user = auth?.user?.role_id ?? 0;
    const [selectedTable, setSelectedTable] = useState<RestoTable | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);

    const form = useForm({
        resto_id: restaurant.id,
        resto_table_id: 0,
        no_of_guest: 1,
        payment_proof: null as File | null,
    });

    const availableTables = restaurant.resto_tables.filter((t) => t.status === 'available');

    const handleTableSelect = (table: RestoTable) => {
        setSelectedTable(table);
        form.setData({ ...form.data, resto_table_id: table.id, no_of_guest: 1 });
        setShowBookingForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTable) {
            toast.error('Please select a table');
            return;
        }

        form.post(route('restaurant.booking.store'), {
            onSuccess: () => {
                toast.success('Table reservation submitted successfully!');
                setShowBookingForm(false);
                setSelectedTable(null);
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0] as string;
                toast.error(errorMessage || 'Failed to book table');
            },
        });
    };

    return (
        <>
            <Head title={restaurant.resto_name} />
            <PublicNavBar role={user} />

            <div className="min-h-screen bg-gray-50">
                {/* Restaurant Header */}
                <div className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <Link
                            href="/dashboard"
                            className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>

                        <div className="mt-4">
                            <h1 className="text-4xl font-light text-gray-900">{restaurant.resto_name}</h1>
                            <div className="mt-2 flex items-center text-gray-600">
                                <UtensilsCrossed className="mr-2 h-5 w-5" />
                                <span className="text-lg">
                                    {availableTables.length} tables available • {restaurant.total_capacity} total
                                    seats
                                </span>
                            </div>
                        </div>

                        {/* Restaurant Image */}
                        {restaurant.img && (
                            <div className="mt-8 overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={restaurant.img}
                                    alt={restaurant.resto_name}
                                    className="h-96 w-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Tables List */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <h2 className="mb-8 text-3xl font-light text-gray-900">Available Tables</h2>

                    {availableTables.length === 0 ? (
                        <div className="rounded-lg bg-white p-12 text-center shadow">
                            <UtensilsCrossed className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Tables Available</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                All tables are currently reserved. Please check back later.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {availableTables.map((table) => (
                                <div key={table.id} className="relative">
                                    {/* Image Card - Base Layer */}
                                    <div className="relative h-72 overflow-hidden rounded-lg shadow-lg">
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                                            <div className="text-center">
                                                <UtensilsCrossed className="mx-auto h-20 w-20 text-green-600" />
                                                <p className="mt-4 text-3xl font-bold text-green-800">
                                                    Table {table.id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Card - Overlapping Layer */}
                                    <div className="relative -mt-16 mx-4 rounded-lg bg-white p-6 shadow-xl">
                                        <h3 className="text-xl font-semibold text-gray-900">Table {table.id}</h3>
                                        <p className="mt-1 text-sm text-gray-500">Available for booking</p>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Users className="mr-2 h-4 w-4" />
                                                <span>Capacity: {table.no_of_chairs} seats</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <UtensilsCrossed className="mr-2 h-4 w-4" />
                                                <span>Status: {table.status}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                                            <div className="flex items-center">
                                                <DollarSign className="h-5 w-5 text-green-600" />
                                                <span className="text-2xl font-bold text-gray-900">{table.price}</span>
                                                <span className="ml-1 text-sm text-gray-500">₱</span>
                                            </div>
                                            <button
                                                onClick={() => handleTableSelect(table)}
                                                className="rounded-md bg-[#18371e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a5230]"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Booking Form Modal */}
                {showBookingForm && selectedTable && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Book Table {selectedTable.id}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Complete your reservation details below
                            </p>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                {/* Number of Guests */}
                                <div>
                                    <Label htmlFor="guests">Number of Guests</Label>
                                    <Input
                                        id="guests"
                                        type="number"
                                        min="1"
                                        max={selectedTable.no_of_chairs}
                                        value={form.data.no_of_guest}
                                        onChange={(e) => form.setData('no_of_guest', parseInt(e.target.value) || 1)}
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Maximum {selectedTable.no_of_chairs} guests for this table
                                    </p>
                                    {form.errors.no_of_guest && (
                                        <p className="mt-1 text-sm text-red-500">{form.errors.no_of_guest}</p>
                                    )}
                                </div>

                                {/* Admin Approval Notice */}
                                <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="mb-1 font-semibold text-yellow-900">Admin Approval Required</h4>
                                            <p className="text-sm text-yellow-800">
                                                Your booking request will be reviewed by our admin team. They will verify your booking details and payment before approval. You will be notified once your booking is confirmed.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Summary */}
                                <div className="rounded-lg border bg-blue-50 p-4">
                                    <h4 className="mb-2 font-semibold text-blue-900">Booking Summary</h4>
                                    <div className="space-y-1 text-sm text-blue-800">
                                        <p>
                                            <span className="font-medium">Restaurant:</span> {restaurant.resto_name}
                                        </p>
                                        <p>
                                            <span className="font-medium">Table:</span> Table {selectedTable.id}
                                        </p>
                                        <p>
                                            <span className="font-medium">Capacity:</span> {selectedTable.no_of_chairs}{' '}
                                            seats
                                        </p>
                                        <p>
                                            <span className="font-medium">Guests:</span> {form.data.no_of_guest}
                                        </p>
                                        <p>
                                            <span className="font-medium">Price:</span> ₱{selectedTable.price}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment QR */}
                                {restaurant.payment_qr && (
                                    <div className="rounded-lg border bg-gray-50 p-4">
                                        <h4 className="mb-3 font-semibold">Payment QR Code</h4>
                                        <div className="flex justify-center">
                                            <img
                                                src={restaurant.payment_qr}
                                                alt="Payment QR"
                                                className="h-48 w-48 rounded-lg border bg-white p-2"
                                            />
                                        </div>
                                        <p className="mt-3 text-center text-xs text-muted-foreground">
                                            Scan to pay ₱{selectedTable.price}
                                        </p>
                                    </div>
                                )}

                                {/* Payment Proof Upload */}
                                <div>
                                    <Label htmlFor="payment_proof">Upload Payment Proof</Label>
                                    <Input
                                        id="payment_proof"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                form.setData('payment_proof', file);
                                            }
                                        }}
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Please upload a screenshot or photo of your payment receipt
                                    </p>
                                    {form.errors.payment_proof && <p className="mt-1 text-sm text-red-500">{form.errors.payment_proof}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowBookingForm(false);
                                            setSelectedTable(null);
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={form.processing} className="flex-1">
                                        {form.processing ? 'Submitting...' : 'Confirm Booking'}
                                    </Button>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Your reservation will be pending until confirmed by the restaurant.
                                </p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
