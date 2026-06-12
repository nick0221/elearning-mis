import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';

export default function Dashboard() {
    const { user } = usePage().props.auth;
    const { isSuperAdmin, isInstructor, isStudent } = usePermission();

    const role = user?.roles?.[0];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Card */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground">Welcome back, {user?.name}!</h3>
                                <p className="text-sm text-muted-foreground">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                        {role || 'No role'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href={route('courses.index')} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                Browse Courses
                            </Link>
                            {isStudent() && (
                                <Link href={route('courses.my')} className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    My Courses
                                </Link>
                            )}
                            {isSuperAdmin() && (
                                <>
                                    <Link href={route('users.index')} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        Manage Users
                                    </Link>
                                    <Link href={route('reports.index')} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        Reports
                                    </Link>
                                    <Link href={route('settings.index')} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Settings
                                    </Link>
                                </>
                            )}
                            {(isSuperAdmin() || isInstructor()) && (
                                <Link href={route('reports.index')} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    Reports
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Role-Specific Content */}
                    {isSuperAdmin() && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Link href={route('users.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">Users</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Manage system users and roles</p>
                            </Link>
                            <Link href={route('courses.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">Courses</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Manage courses and content</p>
                            </Link>
                            <Link href={route('reports.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">Reports</h4>
                                <p className="mt-1 text-xs text-muted-foreground">View analytics and reports</p>
                            </Link>
                            <Link href={route('announcements.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">Announcements</h4>
                                <p className="mt-1 text-xs text-muted-foreground">System-wide announcements</p>
                            </Link>
                        </div>
                    )}

                    {isInstructor() && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href={route('courses.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">My Courses</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Manage your courses and assessments</p>
                            </Link>
                            <Link href={route('announcements.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">Announcements</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Post course announcements</p>
                            </Link>
                            <Link href={route('discussions.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">Discussions</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Moderate course discussions</p>
                            </Link>
                        </div>
                    )}

                    {isStudent() && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href={route('courses.my')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">My Courses</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Continue learning</p>
                            </Link>
                            <Link href={route('discussions.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">Discussions</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Join course discussions</p>
                            </Link>
                            <Link href={route('announcements.index')} className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                                </div>
                                <h4 className="mt-3 font-medium text-foreground group-hover:text-accent">Announcements</h4>
                                <p className="mt-1 text-xs text-muted-foreground">View course announcements</p>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
