import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface User { id: number; name: string; }
interface Course { id: number; title: string; }

interface Announcement {
    id: number;
    title: string;
    body: string;
    is_pinned: boolean;
    published_at: string;
    user: User;
    course?: Course;
}

interface PaginatedData {
    data: Announcement[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function Index({ announcements }: { announcements: PaginatedData }) {
    const { canSendAnnouncements } = usePermission();
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        title: '', body: '', course_id: '', is_pinned: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('announcements.store'), {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Announcements</h2>}>
            <Head title="Announcements" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-4">
                    {canSendAnnouncements() && (
                        <button onClick={() => setShowForm(!showForm)} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                            {showForm ? 'Cancel' : 'New Announcement'}
                        </button>
                    )}

                    {showForm && (
                        <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 space-y-3">
                            <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Title" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
                            <textarea value={data.body} onChange={(e) => setData('body', e.target.value)} rows={3} placeholder="Announcement content..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-foreground">
                                    <input type="checkbox" checked={data.is_pinned} onChange={(e) => setData('is_pinned', e.target.checked)} className="h-4 w-4 rounded border-border text-accent focus:ring-ring" />
                                    Pin this
                                </label>
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Post</button>
                            </div>
                        </form>
                    )}

                    {announcements.data.map((a) => (
                        <div key={a.id} className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {a.is_pinned && <span className="text-xs text-accent">📌</span>}
                                        <h3 className="font-medium text-foreground">{a.title}</h3>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        by {a.user.name} · {new Date(a.published_at).toLocaleDateString()}
                                        {a.course && <> · {a.course.title}</>}
                                    </p>
                                </div>
                                {canSendAnnouncements() && (
                                    <button onClick={() => router.delete(route('announcements.destroy', a.id))} className="text-xs text-destructive hover:text-destructive/80">Delete</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
