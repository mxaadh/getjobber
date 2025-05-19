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
        title: 'Clients',
        href: '/clients',
    },
];

export default function Index({ quotes }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
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
                        {quotes.map((quote) => (
                            <TableRow key={quote.id}>
                                <TableCell>{quote.first_name}</TableCell>
                                <TableCell>{quote.last_name}</TableCell>
                                <TableCell>{quote.company_name}</TableCell>
                                <TableCell>{quote.phone}</TableCell>
                                <TableCell>{quote.email}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" asChild>
                                        <a href={`/quotes/${quote.id}/edit`}>Edit</a>
                                    </Button>
                                    <form
                                        method="POST"
                                        action={`/quotes/${quote.id}`}
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (confirm("Are you sure?")) {
                                                Inertia.delete(`/quotes/${quote.id}`);
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
