import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients'
    }
];
export default function Show() {
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
                                <div className="space-y-2">
                                    <h3 className="font-medium">Name</h3>
                                    <div className="pl-4 space-y-1">
                                        <p>M. Aa, S.H. Seem K.</p>
                                        <p>Name1</p>
                                        <p className="text-sm text-muted-foreground">Date: 2020/01/03</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Active Work</TableHead>
                                            <TableHead>Requests</TableHead>
                                            <TableHead>Objects</TableHead>
                                            <TableHead>Jobs</TableHead>
                                            <TableHead>Timeless</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Active + Total Over</TableCell>
                                            <TableCell>Scheduled Site</TableCell>
                                            <TableCell>Scheduled Site</TableCell>
                                            <TableCell>M. Aa, S.H. Seem K. Search, Suite 7550</TableCell>
                                            <TableCell className="font-medium">$16.00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Scheduled Site</TableCell>
                                            <TableCell>Scheduled Site</TableCell>
                                            <TableCell>Scheduled Site</TableCell>
                                            <TableCell>M. Aa, S.H. Seem K. Search, Suite 7550</TableCell>
                                            <TableCell className="font-medium">$8.00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Search IT</TableCell>
                                            <TableCell>Scheduled Access</TableCell>
                                            <TableCell>Scheduled Access</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className="font-medium">$6.00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">2 Profi</TableCell>
                                            <TableCell>Scheduled Access</TableCell>
                                            <TableCell>Scheduled Access</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className="font-medium">$5.00</TableCell>
                                        </TableRow>
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
                                <CardTitle>Contact info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Info</TableCell>
                                            <TableCell>+12345678953</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Date</TableCell>
                                            <TableCell>Issued: 06/09/2014 am</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Last Source</TableCell>
                                            <TableCell>Facebook</TableCell>
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
