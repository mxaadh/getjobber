import { Head, Link } from '@inertiajs/react';
import PageHeadingButtons from '@/components/page-heading-buttons';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';
import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jobs',
        href: '/jobs'
    }
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Requests" />
            <div className="space-y-6 m-2 p-2">
                <PageHeadingButtons heading={'Jobs'}>
                    <Button>
                        <Link href={`/jobs/create`} className="flex items-center gap-1">
                            <Plus />
                            New Job
                        </Link>
                    </Button>
                </PageHeadingButtons>
            </div>
        </AppLayout>
    );
}
