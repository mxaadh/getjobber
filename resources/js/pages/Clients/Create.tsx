import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import React from 'react';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { countries } from '@/lib/utils';
import ClientForm from '@/pages/Clients/Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients'
    },
    {
        title: 'Add Clients',
        href: '/clients/create'
    }
];

export default function Create() {
    const { data, setData, post, errors, reset, processing } = useForm({
        first_name: '',
        last_name: '',
        company_name: '',
        phone: '',
        email: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/clients', {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />
            <div className="space-y-6 m-2 p-2">
                {/* Header section with title and buttons */}
                <PageHeadingButtons heading={'Add New Client'} />
                <ClientForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    setData={setData}
                    countries={countries}
                />
            </div>
        </AppLayout>
    );
}
