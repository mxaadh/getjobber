import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import React, { type ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {


    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props} className={'bg-green-200'}>
            {children}
        </AppLayoutTemplate>
    );
}
