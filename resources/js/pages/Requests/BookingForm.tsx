import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
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
        internal_notes: ''
    });

    // if (edit) {
    //     setData('client_id', edit.client_id);
    // }

    const handleCheckboxArray = (field: string, value: string) => {
        setData(field, data[field].includes(value)
            ? data[field].filter((v: string) => v !== value)
            : [...data[field], value]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bookings', {
            onSuccess: () => reset()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-start gap-4">
                <h2 className="text-2xl font-bold">{title ?? 'Booking for'}</h2>

                <div className="w-full max-w-sm"> {/* You can control the max width here */}
                    <Select onValueChange={(value) => setData('client_name', value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Client" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Clients</SelectLabel>
                                {clients.map((client) => <SelectItem key={client.id} value={client.id +' - '+ client.full_name}>{client.full_name}</SelectItem>)}
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


            <div>
                <h3 className="font-semibold">Cleaning Services</h3>
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
            </div>

            <div>
                <h3 className="font-semibold">Your Availability</h3>
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
            </div>

            <Card>
                <CardContent className="space-y-4 p-4">
                    <h3 className="font-semibold">Internal Notes</h3>
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
