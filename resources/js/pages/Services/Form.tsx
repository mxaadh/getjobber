import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface FormProps {
    data: {
        title: string;
        description: string;
        unit_price: string | number;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    handleSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    isEdit?: boolean;
}

export default function Form({
                                 data,
                                 setData,
                                 errors,
                                 handleSubmit,
                                 processing,
                                 isEdit = false
                             }: FormProps) {
    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Enter title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <div className="text-red-500 text-xs">{errors.title}</div>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            placeholder="Description of the service"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <div className="text-red-500 text-xs">{errors.description}</div>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unit_price">Unit Price</Label>
                        <Input
                            type="number"
                            placeholder="Price per unit"
                            value={data.unit_price}
                            onChange={(e) => setData('unit_price', e.target.value)}
                        />
                        {errors.unit_price && <div className="text-red-500 text-xs">{errors.unit_price}</div>}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline">
                    <Link href="/services">Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing && <Loader2 className="animate-spin mr-2" />}
                    {isEdit ? 'Update Service' : 'Save Service'}
                </Button>
            </div>
        </form>
    );
}
