import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BookingTimeline } from '@/components/timeline';
import { format } from 'date-fns';
import { Edit, GitCommitVertical, LocateIcon, PhoneCall } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

const KeyValueList = ({ items }: { items: { key: string; value: React.ReactNode }[] }) => (
    <ul className="grid gap-3">
        {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
                <Label className="text-sm font-medium text-muted-foreground">
                    {item.key}
                </Label>
                <span className="text-sm font-medium">
          {item.value}
        </span>
            </li>
        ))}
    </ul>
);

export function DetailsCard({ client, service_request }: { client: any, service_request: any }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">{client.full_name}</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-3 grid-rows-1 gap-4 space-y-4">
                <div className={'space-y-5'}>
                    <div>
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-1"><LocateIcon /> Property address
                        </h3>
                        <p className="text-sm">{client.address}</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-1"><GitCommitVertical /> Booking Status
                        </h3>
                        <Badge className="text-sm">{service_request.status.charAt(0).toUpperCase() + service_request.status.slice(1)}</Badge>
                    </div>
                </div>
                <div className={'w-[280px]'}>
                    <h3 className="font-medium text-lg mb-2 flex items-center gap-1"><PhoneCall /> Contact details</h3>

                    <div className="space-y-4">
                        <KeyValueList
                            items={[
                                {
                                    key: 'Phone: ',
                                    value: client.phone
                                },
                                {
                                    key: 'Email: ',
                                    value: client.email
                                },
                            ]}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-lg mb-2">Booking details</h3>
                    <div className="space-y-4">
                        <KeyValueList
                            items={[
                                {
                                    key: 'Cleaning Services',
                                    value: service_request.cleaning_services.map((service: any) => (
                                        <Badge key={service} className="text-sm font-medium ml-2">
                                            {service}
                                        </Badge>
                                    ))
                                }, {
                                    key: 'Preferred Day',
                                    value: format(new Date(service_request.preferred_day), 'dd/MM/yyyy')
                                },
                                {
                                    key: 'Alternate Day',
                                    value: format(new Date(service_request.alternate_day), 'dd/MM/yyyy')
                                },
                                {
                                    key: 'Arrival Times',
                                    value: service_request.arrival_times.map((service: any) => (
                                        <Badge key={service} className="text-sm font-medium ml-2">
                                            {service}
                                        </Badge>
                                    ))
                                }
                            ]}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function show({ request, quotes, approvedQuotes }: { request: any }) {
    const { email, full_name } = request.client;
    const { data, setData, post, reset } = useForm({
        service_request_id: request.id,
        customer_name: full_name,
        customer_email: email,
        quote_amount: ''
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
                <PageHeadingButtons heading={`Bookings Details for ${request.client_name}`}>
                    <Button>
                        <Link href={`/bookings/${request.id}/edit`} className="flex items-center gap-1">
                            <Edit />
                            Edit
                        </Link>
                    </Button>
                </PageHeadingButtons>
                <DetailsCard client={request.client} service_request={request} />

                {/* Clients table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <BookingTimeline quotes={quotes} />
                </div>
            </div>
        </AppLayout>
    );
}
