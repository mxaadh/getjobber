import { Link } from '@inertiajs/react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

export function PaginationComponent({ pagination }) {
    return (
        <Pagination className="justify-end">
            <PaginationContent>
                {/* Previous Page */}
                <PaginationItem>
                    {pagination.prev_page_url ? (
                        <Link href={pagination.prev_page_url} preserveScroll preserveState>
                            <PaginationPrevious />
                        </Link>
                    ) : (
                        <PaginationPrevious className="opacity-50 cursor-not-allowed" />
                    )}
                </PaginationItem>

                {/* Page Numbers */}
                {pagination.links.slice(1, -1).map((link, index) => (
                    <PaginationItem key={index}>
                        {link.url ? (
                            <Link
                                href={link.url}
                                preserveScroll
                                preserveState
                                className={link.active ? 'font-bold' : ''}
                            >
                                <PaginationLink isActive={link.active}>
                                    {link.label}
                                </PaginationLink>
                            </Link>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}

                {/* Next Page */}
                <PaginationItem>
                    {pagination.next_page_url ? (
                        <Link href={pagination.next_page_url} preserveScroll preserveState>
                            <PaginationNext />
                        </Link>
                    ) : (
                        <PaginationNext className="opacity-50 cursor-not-allowed" />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
