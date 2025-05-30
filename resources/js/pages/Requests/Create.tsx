import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import BookingForm from '@/pages/Requests/BookingForm';
import PageHeadingButtons from '@/components/page-heading-buttons';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '/requests'
    },
    {
        title: 'Add Request',
        href: '/requests/create'
    }
];

export default function Create({clients}: { clients: any[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Create Request'} />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={'Add New Request'} />
                <BookingForm clients={clients}/>
            </div>
        </AppLayout>
    );
}
