import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BookingTimeline } from '@/components/timeline';
import { format } from 'date-fns';
import { Edit, GitCommitVertical, LocateIcon, PhoneCall, TrashIcon, ExternalLink, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { SharedData } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Bookings', href: '/requests' },
    { title: 'Booking Detail', href: '#' }
];

export default function Show({ request, quotes, approvedQuotes, services }: {
    request: any;
    quotes: any;
    approvedQuotes: any;
    services: any[]
}) {
    const { auth } = usePage<SharedData>().props;
    const { role } = auth.user;

    const initialItems = quotes.length && quotes[0].items.length
        ? quotes[0].items.map((item: any) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price),
            total: parseFloat(item.total)
        }))
        : [{ name: '', description: '', quantity: 1, unit_price: 0, total: 0 }];

    const { email, full_name, address } = request.client;
    const { data, setData, post, reset } = useForm({
        service_request_id: request.id,
        customer_name: full_name,
        customer_email: email,
        customer_address: address,
        quote_amount: '',
        items: initialItems,
        subtotal: 0,
        discount: 0,
        tax_rate: 10,
        tax: 0,
        total: 0,
        deposit_required: 0
    });
    const [showDiscoutn, setShowDiscount] = React.useState(false);
    const [addTax, setAddTax] = React.useState(false);

    const recalculate = (items = data.items, discount = data.discount) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/requests/quote-add', {
            onSuccess: () => reset()
        });
    };

    // Replace the empty handleCheckedChange function with this:
    const handleCheckedChange = (checked: boolean) => {
        const depositRequired = checked ? data.total * 0.2 : 0;
        setData(prev => ({
            ...prev,
            deposit_required: depositRequired
        }));
    };

    useEffect(() => {
        recalculate(data.items, data.discount);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Details" />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={`Bookings Details for ${request.client_name}`}>
                    <Button>
                        <Link href={`/requests/${request.id}/edit`} className="flex items-center gap-1">
                            <Edit /> Edit
                        </Link>
                    </Button>
                </PageHeadingButtons>

                <DetailsCard client={request.client} service_request={request} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['admin', 'employee'].includes(role) && (
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
                                                    <Input type="number" value={item.total.toFixed(2)} readOnly />
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
                                    <div className="flex justify-between items-center space-y-5">
                                        <span>Discount</span>
                                        {showDiscoutn && (
                                            <Input type="number" className="w-24" value={data.discount}
                                                   min={0}
                                                   onChange={handleDiscountChange} />
                                        )}
                                        <div className="flex items-center gap-2">
                                            {showDiscoutn ? (
                                                <span>
                                                    <Button size="icon" variant="ghost"
                                                            onClick={() => setShowDiscount(false)}><Trash
                                                        className="text-red-800" /></Button>
                                                    <span>-${data.discount.toFixed(2)}</span>
                                                </span>
                                            ) : (
                                                <b onClick={() => setShowDiscount(true)} className={'cursor-pointer'}>Add
                                                    Discount</b>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Tax</span>

                                        {addTax && (
                                            <Input
                                                type="number"
                                                className="w-24"
                                                min={0}
                                                value={data.tax_rate}
                                                onChange={(e) => {
                                                    const newRate = parseFloat(e.target.value) || 0;
                                                    setData(prev => ({ ...prev, tax_rate: newRate }));
                                                    recalculate(data.items, data.discount);
                                                }}
                                            />
                                        )}

                                        {addTax ? (
                                            <span className="flex items-center gap-2">
                                              <Button
                                                  size="icon"
                                                  variant="ghost"
                                                  onClick={() => {
                                                      setAddTax(false);
                                                      setData(prev => ({ ...prev, tax_rate: 0 }));
                                                      recalculate(data.items, data.discount);
                                                  }}
                                              >
                                                <Trash className="text-red-800" />
                                              </Button>
                                              <span>${data.tax.toFixed(2)}</span>
                                            </span>
                                        ) : (
                                            <b
                                                onClick={() => {
                                                    setAddTax(true);
                                                    setData(prev => ({ ...prev, tax_rate: 10 })); // Default to 10% when enabling
                                                    recalculate(data.items, data.discount);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                Add Tax
                                            </b>
                                        )}
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${data.total.toFixed(2)}</span>
                                    </div>
                                    <Separator />

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="deposit"
                                                checked={data.deposit_required > 0}
                                                onCheckedChange={(checked) => handleCheckedChange(!!checked)}
                                            />
                                            <Label htmlFor="deposit">
                                                Required deposit (20%)
                                            </Label>
                                        </div>
                                        <span>${(data.deposit_required || data.total * 0.2).toFixed(2)}</span>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                        <Label htmlFor="quote-amount">Quote amount</Label>
                                        <Input
                                            id="quote-amount"
                                            type="text"
                                            placeholder="Enter Quote Amount"
                                            value={data.total.toFixed(2)}
                                            readOnly={true}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline">
                                                <Link href={'/requests'}>Cancel</Link>
                                            </Button>
                                            <Button type="submit" disabled={approvedQuotes}>Send Quote</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <BookingTimeline quotes={quotes} deposit={request.deposit_amount} />
                </div>
            </div>
        </AppLayout>
    );
}

function KeyValueList({ items }: { items: { key: string; value: React.ReactNode }[] }) {
    return (
        <ul className="grid gap-3">
            {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-muted-foreground">{item.key}</Label>
                    <span className="text-sm font-medium">{item.value}</span>
                </li>
            ))}
        </ul>
    );
}

function DetailsCard({ client, service_request }: { client: any; service_request: any }) {
    return (
        <Card className="w-full">
            <CardHeader><CardTitle className="text-2xl">{client.full_name}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 grid-rows-1 gap-4 space-y-4">
                <div className="space-y-5">
                    <div>
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-1"><LocateIcon /> Property address
                        </h3>
                        <p className="text-sm">{client.address}</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-1"><GitCommitVertical /> Booking
                            Status</h3>
                        <Badge
                            className="text-sm">{service_request.status.charAt(0).toUpperCase() + service_request.status.slice(1)}</Badge>
                    </div>
                </div>
                <div className="w-[280px]">
                    <h3 className="font-medium text-lg mb-2 flex items-center gap-1"><PhoneCall /> Contact details</h3>
                    <div className="space-y-4">
                        <KeyValueList items={[
                            { key: 'Phone: ', value: client.phone },
                            { key: 'Email: ', value: client.email }
                        ]} />
                    </div>
                </div>
                <div>
                    <h3 className="font-medium text-lg mb-2">Booking details</h3>
                    <div className="space-y-4">
                        <KeyValueList items={[
                            {
                                key: 'Cleaning Services',
                                value: service_request.cleaning_services.map((service: any) => (
                                    <Badge key={service} className="text-sm font-medium ml-2">{service}</Badge>
                                ))
                            },
                            {
                                key: 'Preferred Day',
                                value: format(new Date(service_request.preferred_day), 'dd/MM/yyyy')
                            },
                            {
                                key: 'Alternate Day',
                                value: format(new Date(service_request.alternate_day), 'dd/MM/yyyy')
                            },
                            {
                                key: 'Arrival Times',
                                value: service_request.arrival_times.map((time: any) => (
                                    <Badge key={time} className="text-sm font-medium ml-2">{time}</Badge>
                                ))
                            }
                        ]} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
