import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';

export default function StatsOverview({stats, _route}) {
    const handleClick = (title) => {
        return (e) => {
            // Prevent default if it's a link or button
            e.preventDefault()

            // Send a GET request to your endpoint
            router.get(route(_route), { filter: title }, {
                preserveState: true,
                replace: false,
            })
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {
                stats.map((stat, index) => (
                    <Card key={index} onClick={handleClick(stat.title)}>
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
