import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link } from '@inertiajs/react';

interface User { id: number; name: string; email: string; created_at: string; is_active: boolean; }
interface Login { date: string; unique_users: number; }
interface RoleDist { name: string; count: number; }

export default function Activity({ recentUsers, logins, roleDistribution }: {
    recentUsers: User[]; logins: Login[]; roleDistribution: RoleDist[];
}) {
    const maxLogins = Math.max(...logins.map(l => l.unique_users), 1);
    const maxRole = Math.max(...roleDistribution.map(r => r.count), 1);

    return (
        <AuthenticatedLayout >
            <Head title="Activity Reports" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Activity Reports"
                    />
                    <div className="flex gap-2">
                        <Link href={route('reports.index')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Overview</Link>
                        <Link href={route('reports.enrollments')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Enrollments</Link>
                        <Link href={route('reports.performance')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Performance</Link>
                        <Link href={route('reports.activity')} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">Activity</Link>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Active Users (30 days)</h3>
                            {logins.length === 0 ? <p className="text-sm text-muted-foreground">No data</p> : (
                                <div className="flex items-end gap-1 h-32">
                                    {logins.map((l, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center">
                                            <span className="text-xs text-muted-foreground">{l.unique_users}</span>
                                            <div className="w-full bg-info rounded-t" style={{ height: `${(l.unique_users / maxLogins) * 100}%`, minHeight: '4px' }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg border border-border bg-card p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Role Distribution</h3>
                            {roleDistribution.length === 0 ? <p className="text-sm text-muted-foreground">No data</p> : (
                                <div className="space-y-3">
                                    {roleDistribution.map((r, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-32 text-sm text-foreground capitalize">{r.name}</span>
                                            <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                                                <div className="h-full bg-accent rounded transition-all" style={{ width: `${(r.count / maxRole) * 100}%` }} />
                                            </div>
                                            <span className="w-10 text-right text-sm font-medium text-foreground">{r.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Recent Users</h3>
                        <div className="divide-y divide-border">
                            {recentUsers.map((u) => (
                                <div key={u.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                                        <p className="text-xs text-muted-foreground">{u.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${u.is_active ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                            {u.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
