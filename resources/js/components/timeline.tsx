"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { CircleSmall } from 'lucide-react';

interface BookingQuote {
    id: number;
    booking_id: number;
    quote_amount: string;
    is_approved: boolean;
    approved_at: string | null;
    'is_rejected': boolean;
    'rejected_at': string | null;
    created_at: string;
    updated_at: string;
}

interface TimelineProps {
    quotes: BookingQuote[];
}

// StatusBadge.jsx
export function StatusBadge({ quote }) {
    const status = {
        className: "bg-yellow-100 text-yellow-800",
        label: "Pending",
        title: "Pending approval"
    };

    if (quote.is_approved) {
        status.className = "bg-green-100 text-green-800";
        status.label = "Approved";
        status.title = `Approved on ${new Date(quote.approved_at).toLocaleString()}`;
    } else if (quote.is_rejected) {
        status.className = "bg-red-100 text-red-800";
        status.label = "Rejected";
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

export function Timeline({ quotes }: TimelineProps) {
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
                                    <StatusBadge quote={quote}/>
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
                                                ? "Approved At"
                                                : quote.is_rejected
                                                    ? "Rejected At"
                                                    : "Last Updated"}
                                        </p>
                                        <p className="font-medium">
                                            {quote.is_approved && quote.approved_at
                                                ? format(new Date(quote.approved_at), "MMM d, yyyy h:mm a")
                                                : quote.is_rejected && quote.rejected_at
                                                    ? format(new Date(quote.rejected_at), "MMM d, yyyy h:mm a")
                                                    : format(new Date(quote.updated_at), "MMM d, yyyy h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function BookingTimeline({ quotes }: TimelineProps) {
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
                                    <StatusBadge quote={quote}/>
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
                                                ? "Approved At"
                                                : quote.is_rejected
                                                    ? "Rejected At"
                                                    : "Last Updated"}
                                        </p>
                                        <p className="font-medium">
                                            {quote.is_approved && quote.approved_at
                                                ? format(new Date(quote.approved_at), "MMM d, yyyy h:mm a")
                                                : quote.is_rejected && quote.rejected_at
                                                    ? format(new Date(quote.rejected_at), "MMM d, yyyy h:mm a")
                                                    : format(new Date(quote.updated_at), "MMM d, yyyy h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}

