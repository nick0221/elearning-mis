import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

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

export default function Index({ discussions }: { discussions: PaginatedData }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Discussions</h2>}>
            <Head title="Discussions" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-end">
                        <Link href={route('discussions.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">New Discussion</Link>
                    </div>
                    <div className="space-y-3">
                        {discussions.data.map((d) => (
                            <Link key={d.id} href={route('discussions.show', d.id)} className="block rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md">
                                <div className="flex items-center gap-2">
                                    {d.is_pinned && <span className="text-xs text-accent">📌</span>}
                                    {d.is_locked && <span className="text-xs text-muted-foreground">🔒</span>}
                                    <h3 className="font-medium text-foreground">{d.title}</h3>
                                </div>
                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>{d.user.name}</span>
                                    <span>{d.course.title}</span>
                                    <span>{d.replies.length} replies</span>
                                    <span>{new Date(d.created_at).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
