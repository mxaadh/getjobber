import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Edit, Plus } from 'lucide-react';
import StatsOverview from '@/components/StatsOverview';
import { PaginationComponent } from '@/components/pagination-component';
import DeleteEntityDialog from '@/components/delete-buttom';
import SearchInput from '@/components/search-box';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users'
    }
];

export default function Index({ users, employee_count, contractor_count, client_count, searchQuery }) {
    const { data, setData, get } = useForm({
        search: searchQuery || ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get('/users', {
            preserveState: true,
            preserveScroll: true
        });
    };

    console.log(users);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={'Users'}>
                    <Button>
                        <Link href={`/users/create`} className="flex items-center gap-1">
                            <Plus />
                            New User
                        </Link>
                    </Button>
                </PageHeadingButtons>

                <StatsOverview
                    _route={'users.index'}
                    stats={[
                        {
                            title: 'Employees',
                            value: employee_count
                        },
                        {
                            title: 'Contractors',
                            value: contractor_count
                        },
                        {
                            title: 'Clients',
                            value: client_count
                        },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>{users.total} results</CardDescription>
                        {/* Filters and Search */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-2 w-full md:w-auto">
                                {/*<DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex gap-2">
                                            <Filter className="h-4 w-4" />
                                            Role
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuCheckboxItem checked>
                                            All
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Admin
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Employee
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Contractor
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Client
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>*/}
                            </div>
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/users/${user.id}/edit`}>
                                                <Button variant="ghost">
                                                    <Edit className={'text-yellow-800'} />
                                                </Button>
                                            </Link>
                                            <DeleteEntityDialog url={`/users/${user.id}`}  />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className={'items-end'}>
                        <PaginationComponent pagination={users} />
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
