import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm } from '@inertiajs/react';

interface User { id: number; name: string; }

export default function Create({ users, recipientId }: { users: User[]; recipientId?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        receiver_id: recipientId || '',
        subject: '',
        body: '',
    });
    const submit = (e: React.FormEvent) => { e.preventDefault(); post(route('messages.store')); };
    const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";

    return (
        <AuthenticatedLayout >
            <Head title="New Message" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="New Message"
                    />
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground">To</label>
                                <select value={data.receiver_id} onChange={(e) => setData('receiver_id', e.target.value)} className={inputClass}>
                                    <option value="">Select recipient</option>
                                    {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                                {errors.receiver_id && <p className="mt-1 text-sm text-destructive">{errors.receiver_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground">Subject</label>
                                <input type="text" value={data.subject} onChange={(e) => setData('subject', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground">Message</label>
                                <textarea value={data.body} onChange={(e) => setData('body', e.target.value)} rows={6} className={inputClass} />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Link href={route('messages.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</Link>
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
