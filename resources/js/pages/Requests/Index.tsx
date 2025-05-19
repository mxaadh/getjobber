import React from 'react';
import { Head } from '@inertiajs/react';
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
        title: 'Requests',
        href: '/requests',
    },
];

export default function Index({ requests }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Requests" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Button asChild>
                    <a href={`/requests/create`}>Add Request</a>
                </Button>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Requested</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.client_name}</TableCell>
                                <TableCell>{request.title}</TableCell>                                <TableCell>{request.client_name}</TableCell>
                                <TableCell>{request.property}</TableCell>                                <TableCell>{request.client_name}</TableCell>
                                <TableCell>{request.contact}</TableCell>
                                <TableCell>{request.requested}</TableCell>
                                <TableCell>{request.status}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" asChild>
                                        <a href={`/requests/${request.id}/edit`}>Edit</a>
                                    </Button>
                                    <form
                                        method="POST"
                                        action={`/requests/${request.id}`}
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (confirm("Are you sure?")) {
                                                Inertia.delete(`/requests/${request.id}`);
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
