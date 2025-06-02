import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import React from 'react';
import { UserForm } from '@/pages/Users/Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users'
    },
    {
        title: 'Edit User',
        href: '#'
    }
];

export default function Edit({record}) {
    console.log(record);
    const { data, setData, put, errors, reset, processing } = useForm({
        name: record.name,
        email: record.email,
        // password: record.password,
        role: record.role,
        phone: record.user_detail?.phone || '',
        country: record.user_detail?.country || '',
        state: record.user_detail?.state || '',
        city: record.user_detail?.city || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/users/${record.id}`, {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Edit User'} />
            <div className="space-y-2 m-2 p-2">
                <PageHeadingButtons heading={'Edit User'} />
                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    onSubmit={handleSubmit}
                    submitButtonText={processing ? 'Updating...' : 'Update User'}
                    isUpdate={true}
                />
            </div>
        </AppLayout>
    );
}
