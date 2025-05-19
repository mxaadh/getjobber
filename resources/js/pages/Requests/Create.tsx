import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import BookingForm from '@/pages/Requests/BookingForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '/requests',
    },
    {
        title: 'Add Requests',
        href: '/requests/create',
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={"Create Request"} />
            <BookingForm />
        </AppLayout>
    )
}
