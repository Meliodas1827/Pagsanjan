import { SuccessDialog } from '@/components/toast/success-card-dialog';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainComponent from './landing-page/components/website-all';

type PageProps = {
    flash: {
        message?: string;
    };
    hotels: any[];
    boats: any[];
    restaurants: any[];
    landingAreas: any[];
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { props } = usePage<PageProps>();
    const msg = props.flash.message;
    const hotels = props.hotels || [];
    const boats = props.boats || [];
    const restaurants = props.restaurants || [];
    const landingAreas = props.landingAreas || [];
    const [open, setOpen] = useState(false);
    const [shown, setShown] = useState(false); // track if modal was already shown

    useEffect(() => {
        if (msg === 'Profile saved!' && !shown) {
            setOpen(true);
            setShown(true); // ensure only once
        }
    }, [msg, shown]);

    const user = auth?.user?.role_id ?? 0;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <SuccessDialog
                open={open}
                onOpenChange={setOpen}
                title="Profile Saved!"
                description="You can view and update your information at the Account Module"
                buttonTitle="Okay"
            />

            {/* <PublicNavBar role={user} /> */}
            <MainComponent role={user} hotels={hotels} boats={boats} restaurants={restaurants} landingAreas={landingAreas} />
        </>
    );
}
