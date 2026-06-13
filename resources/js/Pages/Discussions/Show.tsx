import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface User { id: number; name: string; }
interface Reply { id: number; body: string; created_at: string; user: User; parent_id?: number; parent?: Reply; }
interface Discussion { id: number; title: string; body: string; is_locked: boolean; user: User; course: { id: number; title: string }; replies: Reply[]; }

function LockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

function formatRelativeTime(dateString: string): string {
    const now = Date.now();
    const date = new Date(dateString).getTime();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Show({ discussion }: { discussion: Discussion }) {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, reset } = useForm({ body: '', parent_id: null as number | null });
    const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('discussions.reply', discussion.id), {
            onSuccess: () => { reset(); setReplyTo(null); },
        });
    };

    const handleReplyClick = (replyId: number, replyName: string) => {
        setReplyTo({ id: replyId, name: replyName });
        setData('parent_id', replyId);
    };

    const cancelReply = () => {
        setReplyTo(null);
        setData('parent_id', null);
    };

    const topLevelReplies = discussion.replies.filter((r) => !r.parent_id);

    return (
        <AuthenticatedLayout>
            <Head title={discussion.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title={discussion.title}
                        section={discussion.course.title}
                        breadcrumbs={[
                            { label: 'Discussions', href: route('discussions.index') },
                        ]}
                    />

                    {/* Original Post */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-base font-semibold text-accent">
                                {discussion.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">{discussion.user.name}</span>
                                    <span className="text-xs text-muted-foreground">·</span>
                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                        <CalendarIcon className="h-3 w-3" />
                                        {formatRelativeTime(discussion.created_at)}
                                    </span>
                                    {discussion.is_locked && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                            <LockIcon className="h-3 w-3" />
                                            Locked
                                        </span>
                                    )}
                                </div>
                                <p className="mt-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">{discussion.body}</p>
                            </div>
                        </div>
                    </div>

                    {/* Replies Section Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground">
                            {discussion.replies.length} {discussion.replies.length === 1 ? 'Reply' : 'Replies'}
                        </h3>
                    </div>

                    {/* Reply Threads */}
                    {topLevelReplies.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
                            <p className="text-sm text-muted-foreground">No replies yet. Be the first to respond!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topLevelReplies.map((reply) => {
                                const children = discussion.replies.filter((r) => r.parent_id === reply.id);
                                return (
                                    <div key={reply.id}>
                                        {/* Parent Reply */}
                                        <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm hover:border-accent/20">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                                                    {reply.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-foreground">{reply.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">·</span>
                                                        <span className="text-xs text-muted-foreground">{formatRelativeTime(reply.created_at)}</span>
                                                    </div>
                                                    <p className="mt-1.5 text-sm text-foreground leading-relaxed">{reply.body}</p>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        {!discussion.is_locked && (
                                                            <button
                                                                onClick={() => handleReplyClick(reply.id, reply.user.name)}
                                                                className="text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
                                                            >
                                                                Reply
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nested Children */}
                                        {children.length > 0 && (
                                            <div className="ml-6 mt-2 space-y-2 border-l-2 border-border/50 pl-4">
                                                {children.map((child) => (
                                                    <div key={child.id} className="rounded-lg border border-border/60 bg-card/50 p-4 transition-all hover:bg-card">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/5 text-xs font-semibold text-accent">
                                                                {child.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-foreground">{child.user.name}</span>
                                                                    {child.parent && (
                                                                        <span className="text-xs text-muted-foreground">
                                                                            replying to <span className="font-medium text-foreground/70">{child.parent.user?.name || 'someone'}</span>
                                                                        </span>
                                                                    )}
                                                                    <span className="text-xs text-muted-foreground">·</span>
                                                                    <span className="text-xs text-muted-foreground">{formatRelativeTime(child.created_at)}</span>
                                                                </div>
                                                                <p className="mt-1 text-sm text-foreground leading-relaxed">{child.body}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Reply Form */}
                    {!discussion.is_locked ? (
                        <form onSubmit={submitReply} className={cn(
                            'rounded-xl border bg-card p-5 shadow-sm space-y-4 transition-all',
                            replyTo ? 'border-accent/30 ring-1 ring-accent/20' : 'border-border'
                        )}>
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                                    {(user as { name: string }).name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-foreground">Join the conversation</span>
                                {replyTo && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                                        Replying to {replyTo.name}
                                        <button type="button" onClick={cancelReply} className="ml-0.5 hover:text-accent/70">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                )}
                            </div>
                            <textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                rows={3}
                                placeholder={replyTo ? `Reply to ${replyTo.name}...` : 'Write a reply...'}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{data.body.length}/2000</span>
                                <div className="flex items-center gap-2">
                                    {replyTo && (
                                        <button type="button" onClick={cancelReply} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing || !data.body.trim()}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors"
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
                                            'Post Reply'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
                            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <LockIcon className="h-4 w-4" />
                                This discussion is locked. New replies cannot be added.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
