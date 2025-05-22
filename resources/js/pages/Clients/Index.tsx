import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Edit, EyeIcon, Filter, Plus, Search, Trash } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import PageHeadingButtons from '@/components/page-heading-buttons';
import StatsOverview from '@/components/StatsOverview';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients'
    }
];
export default function Index({ clients, clients_count, clients_count_month, clients_count_week }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />

            <div className="space-y-6 m-2 p-2">
                {/* Header section with title and buttons */}
                <PageHeadingButtons heading={'Clients'}>
                    <Button className="p-2">
                        <Link href={'/clients/create'} className="flex items-center gap-1">
                            <Plus />
                            New Client
                        </Link>
                    </Button>
                </PageHeadingButtons>

                {/* Cards section */}
                <StatsOverview
                    title={'Client'}
                    week={clients_count_week}
                    month={clients_count_month}
                    all={clients_count}
                />

                {/* Clients table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All clients</CardTitle>
                        <CardDescription>4 results</CardDescription>
                        {/* Filters and Search */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-2 w-full md:w-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex gap-2">
                                            <Filter className="h-4 w-4" />
                                            Status
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuCheckboxItem checked>
                                            All
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Active
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Lead
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Inactive
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex gap-2">
                                            <Filter className="h-4 w-4" />
                                            Tags
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuCheckboxItem checked>
                                            All
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Loads
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Active
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Leads and Active
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search clients..."
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created at</TableHead>
                                    <TableHead className={'text-right'}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map((client) => (
                                    <TableRow>
                                        <TableCell>{client.full_name}</TableCell>
                                        <TableCell>{client.address}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            <Badge variant="default">Active</Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(client.created_at), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button size={'icon'} variant={'ghost'}>
                                                <Link href={`/clients/${client.id}`}>
                                                    <EyeIcon className={'text-green-800'} />
                                                </Link>
                                            </Button>
                                            <Button size={'icon'} variant={'ghost'}>
                                                <Link href={`/clients/${client.id}/edit`}>
                                                    <Edit className={'text-yellow-800'} />
                                                </Link>
                                            </Button>
                                            <form
                                                method="POST"
                                                action={`/clients/${client.id}`}
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (confirm('Are you sure?')) {
                                                        Inertia.delete(`/clients/${client.id}`);
                                                    }
                                                }}
                                                className="inline"
                                            >
                                                <Button type={'submit'} size={'icon'} variant={'ghost'}>
                                                    <Trash className={'text-red-800'} />
                                                </Button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className={'items-end'}>
                        <Pagination className={'justify-end'}>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                    2
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">3</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            </div>

        </AppLayout>
    );
}
