import React from 'react';
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
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: '/bookings'
    }
];

export function StatusBadge({ status }) {
    let _variant = 'default';

    if (status === 'pending')
        _variant = 'secondary';
    else if (status === 'active')
        _variant = 'primary';
    else if (status === 'rejected')
        _variant = 'destructive';

    const capitalized = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <Badge variant={_variant}>{capitalized}</Badge>
    );
}

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
                <PageHeadingButtons heading={'Bookings'}>
                    <Button>
                        <Link href={`/bookings/create`} className="flex items-center gap-1">
                            <Plus />
                            New Booking
                        </Link>
                    </Button>
                </PageHeadingButtons>

                <StatsOverview
                    stats={[
                        {
                            title: 'Approved Bookings',
                            description: 'Total Approved Bookings',
                            // icon: <EyeIcon className="h-4 w-4 text-green-500" />,
                            value: requests_approved_count
                        },
                        {
                            title: 'Pending Bookings',
                            description: 'Total Pending Bookings',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: requests_unapproved_count
                        },
                        {
                            title: 'Weekly Bookings',
                            description: 'This week Bookings',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: requests_count_week
                        },
                        {
                            title: 'Monthly Bookings',
                            description: 'This month Bookings',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: requests_count_month
                        },
                        {
                            title: 'All Bookings',
                            description: 'Overall Bookings',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: requests_count
                        }
                    ]}
                />

                {/* Clients table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Bookings</CardTitle>
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
                                    placeholder="Search Bookings..."
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
                                {requests.map((request) => (
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
                                                <Link href={`/bookings/${request.id}`}>
                                                    <EyeIcon className={'text-green-800'} />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost">
                                                <Link href={`/bookings/${request.id}/edit`}>
                                                    <Edit className={'text-yellow-800'} />
                                                </Link>
                                            </Button>
                                            <form
                                                method="POST"
                                                action={`/bookings/${request.id}`}
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (confirm('Are you sure?')) {
                                                        Inertia.delete(`/bookings/${request.id}`);
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
