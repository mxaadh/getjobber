import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients',
    },
    {
        title: 'Add Clients',
        href: '/clients/create',
    },
];

export default function Create() {
    const { data, setData, post, reset } = useForm({
        first_name: '',
        last_name: '',
        company_name: '',
        phone: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/clients");
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
                {/* New Client Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>New Client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Primary contact details</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Provide the main point of contact to ensure smooth communication and reliable client
                                records.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input id="first-name" placeholder="Enter first name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input id="last-name" placeholder="Enter last name" />
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <Label htmlFor="company-name">Company name</Label>
                                <Input id="company-name" placeholder="Enter company name" />
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium">Communication</h4>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone number</Label>
                                    <Input id="phone" placeholder="Enter phone number" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Enter email" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium">Communication settings</h4>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="email-consent" />
                                <Label htmlFor="email-consent">Email communication preferred</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="sms-consent" />
                                <Label htmlFor="sms-consent">SMS communication preferred</Label>
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
                                <Input id="street1" placeholder="Enter street address" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="street2">Street 2 (Optional)</Label>
                                <Input id="street2" placeholder="Apartment, suite, etc." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="Enter city" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" placeholder="Enter state" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="postal-code">Postal code</Label>
                                    <Input id="postal-code" placeholder="Enter postal code" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="af">Afghanistan</SelectItem>
                                            <SelectItem value="us">United States</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="ca">Canada</SelectItem>
                                            <SelectItem value="au">Australia</SelectItem>
                                            {/* Add more countries as needed */}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="same-billing" defaultChecked />
                                <Label htmlFor="same-billing">Billing address is the same as property address</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Client</Button>
                </div>
            </form>
        </AppLayout>
    );
}
