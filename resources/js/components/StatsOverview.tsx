import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp } from 'lucide-react';
import React from 'react';

export default function StatsOverview({title, week, month, all}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* New leads card */}
            <Card>
                <CardHeader>
                    <CardTitle>Weekly {title}</CardTitle>
                    <CardDescription>This week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        {/*<ArrowUp className="h-4 w-4 text-green-500" />*/}
                        <span className="text-2xl font-bold">{week ?? 0}</span>
                    </div>
                </CardContent>
            </Card>

            {/* New clients card */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly {title}</CardTitle>
                    <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        {/*<ArrowUp className="h-4 w-4 text-green-500" />*/}
                        {/*<ArrowUp className="h-4 w-4 text-green-500" />*/}
                        <span className="text-2xl font-bold">{month ?? 0}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Total new clients card */}
            <Card>
                <CardHeader>
                    <CardTitle>Total {title}</CardTitle>
                    <CardDescription>Over All</CardDescription>
                </CardHeader>
                <CardContent>
                    <span className="text-2xl font-bold">{all ?? 0}</span>
                </CardContent>
            </Card>
        </div>
    );
}
