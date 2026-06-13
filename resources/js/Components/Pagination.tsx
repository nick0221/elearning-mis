import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: Link[];
    from?: number | null;
    to?: number | null;
    total?: number | null;
}

function ChevronLeft({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

function isPrev(label: string): boolean {
    return /Previous/i.test(label) || /&laquo;/.test(label) || /pPrevious/i.test(label);
}

function isNext(label: string): boolean {
    return /Next/i.test(label) || /&raquo;/.test(label) || /Next/i.test(label);
}

function isPageNumber(label: string): boolean {
    return /^\d+$/.test(label.trim());
}

export default function Pagination({ links, from, to, total }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            {from != null && to != null && total != null && (
                <span className="text-sm text-muted-foreground">
                    Showing {from}–{to} of {total}
                </span>
            )}

            <div className="flex items-center gap-1">
                {links.map((link, i) => {
                    if (isPrev(link.label)) {
                        return (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true });
                                }}
                                className={cn(
                                    'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    link.url
                                        ? 'text-foreground hover:bg-muted'
                                        : 'pointer-events-none text-muted-foreground/50'
                                )}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </button>
                        );
                    }

                    if (isNext(link.label)) {
                        return (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true });
                                }}
                                className={cn(
                                    'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    link.url
                                        ? 'text-foreground hover:bg-muted'
                                        : 'pointer-events-none text-muted-foreground/50'
                                )}
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        );
                    }

                    if (isPageNumber(link.label)) {
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    if (link.url) router.get(link.url, {}, { preserveState: true, preserveScroll: true });
                                }}
                                className={cn(
                                    'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground hover:bg-muted'
                                )}
                            >
                                {link.label}
                            </button>
                        );
                    }

                    return (
                        <span
                            key={i}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground/50"
                        >
                            ...
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
