import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';

export default function Dashboard() {
    const { user } = usePage().props.auth;
    const { isSuperAdmin, isInstructor, isStudent, hasRole } = usePermission();

    const role = user?.roles?.[0];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="text-lg font-medium text-foreground">Welcome back, {user?.name}!</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Role: <span className="font-medium text-foreground capitalize">{role || 'No role'}</span>
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href={route('courses.index')} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                Browse Courses
                            </Link>
                            {isStudent() && (
                                <Link href={route('courses.my')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                    My Courses
                                </Link>
                            )}
                            {isSuperAdmin() && (
                                <>
                                    <Link href={route('users.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                        Manage Users
                                    </Link>
                                    <Link href={route('reports.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                        Reports
                                    </Link>
                                    <Link href={route('settings.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                        Settings
                                    </Link>
                                </>
                            )}
                            {(isSuperAdmin() || isInstructor()) && (
                                <Link href={route('reports.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                    Reports
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Role-Specific Content */}
                    {isSuperAdmin() && (
                        <div className="grid gap-6 sm:grid-cols-3">
                            <Link href={route('users.index')} className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
                                <h4 className="text-lg font-medium text-foreground">Users</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Manage system users and roles</p>
                            </Link>
                            <Link href={route('courses.index')} className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
                                <h4 className="text-lg font-medium text-foreground">Courses</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Manage courses and content</p>
                            </Link>
                            <Link href={route('reports.index')} className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
                                <h4 className="text-lg font-medium text-foreground">Reports</h4>
                                <p className="mt-1 text-sm text-muted-foreground">View analytics and reports</p>
                            </Link>
                        </div>
                    )}

                    {isInstructor() && (
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Link href={route('courses.index')} className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
                                <h4 className="text-lg font-medium text-foreground">My Courses</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Manage your courses and assessments</p>
                            </Link>
                            <Link href={route('announcements.index')} className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
                                <h4 className="text-lg font-medium text-foreground">Announcements</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Post course announcements</p>
                            </Link>
                        </div>
                    )}

                    {isStudent() && (
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Link href={route('courses.my')} className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
                                <h4 className="text-lg font-medium text-foreground">My Courses</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Continue learning</p>
                            </Link>
                            <Link href={route('discussions.index')} className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
                                <h4 className="text-lg font-medium text-foreground">Discussions</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Join course discussions</p>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
