import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    bio?: string;
    timezone?: string;
    roles: Array<{ name: string }>;
    created_at: string;
}

export default function Show({ user }: { user: User }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', user.id));
        }
    };

    const roleColors: Record<string, string> = {
        'super-admin': 'bg-destructive/10 text-destructive',
        'system-admin': 'bg-info/10 text-info',
        'instructor': 'bg-accent/10 text-accent-foreground',
        'student': 'bg-success/10 text-success',
        'member': 'bg-muted text-muted-foreground',
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">User Details</h2>}
        >
            <Head title="User Details" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-foreground">{user.name}</h3>
                                <div className="flex gap-2">
                                    <Link href={route('users.edit', user.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                        Edit
                                    </Link>
                                    <button onClick={handleDelete} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                                    <dd className="mt-1 text-sm text-foreground">{user.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${roleColors[user.roles?.[0]?.name] || 'bg-muted text-muted-foreground'}`}>
                                            {user.roles?.[0]?.name || 'No role'}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${user.is_active ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </dd>
                                </div>
                                {user.bio && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Bio</dt>
                                        <dd className="mt-1 text-sm text-foreground">{user.bio}</dd>
                                    </div>
                                )}
                                {user.timezone && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Timezone</dt>
                                        <dd className="mt-1 text-sm text-foreground">{user.timezone}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Member since</dt>
                                    <dd className="mt-1 text-sm text-foreground">
                                        {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
