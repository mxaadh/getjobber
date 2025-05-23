import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Timeline } from "@/components/timeline";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: '/bookings'
    },
    {
        title: 'Booking Detail',
        href: '#'
    }
];

export default function show({request, quotes, approvedQuotes}: { request: any }) {
    const {email, full_name} = request.client;
    const { data, setData, post, reset } = useForm({
        service_request_id: request.id,
        customer_name: full_name,
        customer_email: email,
        quote_amount: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bookings/quote-add', {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Details" />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={`Bookings Details for ${request.client_name}`} />

                {/* Clients table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Send Quote</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
                            <Label htmlFor="quote-amount">Quote amount</Label>
                            <Input
                                id="quote-amount"
                                type={'text'}
                                placeholder="Enter Quote Amount"
                                value={data.quote_amount}
                                onChange={(e) => setData('quote_amount', e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline">
                                    <Link href={'/bookings'}>Cancel</Link>
                                </Button>
                                <Button type={'submit'} disabled={approvedQuotes}>Send Email</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <Timeline quotes={quotes} />
            </div>
        </AppLayout>
    );
}
