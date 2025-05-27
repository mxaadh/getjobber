import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Edit, EyeIcon, Plus, Trash } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/status-badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients'
    }
];
export default function Show({client}) {
    console.log(client);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="space-y-6 m-2 p-2">


                <div className="grid grid-cols-3 gap-5">
                    <div className={'col-span-2  space-y-5'}>
                        {/* Properties */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Properties</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Street 1</TableHead>
                                            <TableHead>Street 2</TableHead>
                                            <TableHead>City</TableHead>
                                            <TableHead>State</TableHead>
                                            <TableHead>Postal Code</TableHead>
                                            <TableHead>Country</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {client.properties.map((property) => (
                                            <TableRow key={property.id}>
                                                <TableCell className="font-medium">{property.street1}</TableCell>
                                                <TableCell className="font-medium">{property.street2}</TableCell>
                                                <TableCell className="font-medium">{property.city}</TableCell>
                                                <TableCell className="font-medium">{property.state}</TableCell>
                                                <TableCell className="font-medium">{property.postal_code}</TableCell>
                                                <TableCell className="font-medium">{property.country}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Request</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Preferred Day</TableHead>
                                            <TableHead>Alternate Day</TableHead>
                                            <TableHead>Arrival Times</TableHead>
                                            <TableHead>Services</TableHead>
                                            <TableHead>Quote</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {client.service_requests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{format(new Date(request.preferred_day), 'dd/MM/yyyy')}</TableCell>
                                                <TableCell>{format(new Date(request.alternate_day), 'dd/MM/yyyy')}</TableCell>
                                                <TableCell>{request.arrival_times}</TableCell>
                                                <TableCell>{request.cleaning_services}</TableCell>
                                                <TableCell>{request.quote_amount}</TableCell>
                                                <TableCell><StatusBadge status={request.status} /></TableCell>
                                                <TableCell>
                                                    <Button size={'icon'} variant={'ghost'}>
                                                        <Link href={`/bookings/${request.id}`}>
                                                            <EyeIcon className={'text-green-800'} />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Schedule */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h3 className="font-medium mb-2">Generated Inventory</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Verifying Job #1 - Last Cover</li>
                                    <li>W.M. Last History</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Recent Pricing */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent pricing for this property</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Line Item</TableHead>
                                            <TableHead>Owner</TableHead>
                                            <TableHead>Job</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Selected Parties</TableCell>
                                            <TableCell>$15.00*</TableCell>
                                            <TableCell>$25.00*</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Total / Export Checking</TableCell>
                                            <TableCell>$18.00*</TableCell>
                                            <TableCell>$18.00*</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <div className={'space-y-5'}>
                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Name</TableCell>
                                            <TableCell>{client.full_name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Phone</TableCell>
                                            <TableCell>{client.phone}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Email</TableCell>
                                            <TableCell>{client.email}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Joining Data</TableCell>
                                            <TableCell>{client.created_at}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="user-tag" />
                                    <label htmlFor="user-tag" className="text-sm font-medium leading-none">
                                        User Tag
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Last Communication */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Last client communication</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="rpg" />
                                    <label htmlFor="rpg" className="text-sm font-medium leading-none">
                                        For RPG (US)
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="thanks" checked />
                                    <label htmlFor="thanks" className="text-sm font-medium leading-none">
                                        Thanks for your request!
                                    </label>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button variant="outline">View Communication</Button>
                                <Button variant="outline">View All</Button>
                            </CardFooter>
                        </Card>

                        {/* Billing History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing history</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="no-history" />
                                    <label htmlFor="no-history" className="text-sm font-medium leading-none">
                                        No billing history
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="not-biting" checked />
                                    <label htmlFor="not-biting" className="text-sm font-medium leading-none">
                                        This client hasn't been biting yet
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current Balance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Current balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>A call service name $10 means full use</p>
                            </CardContent>
                        </Card>

                        {/* Internal Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Internal notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Internal notes will only be seen by your share</p>
                            </CardContent>
                        </Card>

                        {/* Dealer Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Your dealer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">Dogs you find here or</p>
                                <Button variant="outline">Select a file</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
