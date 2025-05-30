import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Edit, EyeIcon, Filter, Plus, Search, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import StatsOverview from '@/components/StatsOverview';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/status-badge';
import { PaginationComponent } from '@/components/pagination-component';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '/requests'
    }
];

export default function Index({
                                  requests,
                                  requests_count,
                                  requests_approved_count,
                                  requests_unapproved_count,
                                  requests_count_month,
                                  requests_count_week
                              }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Requests" />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={'Request'}>
                    <Button>
                        <Link href={`/requests/create`} className="flex items-center gap-1">
                            <Plus />
                            New Request
                        </Link>
                    </Button>
                </PageHeadingButtons>

                <StatsOverview
                    route={'requests.index'}
                    stats={[
                        {
                            title: 'Approved Requests',
                            description: 'Total Approved Requests',
                            // icon: <EyeIcon className="h-4 w-4 text-green-500" />,
                            value: requests_approved_count
                        },
                        {
                            title: 'Pending Requests',
                            description: 'Total Pending Requests',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: requests_unapproved_count
                        },
                        {
                            title: 'Weekly Requests',
                            description: 'This week Requests',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: requests_count_week
                        },
                        {
                            title: 'Monthly Requests',
                            description: 'This month Requests',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: requests_count_month
                        },
                        {
                            title: 'All Requests',
                            description: 'Overall Requests',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: requests_count
                        }
                    ]}
                />

                {/* Clients table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Requests</CardTitle>
                        <CardDescription>{requests_count} results</CardDescription>
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
                                            Pending
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Active
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Approved
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search Requests..."
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Preferred Day</TableHead>
                                    <TableHead>Alternate Day</TableHead>
                                    <TableHead>Arrival Times</TableHead>
                                    <TableHead>Services</TableHead>
                                    <TableHead>Quote</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.data.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.client_name}</TableCell>
                                        <TableCell>{format(new Date(request.preferred_day), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{format(new Date(request.alternate_day), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{request.arrival_times}</TableCell>
                                        <TableCell>{request.cleaning_services}</TableCell>
                                        <TableCell>{request.quote_amount}</TableCell>
                                        <TableCell><StatusBadge status={request.status} /></TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button size={'icon'} variant={'ghost'}>
                                                <Link href={`/requests/${request.id}`}>
                                                    <EyeIcon className={'text-green-800'} />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost">
                                                <Link href={`/requests/${request.id}/edit`}>
                                                    <Edit className={'text-yellow-800'} />
                                                </Link>
                                            </Button>
                                            <form
                                                method="POST"
                                                action={`/requests/${request.id}`}
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (confirm('Are you sure?')) {
                                                        Inertia.delete(`/requests/${request.id}`);
                                                    }
                                                }}
                                                className="inline"
                                            >
                                                <Button size={'icon'} variant="ghost" type="submit">
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
                        <PaginationComponent pagination={requests} />
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
