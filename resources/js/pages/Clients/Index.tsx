import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {PaginationComponent} from '@/components/pagination-component';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Edit, EyeIcon, Filter, Loader2, Plus, Search, Trash, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect } from 'react';
import PageHeadingButtons from '@/components/page-heading-buttons';
import StatsOverview from '@/components/StatsOverview';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients'
    }
];
export default function Index({ clients, clients_count, clients_count_month, clients_count_week, searchQuery = '' }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this client?')) {
            destroy(`/clients/${id}`);
        }
    };

    const { data, setData, get } = useForm({
        search: searchQuery || '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get('/clients', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        get('/clients', {
            preserveState: true,
            preserveScroll: true,
        });
    }, [data.search]);

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
                    _route={'clients.index'}
                    stats={[
                        {
                            title: 'Weekly Clients',
                            description: 'This week',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: clients_count_week
                        },
                        {
                            title: 'Monthly Clients',
                            description: 'This month',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: clients_count_month
                        },
                        {
                            title: 'All Clients',
                            description: 'Overall',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: clients_count
                        }
                    ]}
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
                            </div>
                            <div className="relative w-full md:w-64">
                                <form onSubmit={handleSearch}>
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    {data.search && (
                                        <X
                                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
                                            onClick={() => setData('search', '')}
                                        />
                                    )}
                                    <Input
                                        placeholder="Search clients..."
                                        className="pl-9"
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        onKeyUp={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(e);
                                            }
                                        }}

                                    />
                                </form>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created at</TableHead>
                                    <TableHead className={'text-right'}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.data.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>{client.full_name}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>{client.address}</TableCell>
                                        <TableCell>
                                            <Badge variant="default">Active</Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(client.created_at), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/clients/${client.id}`}>
                                                <Button size={'icon'} variant={'ghost'}>
                                                    <EyeIcon className={'text-green-800'} />
                                                </Button>
                                            </Link>
                                            <Link href={`/clients/${client.id}/edit`}>
                                                <Button size={'icon'} variant={'ghost'}>
                                                    <Edit className={'text-yellow-800'} />
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleDelete(client.id)}
                                                size={'icon'}
                                                variant={'ghost'}
                                                disabled={processing}
                                            >
                                                <Trash className={'text-red-800'} />
                                                {processing && <Loader2 className="animate-spin" />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className={'items-end'}>
                        <PaginationComponent pagination={clients} />
                    </CardFooter>
                </Card>
            </div>

        </AppLayout>
    );
}
