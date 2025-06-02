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
        title: 'Add User',
        href: '/users/create'
    }
];

export default function Create() {
    const { data, setData, post, errors, reset, processing } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        country: '',
        state: '',
        city: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Create User'} />
            <div className="space-y-2 m-2 p-2">
                <PageHeadingButtons heading={'Add New User'} />
                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    onSubmit={handleSubmit}
                    submitButtonText={processing ? 'Creating...' : 'Create User'}
                    isUpdate={false}
                />
            </div>
        </AppLayout>
    );
}
