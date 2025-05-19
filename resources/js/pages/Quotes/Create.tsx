import { Head, useForm } from '@inertiajs/react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { TrashIcon } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quotes',
        href: '/quotes',
    },
    {
        title: 'Add Quotes',
        href: '/quotes/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        client_id: 1,
        client_name: "",
        job_title: "",
        quote_number: `QT-${Date.now()}`,
        quote_date: new Date().toISOString().slice(0, 10),
        rate_opportunity: 3,
        items: [
            { name: "", description: "", quantity: 1, unit_price: 0, total: 0 }
        ],
        client_message: "This quote is valid for a period of 10 days...",
        contract: "Bond Back Guarantee terms...",
        internal_notes: "",
        link_to_jobs: false,
        link_to_invoices: false,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/quotes");
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Quote" />
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
                {/* Client Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quote for Client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="client-name">Client Name</Label>
                                <Input
                                    id="client-name"
                                    value={data.client_name}
                                    onChange={(e) => setData('client_name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="job-title">Job Title</Label>
                                <Input
                                    id="job-title"
                                    value={data.job_title}
                                    onChange={(e) => setData('job_title', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Line Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Line Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                                    <div className="col-span-5 space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={item.name}
                                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Qty.</Label>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Unit Price</Label>
                                        <Input
                                            type="number"
                                            value={item.unit_price}
                                            onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Total</Label>
                                        <Input
                                            type="number"
                                            value={item.total.toFixed(2)}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLineItem(index)}
                                            disabled={data.items.length <= 1}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addLineItem} className="w-full">
                                Add Line Item
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quote Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quote Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${data.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span>Discount</span>
                                <Input
                                    type="number"
                                    className="w-24"
                                    value={data.discount}
                                    onChange={(e) => {
                                        setData('discount', parseFloat(e.target.value) || 0);
                                        recalculate();
                                    }}
                                />
                            </div>
                            <span>-${data.discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span>Tax ({data.tax_rate}%)</span>
                            </div>
                            <span>${data.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>${data.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <span>Required deposit</span>
                            <Input
                                type="number"
                                className="w-24"
                                value={data.deposit_required}
                                onChange={(e) => setData('deposit_required', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contract/Disclaimer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contract / Disclaimer</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                            <Label>Quote Validity</Label>
                            <Textarea
                                value={data.client_message}
                                onChange={(e) => setData('client_message', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bond Back Guarantee</Label>
                            <Textarea
                                value={data.contract}
                                onChange={(e) => setData('contract', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Internal Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Internal Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                            <Label>Note details</Label>
                            <Textarea
                                value={data.internal_notes}
                                onChange={(e) => setData('internal_notes', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Button type="button" variant="outline">Select a File</Button>
                            <span className="text-sm text-muted-foreground">or drag files here</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="link-jobs"
                                checked={data.link_to_jobs}
                                onCheckedChange={(checked) => setData('link_to_jobs', Boolean(checked))}
                            />
                            <Label htmlFor="link-jobs">Link note to Jobs</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="link-invoices"
                                checked={data.link_to_invoices}
                                onCheckedChange={(checked) => setData('link_to_invoices', Boolean(checked))}
                            />
                            <Label htmlFor="link-invoices">Link note to Invoices</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Quote'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
