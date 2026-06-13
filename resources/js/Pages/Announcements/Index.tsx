import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
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

function PinIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7.172l-3.586-3.586a1 1 0 00-1.415 0L5.5 8.243a1 1 0 00-.293.707V12a1 1 0 001 1h3.586l-4.5 4.5a1 1 0 001.414 1.414L10.793 14.5V18a1 1 0 001 1 .997.997 0 00.707-.293l4.672-4.672a1 1 0 000-1.414z" />
        </svg>
    );
}

function BellIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
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
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Announcements"
                        description="Stay up to date with course announcements and notifications"
                        actions={
                            canSendAnnouncements() && (
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    {showForm ? 'Cancel' : 'New Announcement'}
                                </button>
                            )
                        }
                    />

                    {/* Create Form */}
                    {showForm && (
                        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Announcement title"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                />
                            </div>
                            <div>
                                <textarea
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    rows={4}
                                    placeholder="Write your announcement content..."
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y min-h-[100px]"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.is_pinned}
                                        onChange={(e) => setData('is_pinned', e.target.checked)}
                                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                                    />
                                    <PinIcon className="h-4 w-4" />
                                    Pin this announcement
                                </label>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <BellIcon className="h-4 w-4" />
                                            Post Announcement
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Announcements List */}
                    {announcements.data.length === 0 ? (
                        <EmptyState
                            title="No announcements yet"
                            description="Announcements will appear here when they are posted."
                            icon={
                                <BellIcon className="h-12 w-12" />
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            {announcements.data.map((a) => (
                                <div
                                    key={a.id}
                                    className={`group relative rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md ${
                                        a.is_pinned ? 'border-accent/30 bg-accent/[0.02]' : 'border-border'
                                    }`}
                                >
                                    {a.is_pinned && (
                                        <div className="absolute -left-0.5 top-0 bottom-0 w-1 rounded-l-xl bg-accent" />
                                    )}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                {a.is_pinned && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                                                        <PinIcon className="h-3 w-3" />
                                                        Pinned
                                                    </span>
                                                )}
                                                <h3 className="font-semibold text-foreground">{a.title}</h3>
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{a.body}</p>
                                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-foreground">
                                                        {a.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                    {a.user.name}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(a.published_at).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                    })}
                                                </span>
                                                {a.course && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        {a.course.title}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {canSendAnnouncements() && (
                                            <button
                                                onClick={() => router.delete(route('announcements.destroy', a.id))}
                                                className="shrink-0 rounded-lg p-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                                                title="Delete announcement"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
