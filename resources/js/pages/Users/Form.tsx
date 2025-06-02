import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { countries } from '@/lib/utils';

interface UserFormProps {
    data: {
        name: string;
        email: string;
        password: string | null;
        role: string;
        phone: string;
        country: string;
        state: string;
        city: string;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    isUpdate?: boolean;
    submitButtonText?: string;
}

export function UserForm({
                             data,
                             setData,
                             errors,
                             onSubmit,
                             processing,
                             isUpdate = false,
                             submitButtonText = 'Create User'
                         }: UserFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Info</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={isUpdate}
                        />
                        {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={isUpdate}
                        />
                        {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="contractor">Contractor</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <div className="text-red-500 text-xs">{errors.role}</div>}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="Phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Address</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select
                                value={data.country}
                                onValueChange={(value) => setData('country', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(countries).map(([code, name]) => (
                                        <SelectItem key={code} value={name}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.country && <div className="text-red-500 text-xs">{errors.country}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                type="text"
                                placeholder="State"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                            />
                            {errors.state && <div className="text-red-500 text-xs">{errors.state}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                type="text"
                                placeholder="City"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                            />
                            {errors.city && <div className="text-red-500 text-xs">{errors.city}</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/users">Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing && <Loader2 className="animate-spin" />}
                    {submitButtonText}
                </Button>
            </div>
        </form>
    );
}
