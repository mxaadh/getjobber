import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Edit, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginationComponent } from '@/components/pagination-component';
import React from 'react';
import { format } from 'date-fns';
import SearchInput from '@/components/search-box';
import DeleteEntityDialog from '@/components/delete-buttom';

const module = 'Services';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: '/services'
    }
];

export default function Index({ records, searchQuery }) {
    const { data, setData, get } = useForm({
        search: searchQuery || ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get('/services', {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={module} />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={module}>
                    <Button>
                        <Link href={`/services/create`} className="flex items-center gap-1">
                            <Plus />
                            New {module}
                        </Link>
                    </Button>
                </PageHeadingButtons>

                <Card>
                    <CardHeader>
                        <CardTitle>All {module}</CardTitle>
                        <CardDescription>{records.total} results</CardDescription>
                        {/* Filters and Search */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div></div>
                            <SearchInput
                                searchValue={data.search}
                                onSearchChange={(value) => setData('search', value)}
                                onSearchSubmit={handleSearch}
                            />
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
                                        <TableCell>{format(new Date(record.created_at), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost">
                                                <Link href={`/services/${record.id}/edit`}>
                                                    <Edit className={'text-yellow-800'} />
                                                </Link>
                                            </Button>
                                            <DeleteEntityDialog url={`/services/${record.id}`} />
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
