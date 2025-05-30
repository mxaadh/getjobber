import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: '/services'
    },
    {
        title: 'Add Service',
        href: '/services/create'
    }
];

export default function Create() {
    const { data, setData, post, errors, reset, processing } = useForm({
        title: '',
        description: '',
        unit_price: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/services', {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Create Service'} />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={'Add New Service'} />
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
                    {/* New Client Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Service</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type={'text'}
                                    placeholder="Enter title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title &&
                                    <div className="text-red-500 text-xs">{errors.title}</div>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Description</Label>
                                <Textarea placeholder="Description of the service"
                                          className="mt-4"
                                          value={data.description}
                                          onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description &&
                                    <div className="text-red-500 text-xs">{errors.description}</div>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Unit</Label>
                                <Input
                                    type={'number'}
                                    placeholder="Price per unit"
                                    className="mt-4"
                                    value={data.unit_price}
                                    onChange={(e) => setData('unit_price', e.target.value)}
                                />
                                {errors.unit_price &&
                                    <div className="text-red-500 text-xs">{errors.unit_price}</div>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">
                            <Link href={'/clients'}>Cancel</Link>
                        </Button>
                        <Button type={'submit'} disabled={processing}>
                            {processing && <Loader2 className="animate-spin" />}
                            Save Client
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
