import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

interface User { id: number; name: string; }
interface Reply { id: number; body: string; created_at: string; user: User; parent_id?: number; }
interface Discussion { id: number; title: string; body: string; is_locked: boolean; user: User; course: { id: number; title: string }; replies: Reply[]; }

export default function Show({ discussion }: { discussion: Discussion }) {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, reset } = useForm({ body: '', parent_id: null as number | null });
    const [replyTo, setReplyTo] = useState<number | null>(null);

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('discussions.reply', discussion.id), {
            onSuccess: () => { reset(); setReplyTo(null); },
        });
    };

    const replies = discussion.replies.filter((r) => !r.parent_id);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">{discussion.title}</h2>}>
            <Head title={discussion.title} />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <div className="rounded-lg border border-border bg-card p-6">
                        <div className="flex items-center gap-2 mb-2">
                            {discussion.is_locked && <span className="text-xs text-muted-foreground">🔒 Locked</span>}
                            <span className="text-xs text-muted-foreground">{discussion.course.title}</span>
                        </div>
                        <p className="text-foreground">{discussion.body}</p>
                        <p className="mt-4 text-xs text-muted-foreground">by {discussion.user.name} · {new Date(discussion.created_at).toLocaleDateString()}</p>
                    </div>

                    {replies.map((reply) => {
                        const children = discussion.replies.filter((r) => r.parent_id === reply.id);
                        return (
                            <div key={reply.id} className="ml-4 rounded-lg border border-border bg-card p-4">
                                <p className="text-sm text-foreground">{reply.body}</p>
                                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{reply.user.name}</span>
                                    <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                                    {!discussion.is_locked && (
                                        <button onClick={() => { setReplyTo(reply.id); setData('parent_id', reply.id); }} className="text-accent hover:text-accent/80">Reply</button>
                                    )}
                                </div>
                                {children.map((child) => (
                                    <div key={child.id} className="ml-4 mt-3 border-l-2 border-border pl-3">
                                        <p className="text-sm text-foreground">{child.body}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{child.user.name} · {new Date(child.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        );
                    })}

                    {!discussion.is_locked && (
                        <form onSubmit={submitReply} className="rounded-lg border border-border bg-card p-4 space-y-3">
                            {replyTo && <p className="text-xs text-muted-foreground">Replying to comment #{replyTo}</p>}
                            <textarea value={data.body} onChange={(e) => setData('body', e.target.value)} rows={3} placeholder="Write a reply..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" />
                            <div className="flex justify-end gap-2">
                                {replyTo && <button type="button" onClick={() => { setReplyTo(null); setData('parent_id', null); }} className="text-sm text-muted-foreground hover:text-foreground">Cancel reply</button>}
                                <button type="submit" disabled={processing} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50">Post Reply</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
