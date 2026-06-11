import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface ActivityLog {
    id: number;
    action: string;
    properties: Record<string, unknown>;
    created_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    avatar?: string;
    bio?: string;
    timezone?: string;
    roles: Array<{ name: string }>;
    created_at: string;
    activityLogs: ActivityLog[];
}

export default function Show({ user }: { user: User }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        router.delete(route('users.destroy', user.id));
        setShowDeleteDialog(false);
    };

    const roleColors: Record<string, string> = {
        'super-admin': 'bg-destructive/10 text-destructive',
        'system-admin': 'bg-info/10 text-info',
        'instructor': 'bg-accent/10 text-accent-foreground',
        'student': 'bg-success/10 text-success',
        'member': 'bg-muted text-muted-foreground',
    };

    const actionLabels: Record<string, string> = {
        'user_created': 'Account created',
        'user_updated': 'Profile updated',
        'user_deleted': 'Account deleted',
        'role_changed': 'Role changed',
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">User Details</h2>}
        >
            <Head title="User Details" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* User Info Card */}
                        <div className="lg:col-span-2">
                            <div className="bg-card shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-bold text-muted-foreground">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-medium text-foreground">{user.name}</h3>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={route('users.edit', user.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                                Edit
                                            </Link>
                                            <button onClick={() => setShowDeleteDialog(true)} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <dl className="space-y-4">
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

                        {/* Activity Log Card */}
                        <div>
                            <div className="bg-card shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h4 className="mb-4 text-lg font-medium text-foreground">Recent Activity</h4>
                                    {user.activityLogs && user.activityLogs.length > 0 ? (
                                        <div className="space-y-3">
                                            {user.activityLogs.slice(0, 5).map((log) => (
                                                <div key={log.id} className="border-l-2 border-border pl-3">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {actionLabels[log.action] || log.action}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(log.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                title="Delete User"
                message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </AuthenticatedLayout>
    );
}
