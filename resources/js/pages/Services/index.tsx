import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import StatsOverview from '@/components/StatsOverview';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/status-badge';
import { PaginationComponent } from '@/components/pagination-component';
import React from 'react';

const module = 'Services';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: '/services'
    }
];

export default function Index({records}) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={module} />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={module}>
                    <Button>
                        <Link href={`/service/create`} className="flex items-center gap-1">
                            <Plus />
                            New {module}
                        </Link>
                    </Button>
                </PageHeadingButtons>

                <Card>
                    <CardHeader>
                        <CardTitle>All {module}</CardTitle>
                        <CardDescription>{records.length} results</CardDescription>
                        {/* Filters and Search */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div></div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search ..."
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Created Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.data.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.title}</TableCell>
                                        <TableCell>{record.description}</TableCell>
                                        <TableCell>{record.unit_price}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost">
                                                <Link href={`/services/${record.id}/edit`}>
                                                    <Edit className={'text-yellow-800'} />
                                                </Link>
                                            </Button>
                                            <form
                                                method="POST"
                                                action={`/services/${record.id}`}
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (confirm('Are you sure?')) {
                                                        Inertia.delete(`/services/${record.id}`);
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
                        <PaginationComponent pagination={records} />
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
