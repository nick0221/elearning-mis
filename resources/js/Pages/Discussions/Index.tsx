import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { Input } from '@/Components/ui/input';
import { Select } from '@/Components/ui/select';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { cn, formatRelativeTime } from '@/lib/utils';

interface User { id: number; name: string; }
interface Course { id: number; title: string; }

interface Discussion {
    id: number;
    title: string;
    is_pinned: boolean;
    is_locked: boolean;
    user: User;
    course: Course;
    replies: Array<{ id: number }>;
    created_at: string;
}

interface PaginatedData {
    data: Discussion[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

function PinIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7.172l-3.586-3.586a1 1 0 00-1.415 0L5.5 8.243a1 1 0 00-.293.707V12a1 1 0 001 1h3.586l-4.5 4.5a1 1 0 001.414 1.414L10.793 14.5V18a1 1 0 001 1 .997.997 0 00.707-.293l4.672-4.672a1 1 0 000-1.414z" />
        </svg>
    );
}

function LockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );
}

function MessageIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

export default function Index({ discussions, filters, courses }: {
    discussions: PaginatedData;
    filters: { search?: string; course_id?: string };
    courses: Course[];
}) {
    const { canModerateDiscussions } = usePermission();
    const [search, setSearch] = useState(filters.search || '');
    const [courseFilter, setCourseFilter] = useState(filters.course_id || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (courseFilter) params.course_id = courseFilter;
        router.get(route('discussions.index'), params, { preserveState: true });
    };

    const handleCourseFilter = (value: string) => {
        setCourseFilter(value);
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (value) params.course_id = value;
        router.get(route('discussions.index'), params, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setCourseFilter('');
        router.get(route('discussions.index'), {}, { preserveState: true });
    };

    const hasActiveFilters = search || courseFilter;

    return (
        <AuthenticatedLayout>
            <Head title="Discussions" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Discussions"
                        section="Community"
                        description="Ask questions, share ideas, and collaborate with peers"
                        actions={
                            <Link
                                href={route('discussions.create')}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                New Discussion
                            </Link>
                        }
                    />

                    {/* Filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search discussions..." className="pl-10" />
                            </div>
                            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Search</button>
                        </form>
                        <Select value={courseFilter} onChange={(e) => handleCourseFilter(e.target.value)}>
                            <option value="">All courses</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </Select>
                    </div>

                    {/* Active filters indicator */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Filters active</span>
                            <button onClick={clearFilters} className="text-accent hover:text-accent/80 underline underline-offset-2 transition-colors">
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Discussions List */}
                    {discussions.data.length === 0 ? (
                        <EmptyState
                            title="No discussions found"
                            description={hasActiveFilters ? "Try adjusting your search or filters." : "Be the first to start a discussion."}
                            action={
                                <Link href={route('discussions.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                    Start Discussion
                                </Link>
                            }
                        />
                    ) : (
                        <div className="space-y-3">
                            {discussions.data.map((d) => (
                                <Link
                                    key={d.id}
                                    href={route('discussions.show', d.id)}
                                    className={cn(
                                        'group relative block rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5',
                                        d.is_pinned ? 'border-accent/30' : 'border-border'
                                    )}
                                >
                                    {d.is_pinned && (
                                        <div className="absolute -left-0.5 top-2 bottom-2 w-1 rounded-full bg-accent" />
                                    )}
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                                            {d.user.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            {/* Title row */}
                                            <div className="flex items-center gap-2">
                                                {d.is_pinned && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                                                        <PinIcon className="h-3 w-3" />
                                                        Pinned
                                                    </span>
                                                )}
                                                {d.is_locked && (
                                                    <span className="text-muted-foreground" title="Locked">
                                                        <LockIcon className="h-3.5 w-3.5" />
                                                    </span>
                                                )}
                                                <h3 className="truncate font-medium text-foreground group-hover:text-accent transition-colors">
                                                    {d.title}
                                                </h3>
                                            </div>

                                            {/* Metadata */}
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="font-medium text-foreground">{d.user.name}</span>
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium">
                                                    {d.course.title}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {formatRelativeTime(d.created_at)}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <MessageIcon className="h-3 w-3" />
                                                    {d.replies.length}
                                                    {d.replies.length === 1 ? ' reply' : ' replies'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Chevron */}
                                        <svg className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Pagination links={discussions.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
