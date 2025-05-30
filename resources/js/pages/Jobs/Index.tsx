import { Head, Link } from '@inertiajs/react';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Button } from '@/components/ui/button';
import { Edit, EyeIcon, Filter, Plus, Search, Trash } from 'lucide-react';
import React from 'react';
import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import StatsOverview from '@/components/StatsOverview';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { StatusBadge } from '@/components/status-badge';
import { PaginationComponent } from '@/components/pagination-component';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jobs',
        href: '/jobs'
    }
];

export default function Index({ jobs, all_count, month_count, week_count, approved_count, pending_count }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Requests" />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={'Jobs'}>
                    <Button>
                        <Link href={`/jobs/create`} className="flex items-center gap-1">
                            <Plus />
                            New Job
                        </Link>
                    </Button>
                </PageHeadingButtons>

                <StatsOverview
                    _route={'jobs.index'}
                    stats={[
                        {
                            title: 'Approved Jobs',
                            description: 'Total Approved',
                            // icon: <EyeIcon className="h-4 w-4 text-green-500" />,
                            value: approved_count
                        },
                        {
                            title: 'Pending Jobs',
                            description: 'Total Pending',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: pending_count
                        },
                        {
                            title: 'Weekly Jobs',
                            description: 'This week',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: week_count
                        },
                        {
                            title: 'Monthly Jobs',
                            description: 'This month',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: month_count
                        },
                        {
                            title: 'All Jobs',
                            description: 'Overall',
                            // icon: <EyeIcon className="h-4 w-4 text-yellow-500" />,
                            value: all_count
                        }
                    ]}
                />

                {/* Clients table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Jobs</CardTitle>
                        <CardDescription>{all_count} results</CardDescription>
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
                                        <DropdownMenuCheckboxItem>
                                            Rejected
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Completed
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
                                    <TableHead>Property</TableHead>
                                    <TableHead>Job ID</TableHead>
                                    <TableHead>Schedule</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.data.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell>{job.client.full_name}</TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="link"
                                                        className="p-0 h-auto text-left font-normal"
                                                    >
        <span className="inline-block truncate max-w-[200px]">
          {job.client.address.split(',')[0]} {/* Show just first line */}
        </span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[280px]">
                                                    <div className="grid gap-2">
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-medium">Full Address</h4>
                                                            <p className="text-sm">{job.client.address}</p>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                        <TableCell>#{job.id}</TableCell>
                                        {/*<TableCell>{job.arrival_times}</TableCell>*/}
                                        <TableCell>{format(new Date(job.schedule_date), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{job.total_price}</TableCell>
                                        <TableCell><StatusBadge  status={job.status}/></TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button size={'icon'} variant={'ghost'}>
                                                <Link href={`/jobs/${job.id}`}>
                                                    <EyeIcon className={'text-green-800'} />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost">
                                                <Link href={`/jobs/${job.id}/edit`}>
                                                    <Edit className={'text-yellow-800'} />
                                                </Link>
                                            </Button>
                                            <form
                                                method="POST"
                                                action={`/jobs/${job.id}`}
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (confirm('Are you sure?')) {
                                                        Inertia.delete(`/bookings/${job.id}`);
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
                        <PaginationComponent pagination={jobs} />
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
