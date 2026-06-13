import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import { Head, Link, router } from '@inertiajs/react';

interface Sender { id: number; name: string; }

interface Message {
    id: number;
    subject: string;
    body: string;
    read_at?: string;
    sender: Sender;
    created_at: string;
}

interface PaginatedData {
    data: Message[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export default function Index({ inbox, unreadCount }: { inbox: PaginatedData; unreadCount: number }) {
    return (
        <AuthenticatedLayout >
            <Head title="Messages" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Messages"
                    />
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-medium text-foreground">Inbox</h2>
                            {unreadCount > 0 && (
                                <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>
                        <Link href={route('messages.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">New Message</Link>
                    </div>

                    {inbox.data.length === 0 ? (
                        <EmptyState
                            title="No messages"
                            description="Your inbox is empty. Send a message to get started."
                            action={
                                <Link href={route('messages.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                    Send Message
                                </Link>
                            }
                        />
                    ) : (
                        <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg">
                            <div className="divide-y divide-border">
                                {inbox.data.map((m) => (
                                    <Link key={m.id} href={route('messages.show', m.id)} className={`block p-4 transition-colors hover:bg-muted/50 ${!m.read_at ? 'bg-accent/5' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {!m.read_at && (
                                                    <span className="h-2 w-2 rounded-full bg-accent" />
                                                )}
                                                <div>
                                                    <p className={`text-sm ${!m.read_at ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                                                        {m.sender.name}
                                                    </p>
                                                    <p className={`text-sm ${!m.read_at ? 'font-medium text-foreground' : 'text-foreground'}`}>
                                                        {m.subject}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{m.body}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <Pagination links={inbox.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
