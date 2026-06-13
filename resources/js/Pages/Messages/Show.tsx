import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, router } from '@inertiajs/react';

interface Sender { id: number; name: string; }
interface Receiver { id: number; name: string; }

interface Message {
    id: number;
    subject: string;
    body: string;
    read_at?: string;
    sender: Sender;
    receiver: Receiver;
    created_at: string;
}

export default function Show({ message }: { message: Message }) {
    const handleDelete = () => {
        router.delete(route('messages.destroy', message.id));
    };

    return (
        <AuthenticatedLayout >
            <Head title={message.subject} />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title={message.subject}
                    />
                    <div className="bg-card shadow-sm sm:rounded-lg p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">From: <span className="font-medium text-foreground">{message.sender.name}</span></p>
                                <p className="text-sm text-muted-foreground">To: <span className="font-medium text-foreground">{message.receiver.name}</span></p>
                                <p className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('messages.create', { recipient_id: message.sender.id })} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Reply</Link>
                                <button onClick={handleDelete} className="rounded-md border border-destructive px-3 py-1 text-sm text-destructive hover:bg-destructive/10">Delete</button>
                            </div>
                        </div>
                        <div className="border-t border-border pt-4">
                            <p className="text-foreground whitespace-pre-wrap">{message.body}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
