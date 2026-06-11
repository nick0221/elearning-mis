import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
}

export default function Index({ inbox }: { inbox: PaginatedData }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Messages</h2>}>
            <Head title="Messages" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-end">
                        <Link href={route('messages.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">New Message</Link>
                    </div>
                    <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg">
                        {inbox.data.length === 0 ? (
                            <p className="p-6 text-center text-sm text-muted-foreground">No messages.</p>
                        ) : (
                            <div className="divide-y divide-border">
                                {inbox.data.map((m) => (
                                    <Link key={m.id} href={route('messages.show', m.id)} className={`block p-4 hover:bg-muted/50 ${!m.read_at ? 'bg-accent/5' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={`text-sm ${!m.read_at ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{m.sender.name}</p>
                                                <p className="text-sm text-foreground">{m.subject}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
