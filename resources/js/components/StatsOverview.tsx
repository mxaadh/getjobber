import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp } from 'lucide-react';
import React from 'react';

export default function StatsOverview({stats}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {
                stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{stat.title}</CardTitle>
                            <CardDescription>{stat.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                {stat.icon}
                                <span className="text-2xl font-bold">{stat.value}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    );
}
