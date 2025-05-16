import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients',
    },
];

export default function Index({ clients }) {
    const { data, setData, post, reset } = useForm({
        first_name: '',
        last_name: '',
        company_name: '',
        phone: '',
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/clients', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        placeholder="First Name"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Last Name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Company Name"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <Button type="submit">Create Client</Button>
                </form>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.first_name}</TableCell>
                                <TableCell>{client.last_name}</TableCell>
                                <TableCell>{client.company_name}</TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" asChild>
                                        <a href={`/clients/${client.id}/edit`}>Edit</a>
                                    </Button>
                                    <form
                                        method="POST"
                                        action={`/clients/${client.id}`}
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (confirm("Are you sure?")) {
                                                Inertia.delete(`/clients/${client.id}`);
                                            }
                                        }}
                                        className="inline"
                                    >
                                        <Button variant="destructive" type="submit">
                                            Delete
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
);
}
