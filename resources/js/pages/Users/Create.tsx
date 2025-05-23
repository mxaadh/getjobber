import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users'
    },
    {
        title: 'Add User',
        href: '/users/create'
    }
];

export default function Create() {
    const { data, setData, post, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        phone: '',
        country: '',
        state: '',
        city: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Create Request'} />
            <div className="space-y-2 m-2 p-2">
                <PageHeadingButtons heading={'Add New User'} />

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Role</Label>
                                    <Select onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="employee">Employee</SelectItem>
                                            <SelectItem value="contractor">Contractor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    <div className={'grid grid-cols-2 gap-5'}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                        <Input
                                            type="tel"
                                            placeholder="Phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Country</Label>
                                        <Input
                                            type="text"
                                            placeholder="Country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">State</Label>
                                        <Input
                                            type="text"
                                            placeholder="State"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">City</Label>
                                        <Input
                                            type="text"
                                            placeholder="City"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="w-full flex justify-end">
                        <Button type="submit">Create User</Button>
                    </div>
                </form>

            </div>
        </AppLayout>
    );
}
