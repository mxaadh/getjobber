import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArchiveRestore, Briefcase, ContactRound, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid
    }

];

const bookingNavItems: NavItem[] = [
    {
        title: 'Clients',
        href: '/clients',
        icon: ContactRound
    },
    {
        title: 'Bookings',
        href: '/bookings',
        icon: ArchiveRestore
    },
    // {
    //     title: 'Quotes',
    //     href: '/quotes',
    //     icon: Stamp,
    // },
    {
        title: 'Jobs',
        href: '/jobs',
        icon: Briefcase
    }
    // {
    //     title: 'Invoices',
    //     href: '/invoices',
    //     icon: ReceiptText,
    // },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: Users
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo/>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain platform={'Booking'} items={bookingNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
