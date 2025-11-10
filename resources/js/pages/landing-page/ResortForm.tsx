import ResortForm from '@/components/landing-forms/resort-form';
import { Head } from '@inertiajs/react';
import CustomerLayout from '../customer/layout/layout';


export default function ResortFormPage() {
    return (
        <>
            <Head title="Landing Form">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="my-4 mx-4">
                <ResortForm />
            </div>

        </>

    );
}
