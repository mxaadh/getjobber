// resources/js/Pages/Services/Create.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import React from 'react';
import Form from '@/pages/Services/Form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Services', href: '/services' },
    { title: 'Edit Service', href: '#' }
];

export default function Edit({record}) {
    const { data, setData, put, errors, reset, processing } = useForm({
        title: record.title,
        description: record.description,
        unit_price: record.unit_price
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/services/${record.id}`, {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Service" />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading="Add New Service" />
                <Form
                    data={data}
                    setData={setData}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    processing={processing}
                    isEdit={true}
                />
            </div>
        </AppLayout>
    );
}
