import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import React from 'react';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { countries } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients'
    },
    {
        title: 'Add Clients',
        href: '/clients/create'
    }
];

export default function Create() {
    const { data, setData, post, reset } = useForm({
        first_name: '',
        last_name: '',
        company_name: '',
        phone: '',
        email: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/clients', {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />
            <div className="space-y-6 m-2 p-2">
                {/* Header section with title and buttons */}
                <PageHeadingButtons heading={'Add New Client'} />
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
                    {/* New Client Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Primary contact details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Provide the main point of contact to ensure smooth communication and reliable client
                                    records.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First name</Label>
                                        <Input
                                            id="first-name"
                                            type={'text'}
                                            placeholder="Enter first name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last name</Label>
                                        <Input
                                            id="last-name"
                                            type={'text'}
                                            placeholder="Enter last name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <Label htmlFor="company-name">Company name</Label>
                                    <Input
                                        id="company-name"
                                        type={'text'}
                                        placeholder="Enter company name"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium">Communication</h4>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone number</Label>
                                        <Input
                                            id="phone"
                                            type={'tel'}
                                            placeholder="Enter phone number"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Property Address Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-sm text-muted-foreground">
                                Enter the primary service address, billing address, or any additional locations where
                                services may take place.
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="street1">Street 1</Label>
                                    <Input id="street1" placeholder="Enter street address"
                                           value={data.street1}
                                           onChange={(e) => setData('street1', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="street2">Street 2 (Optional)</Label>
                                    <Input id="street2" placeholder="Apartment, suite, etc."
                                           value={data.street2}
                                           onChange={(e) => setData('street2', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" placeholder="Enter city"
                                               value={data.city}
                                               onChange={(e) => setData('city', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" placeholder="Enter state"
                                               value={data.state}
                                               onChange={(e) => setData('state', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="postal-code">Postal code</Label>
                                        <Input id="postal-code" placeholder="Enter postal code"
                                               value={data.postal_code}
                                               onChange={(e) => setData('postal_code', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Select value={data.country}
                                                onValueChange={(value) => setData('country', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(countries).map(([code, name]) => (
                                                    <SelectItem key={code} value={name}>  {/* Using name as value */}
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">
                            <Link href={'/clients'}>Cancel</Link>
                        </Button>
                        <Button type={'submit'}>Save Client</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
