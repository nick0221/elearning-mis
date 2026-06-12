import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

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
    total: number;
}

export default function Index({ discussions, filters }: { discussions: PaginatedData; filters: { search?: string; course_id?: string } }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('discussions.index'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Discussions</h2>}>
            <Head title="Discussions" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search discussions..."
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-64"
                            />
                            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Search</button>
                        </form>
                        <Link href={route('discussions.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">New Discussion</Link>
                    </div>

                    {discussions.data.length === 0 ? (
                        <EmptyState
                            title="No discussions yet"
                            description="Be the first to start a discussion."
                            action={
                                <Link href={route('discussions.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                    Start Discussion
                                </Link>
                            }
                        />
                    ) : (
                        <div className="space-y-3">
                            {discussions.data.map((d) => (
                                <Link key={d.id} href={route('discussions.show', d.id)} className="block rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-accent/50">
                                    <div className="flex items-center gap-2">
                                        {d.is_pinned && <span className="text-xs text-accent">📌</span>}
                                        {d.is_locked && <span className="text-xs text-muted-foreground">🔒</span>}
                                        <h3 className="font-medium text-foreground">{d.title}</h3>
                                    </div>
                                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>{d.user.name}</span>
                                        <span>in {d.course.title}</span>
                                        <span className="flex items-center gap-1">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            {d.replies.length}
                                        </span>
                                        <span>{new Date(d.created_at).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
