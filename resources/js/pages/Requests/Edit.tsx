import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import BookingForm from '@/pages/Requests/BookingForm';
import PageHeadingButtons from '@/components/page-heading-buttons';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: '/bookings'
    },
    {
        title: 'Add Bookings',
        href: '/bookings/create'
    }
];

export default function Edit({clients, request}: { clients: any[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Update Request'} />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={'Update Booking'} />
                <BookingForm clients={clients} edit={request}/>
            </div>
        </AppLayout>
    );
}
