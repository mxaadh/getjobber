import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useForm } from '@inertiajs/react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import React from 'react';
import { Input } from '@/components/ui/input';

export default function BookingForm({ title, clients, edit }: { title?: string, clients: any[], edit?: any }) {
    console.log(edit);
    const { data, setData, post, reset } = useForm({
        client_id: '',
        client_name: '',
        title: '',
        cleaning_services: [],
        details: '',
        preferred_day: '',
        alternate_day: '',
        arrival_times: [],
        internal_notes: '',
        items: [
            { name: "", description: "", quantity: 1, unit_price: 0, total: 0 }
        ],
        subtotal: 0,
        discount: 0,
        tax_rate: 10,
        tax: 0,
        total: 0,
        deposit_required: 0,
    });


    const addLineItem = () => {
        setData("items", [...data.items, { name: "", description: "", quantity: 1, unit_price: 0, total: 0 }]);
    };

    const removeLineItem = (index: number) => {
        if (data.items.length <= 1) return;
        const updatedItems = data.items.filter((_, i) => i !== index);
        setData("items", updatedItems);
        recalculate();
    };

    const updateItem = (index: number, field: string, value: any) => {
        const updatedItems = [...data.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        // Recalculate item total if quantity or unit price changes
        if (field === 'quantity' || field === 'unit_price') {
            updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unit_price;
        }

        setData("items", updatedItems);
        recalculate();
    };

    const recalculate = () => {
        const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
        const discountAmount = data.discount || 0;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (data.tax_rate / 100);
        const total = taxableAmount + taxAmount;

        setData({
            ...data,
            subtotal,
            tax: taxAmount,
            total,
        });
    };

    const handleCheckboxArray = (field: string, value: string) => {
        setData(field, data[field].includes(value)
            ? data[field].filter((v: string) => v !== value)
            : [...data[field], value]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/requests', {
            onSuccess: () => reset()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-start gap-4">
                <h2 className="text-2xl font-bold">{title ?? 'Request for'}</h2>

                <div className="w-full max-w-sm"> {/* You can control the max width here */}
                    <Select onValueChange={(value) => setData('client_name', value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Client" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Clients</SelectLabel>
                                {clients.map((client) => <SelectItem key={client.id}
                                                                     value={client.id + ' - ' + client.full_name}>{client.full_name}</SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <p>OR</p>

                <Button className="p-2">
                    <Link href={'/clients/create'} className="flex items-center gap-1">
                        <Plus />
                        New Client
                    </Link>
                </Button>
            </div>

            {/*Cleaning Services*/}
            <Card>
                <CardHeader>
                    <CardTitle>Cleaning Services</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {['End of lease / Bond Cleaning', 'Carpet Steam Cleaning', 'Deep Cleaning', 'Move in Cleaning', 'Weekly / Fortnightly Cleaning'].map((service) => (
                            <div key={service} className="flex items-center space-x-2">
                                <Checkbox id={service}
                                          checked={data.cleaning_services.includes(service)}
                                          onCheckedChange={() => handleCheckboxArray('cleaning_services', service)}
                                />
                                <Label htmlFor={service}>{service}</Label>
                            </div>
                        ))}
                    </div>
                    <Textarea placeholder="Number of bedrooms, bathrooms, and additional details"
                              className="mt-4"
                              value={data.details}
                              onChange={(e) => setData('details', e.target.value)}
                    />
                </CardContent>
            </Card>


            {/*Your Availability*/}
            <Card>
                <CardHeader>
                    <CardTitle>Your Availability</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <Label>Best day for assessment</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.preferred_day ? format(data.preferred_day, 'PPP') : 'Select date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={data.preferred_day}
                                              onSelect={(date) => setData('preferred_day', date)} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label>Alternate day</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.alternate_day ? format(data.alternate_day, 'PPP') : 'Select date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={data.alternate_day}
                                              onSelect={(date) => setData('alternate_day', date)} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label>Preferred arrival times</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            {['Any time', 'Morning', 'Afternoon', 'Evening'].map((time) => (
                                <div key={time} className="flex items-center space-x-2">
                                    <Checkbox id={time}
                                              checked={data.arrival_times.includes(time)}
                                              onCheckedChange={() => handleCheckboxArray('arrival_times', time)}
                                    />
                                    <Label htmlFor={time}>{time}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/*Internal Notes*/}
            <Card>
                <CardHeader>
                    <CardTitle>Internal Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="Note details (visible only to team)"
                              value={data.internal_notes}
                              onChange={(e) => setData('internal_notes', e.target.value)}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button variant="ghost">Cancel</Button>
                <Button className="ml-2" type={'submit'}>{title ? 'Make Booking' : 'Save Booking'}</Button>
            </div>
        </form>
    );
}
