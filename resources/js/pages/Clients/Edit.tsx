import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients',
    },
];
export default function Edit({ client }) {
    const { data, setData, put } = useForm({
        first_name: client.first_name,
        last_name: client.last_name,
        company_name: client.company_name,
        phone: client.phone,
        email: client.email,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/clients/${client.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-3xl font-semibold text-gray-800">Edit Client</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        placeholder="Name"
                    />
                    <Input
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        placeholder="Name"
                    />
                    <Input
                        type="text"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                        placeholder="Name"
                    />
                    <Input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="Name"
                    />
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email"
                    />
                    <Button type="submit">Update</Button>
                </form>
            </div>
        </AppLayout>
    );
}
