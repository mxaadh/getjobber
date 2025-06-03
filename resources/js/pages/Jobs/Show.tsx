import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { SharedData } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Timeline } from '@/components/timeline';
import { Edit, GitCommitVertical, LocateIcon, PhoneCall, Pickaxe, TrashIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SelectCountry from '@/components/select-country';
import { Separator } from '@/components/ui/separator';
import Start from '@/pages/Jobs/Start';
import Complete from '@/pages/Jobs/Complete';
import { toast } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jobs',
        href: '/jobs'
    },
    {
        title: 'Job Detail',
        href: '#'
    }
];

export default function show({
                                 job,
                                 contractors,
                                 price,
                                 services,
                                 checkQuotePending,
                                 asignedContractor,
                                 prePhotos,
                                 postPhotos,
                                 priceItem
                             }) {
    const { auth, flash } = usePage().props;
    const { role } = auth.user;

    const initialItems = price.length && price[0].items.length
        ? price[0].items.map((item: any) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price),
            total: parseFloat(item.total)
        }))
        : [{ name: '', description: '', quantity: 1, unit_price: 0, total: 0 }];

    const { data, setData, post, reset } = useForm({
        job_id: job.id,
        service_request_id: job.service_request_id,
        contractor_name: '',
        job_price: '',
        country: '',
        items: initialItems,
        subtotal: 0,
        discount: 0,
        tax_rate: 10,
        tax: 0,
        total: 0,
        deposit_required: 0
    });

    const recalculate = (items = data.items, discount = data.discount) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        console.log(subtotal);
        const discountAmount = discount || 0;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (data.tax_rate / 100);
        const total = taxableAmount + taxAmount;

        setData(prev => ({
            ...prev,
            items,
            subtotal,
            tax: taxAmount,
            total,
            discount
        }));
    };

    const updateItem = (index: number, updates: Partial<typeof data.items[0]>) => {
        const updatedItems = [...data.items];
        const currentItem = updatedItems[index];

        const newItem = {
            ...currentItem,
            ...updates
        };

        if ('quantity' in updates || 'unit_price' in updates) {
            newItem.total = newItem.quantity * newItem.unit_price;
        }

        updatedItems[index] = newItem;
        setData(prev => ({ ...prev, items: updatedItems }));
        recalculate(updatedItems);
    };

    const handleSelectValueChange = (selectedId: string, index: number) => {
        const service = services.find((s) => s.id.toString() === selectedId);
        if (!service) return;

        updateItem(index, {
            name: service.title,
            description: service.description,
            unit_price: parseFloat(service.unit_price)
        });
    };

    const addLineItem = () => {
        setData(prev => ({
            ...prev,
            items: [...prev.items, { name: '', description: '', quantity: 1, unit_price: 0, total: 0 }]
        }));
    };

    const removeLineItem = (index: number) => {
        const updatedItems = data.items.filter((_, i) => i !== index);
        setData(prev => ({ ...prev, items: updatedItems }));
        recalculate(updatedItems);
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDiscount = parseFloat(e.target.value) || 0;
        setData(prev => ({ ...prev, discount: newDiscount }));
        recalculate(data.items, newDiscount);
    };

    const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
    const toggleItem = (id: number) => {
        setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));


    };
    const allItemsChecked = priceItem.items?.length > 0 && priceItem.items.every((item: any) => checkedItems[item.id]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/jobs/price-add', {
            onSuccess: () => reset()
        });
    };

    useEffect(() => {
        recalculate(data.items, data.discount);
        // rest of your code
        if (flash?.success) {
            console.log('Flash content:', flash);
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Details" />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={`Job Details`}>
                    <Button>
                        <Link href={`/jobs/${job.id}/edit`} className="flex items-center gap-1">
                            <Edit />
                            Edit
                        </Link>
                    </Button>
                </PageHeadingButtons>

                <JobDetailsCard job={job} approved={price[0]?.is_approved} asignedContractor={asignedContractor} />

                {price[0]?.is_approved && (
                    <>
                        {role === 'contractor' && (
                            <>
                                {checkQuotePending && (
                                    <div className={'grid grid-cols-3 gap-5'}>
                                        <Start job={job} prePhotos={prePhotos} price={priceItem} />
                                        <div className={'mt-[105px]'}>
                                            {priceItem.items && priceItem.items.length > 0 && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Checklist - Job Items</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            {priceItem.items.map((item: any) => (
                                                                <label key={item.id}
                                                                       className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!checkedItems[item.id]}
                                                                        onChange={() => toggleItem(item.id)}
                                                                    />
                                                                    <span>{item.quantity} x {item.name}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                        <div>
                                            {(allItemsChecked || job.status === 'completed') &&
                                                <Complete job={job} postPhotos={postPhotos} />}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['admin', 'employee'].includes(role) && (
                        <>
                            {checkQuotePending && (
                                <>
                                    <Card>
                                        <CardHeader><CardTitle>Services</CardTitle></CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {data.items.map((item, index) => (
                                                    <div key={index} className="grid grid-cols-12 gap-4 items-end">
                                                        <div className="col-span-5 space-y-2">
                                                            <Label>Product</Label>
                                                            <Select
                                                                onValueChange={(value) => handleSelectValueChange(value, index)}>
                                                                <SelectTrigger><SelectValue
                                                                    placeholder="Select a service" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Service</SelectLabel>
                                                                        {services.map((service) => (
                                                                            <SelectItem key={service.id}
                                                                                        value={service.id.toString()}>
                                                                                {service.title}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="col-span-2 space-y-2">
                                                            <Label>Unit Price</Label>
                                                            <Input type="number" value={item.unit_price}
                                                                   onChange={(e) => updateItem(index, { unit_price: parseFloat(e.target.value) || 0 })} />
                                                        </div>
                                                        <div className="col-span-2 space-y-2">
                                                            <Label>Qty.</Label>
                                                            <Input type="number" value={item.quantity}
                                                                   onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) || 0 })} />
                                                        </div>
                                                        <div className="col-span-2 space-y-2">
                                                            <Label>Total</Label>
                                                            <Input type="number" value={item.total.toFixed(2)}
                                                                   readOnly />
                                                        </div>
                                                        <div className="col-span-1">
                                                            <Button type="button" variant="ghost" size="icon"
                                                                    onClick={() => removeLineItem(index)}
                                                                    disabled={data.items.length <= 1}>
                                                                <TrashIcon className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button type="button" variant="outline" onClick={addLineItem}
                                                        className="w-full">
                                                    Add Line Item
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle>Quote Summary</CardTitle></CardHeader>
                                        <CardContent className="grid gap-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>${data.subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Tax ({data.tax_rate}%)</span>
                                                <span>${data.tax.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                                <span>Total</span>
                                                <span>${data.total.toFixed(2)}</span>
                                            </div>

                                            <Separator />

                                            <form onSubmit={handleSubmit} className={'space-y-5'}>
                                                <SelectCountry value={''} job_id={job.id} />
                                                <Label htmlFor="quote-amount">Select Contractor</Label>
                                                <Select
                                                    id="contractor"
                                                    className="w-full border rounded-md p-2"
                                                    onValueChange={(value) => setData('contractor_name', value)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a contractor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {contractors.map((contractor) => (
                                                            <SelectItem key={contractor.id}
                                                                        value={contractor.id + ' - ' + contractor.name + ' - ' + contractor.email}>
                                                                {contractor.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Label htmlFor="quote-amount">Job amount</Label>
                                                <Input
                                                    id="quote-amount"
                                                    type={'text'}
                                                    placeholder="Enter Job Amount"
                                                    value={data.total.toFixed(2)}
                                                    onChange={(e) => setData('job_price', e.target.value)}
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline">
                                                        <Link href={'/bookings'}>Cancel</Link>
                                                    </Button>
                                                    <Button type={'submit'} disabled={data.contractor_name === ''}>Send
                                                        Price to Jobber</Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </>
                    )}
                    <Timeline quotes={price} />
                </div>
            </div>
        </AppLayout>
    );
}

// Key-Value List Component
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

export function JobDetailsCard({ job, approved, asignedContractor }) {
    const { client, service_request } = job;
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
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-1"><GitCommitVertical /> Request
                            Status</h3>
                        <Badge
                            className="text-sm">{service_request.status.charAt(0).toUpperCase() + service_request.status.slice(1)}</Badge>
                    </div>
                    <div>
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-1">
                            <GitCommitVertical /> Job Status
                        </h3>
                        <Badge
                            className="text-sm">{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</Badge>
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
                                }
                            ]}
                        />
                    </div>

                    {asignedContractor && (
                        <>
                            <Separator className={'mt-5 mb-5'} />

                            <h3 className="font-medium text-lg mb-2 flex items-center gap-1"><Pickaxe /> Contractor Info
                            </h3>

                            <div className="space-y-4">
                                <KeyValueList
                                    items={[
                                        {
                                            key: 'Asigned to: ',
                                            value: asignedContractor.name
                                        },
                                        {
                                            key: 'Phone: ',
                                            value: asignedContractor.user_detail.phone
                                        },
                                        {
                                            key: 'Email: ',
                                            value: asignedContractor.email
                                        }
                                    ]}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div>
                    <h3 className="font-medium text-lg mb-2">Job details</h3>
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
