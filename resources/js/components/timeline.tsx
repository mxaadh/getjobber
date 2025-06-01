import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CircleSmall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

function StatusBadge({ quote }) {
    const status = {
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Pending',
        title: 'Pending approval'
    };

    if (quote.is_approved) {
        status.className = 'bg-green-100 text-green-800';
        status.label = 'Approved';
        status.title = `Approved on ${new Date(quote.approved_at).toLocaleString()}`;
    } else if (quote.is_rejected) {
        status.className = 'bg-red-100 text-red-800';
        status.label = 'Rejected';
        status.title = `Rejected on ${new Date(quote.rejected_at).toLocaleString()}`;
    }

    return (
        <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${status.className}`}
            title={status.title}
        >
            {status.label}
        </span>
    );
}

export function BookingTimeline({ quotes }) {
    const { auth } = usePage<SharedData>().props;
    const { role } = auth.user;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const { data, setData, get } = useForm({
        reason: ''
    });

    const handleApprove = (quote) => {
        get(`/requests/approve/${quote.id}`);
        console.log(`Quote ${quote.id} approved`);
    };

    const handleReject = () => {
        if (selectedQuote && data.reason) {
            get(`/requests/reject/${selectedQuote.id}?reason=${encodeURIComponent(data.reason)}`);
            console.log(`Quote ${selectedQuote.id} rejected for reason: ${data.reason}`);
            setDialogOpen(false);
            setData('reason', ' ');
        }
    };

    return (
        <div className="space-y-8">
            {quotes.map((quote) => (
                <div key={quote.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback><CircleSmall /></AvatarFallback>
                        </Avatar>
                        <div className="w-px bg-gray-200 h-full mt-2" />
                    </div>
                    <div className="flex-1">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Quote #{quote.id}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <StatusBadge quote={quote} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-5 pt-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Booking ID</p>
                                        <p className="font-medium">#{quote.booking_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Amount</p>
                                        <p className="font-medium">
                                            ${parseFloat(quote.quote_amount).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            {quote.is_approved
                                                ? 'Approved At'
                                                : quote.is_rejected
                                                    ? 'Rejected At'
                                                    : 'Last Updated'}
                                        </p>
                                        <p className="font-medium">
                                            {quote.is_approved && quote.approved_at
                                                ? format(new Date(quote.approved_at), 'MMM d, yyyy h:mm a')
                                                : quote.is_rejected && quote.rejected_at
                                                    ? format(new Date(quote.rejected_at), 'MMM d, yyyy h:mm a')
                                                    : format(new Date(quote.updated_at), 'MMM d, yyyy h:mm a')}
                                        </p>
                                    </div>
                                    {quote.reason && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Reason</p>
                                            <p className="font-medium">
                                                {quote.reason}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!quote.is_approved && !quote.is_rejected && (
                                    <div className="mt-4 flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            {role === 'contractor' && (
                                                <>
                                                    <Button className="bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={() => handleApprove(quote)}>Approve</Button>
                                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    setSelectedQuote(quote);
                                                                    setDialogOpen(true);
                                                                }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Reason for Rejection</DialogTitle>
                                                            </DialogHeader>
                                                            <Textarea
                                                                placeholder="Enter reason for rejection"
                                                                value={data.reason}
                                                                onChange={(e) => setData('reason', e.target.value)}
                                                            />
                                                            <DialogFooter>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => setDialogOpen(false)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={handleReject}>Submit</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function Timeline({ quotes }) {
    const { auth } = usePage<SharedData>().props;
    const { role } = auth.user;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const { data, setData, get } = useForm({
        reason: ''
    });

    const handleApprove = (quote) => {
        get(`/prices/${quote.id}/approve`);
        console.log(`Quote ${quote.id} approved`);
    };

    const handleReject = () => {
        if (selectedQuote && data.reason) {
            get(`/prices/${selectedQuote.id}/reject?reason=${encodeURIComponent(data.reason)}`);
            console.log(`Quote ${selectedQuote.id} rejected for reason: ${data.reason}`);
            setDialogOpen(false);
            setData('reason', ' ');
        }
    };

    return (
        <div className="space-y-8">
            {quotes.map((quote) => (
                <div key={quote.id} className="flex items-start gap-4 ">
                    <div className="flex flex-col items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback><CircleSmall /></AvatarFallback>
                        </Avatar>
                        <div className="w-px bg-gray-200 h-full mt-2" />
                    </div>
                    <div className="flex-1">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Quote #{quote.id}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <StatusBadge quote={quote} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 gap-5 pt-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Booking ID</p>
                                        <p className="font-medium">#{quote.service_request_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Job ID</p>
                                        <p className="font-medium">#{quote.service_job_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Amount</p>
                                        <p className="font-medium">
                                            ${parseFloat(quote.job_price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            {quote.is_approved
                                                ? 'Approved At'
                                                : quote.is_rejected
                                                    ? 'Rejected At'
                                                    : 'Last Updated'}
                                        </p>
                                        <p className="font-medium">
                                            {quote.is_approved && quote.approved_at
                                                ? format(new Date(quote.approved_at), 'MMM d, yyyy h:mm a')
                                                : quote.is_rejected && quote.rejected_at
                                                    ? format(new Date(quote.rejected_at), 'MMM d, yyyy h:mm a')
                                                    : format(new Date(quote.updated_at), 'MMM d, yyyy h:mm a')}
                                        </p>
                                    </div>
                                    {quote.reason && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Reason</p>
                                            <p className="font-medium">
                                                {quote.reason}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!quote.is_approved && !quote.is_rejected && (
                                    <div className="mt-4 flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            {role === 'contractor' && (
                                                <>
                                                    <Button className="bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={() => handleApprove(quote)}>Approve</Button>
                                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    setSelectedQuote(quote);
                                                                    setDialogOpen(true);
                                                                }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Reason for Rejection</DialogTitle>
                                                            </DialogHeader>
                                                            <Textarea
                                                                placeholder="Enter reason for rejection"
                                                                value={data.reason}
                                                                onChange={(e) => setData('reason', e.target.value)}
                                                            />
                                                            <DialogFooter>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => setDialogOpen(false)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={handleReject}>Submit</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}
