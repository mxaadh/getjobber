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
        title: 'Edit Clients',
        href: '#'
    }
];

export default function Edit({ client }) {
    const { id, first_name, last_name, company_name, phone, email, properties } = client;
    const { street1, street2, city, state, postal_code, country } = properties[0];
    const property_id = properties[0].id;
    const { data, setData, put, errors, reset, processing } = useForm({
        first_name: first_name,
        last_name: last_name,
        company_name: company_name,
        phone: phone,
        email: email,
        street1: street1,
        street2: street2,
        city: city,
        state: state,
        postal_code: postal_code,
        country: country,
        property_id: property_id
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/clients/${id}`, {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Client" />
            <div className="space-y-6 m-2 p-2">
                {/* Header section with title and buttons */}
                <PageHeadingButtons heading={'Edit Client'} />
                <ClientForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    handleSubmit={handleSubmit}
                    setData={setData}
                    countries={countries}
                    isUpdate={true}
                />
            </div>
        </AppLayout>
    );
}
