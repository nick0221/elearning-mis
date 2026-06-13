import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link } from '@inertiajs/react';

interface Stats {
    total_users: number;
    total_courses: number;
    total_enrollments: number;
    active_enrollments: number;
    completed_enrollments: number;
    total_submissions: number;
    avg_score: number;
    completion_rate: number;
}

interface Trend { date: string; count: number; }
interface CourseEnrollment { name: string; count: number; }
interface RoleDistribution { name: string; count: number; }

export default function Index({ stats, enrollmentTrends, courseEnrollments, recentEnrollments, roleDistribution }: {
    stats: Stats;
    enrollmentTrends: Trend[];
    courseEnrollments: CourseEnrollment[];
    recentEnrollments: Array<{ id: number; status: string; enrolled_at: string; user: { name: string }; course: { title: string } }>;
    roleDistribution: RoleDistribution[];
}) {
    const statCards = [
        {
            label: 'Total Users', value: stats.total_users,
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
            color: 'text-primary', bg: 'bg-primary/10',
        },
        {
            label: 'Published Courses', value: stats.total_courses,
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
            color: 'text-accent', bg: 'bg-accent/10',
        },
        {
            label: 'Total Enrollments', value: stats.total_enrollments,
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            color: 'text-info', bg: 'bg-info/10',
        },
        {
            label: 'Completion Rate', value: `${stats.completion_rate}%`,
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'text-success', bg: 'bg-success/10',
        },
        {
            label: 'Avg Score', value: stats.avg_score ? Math.round(stats.avg_score) : 0,
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
            color: 'text-warning', bg: 'bg-warning/10',
        },
        {
            label: 'Submissions', value: stats.total_submissions,
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
            color: 'text-info', bg: 'bg-info/10',
        },
    ];

    const maxEnrollments = Math.max(...courseEnrollments.map(c => c.count), 1);
    const totalRoleCount = roleDistribution.reduce((acc, r) => acc + r.count, 0);

    return (
        <AuthenticatedLayout >
            <Head title="Reports" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Reports & Analytics"
                    />
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-2">
                        <Link href={route('reports.index')} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">Overview</Link>
                        <Link href={route('reports.enrollments')} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">Enrollments</Link>
                        <Link href={route('reports.performance')} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">Performance</Link>
                        <Link href={route('reports.activity')} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">Activity</Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {statCards.map((s) => (
                            <div key={s.label} className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:-translate-y-0.5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">{s.label}</p>
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color} transition-transform group-hover:scale-110`}>
                                        {s.icon}
                                    </div>
                                </div>
                                <p className={`mt-3 text-3xl font-bold ${s.color} tabular-nums`}>{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Enrollment Trends */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Enrollment Trends (30 days)</h3>
                            {enrollmentTrends.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No data yet.</p>
                            ) : (
                                <div className="flex items-end gap-1 h-40">
                                    {enrollmentTrends.map((t, i) => {
                                        const max = Math.max(...enrollmentTrends.map(e => e.count));
                                        const height = max > 0 ? (t.count / max) * 100 : 0;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center group relative">
                                                <div className="absolute bottom-full mb-1 hidden group-hover:block">
                                                    <span className="rounded bg-foreground px-2 py-1 text-xs text-background whitespace-nowrap">
                                                        {t.count} enrollments
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground mb-1">{t.count}</span>
                                                <div className="w-full bg-accent rounded-t transition-all hover:bg-accent/80" style={{ height: `${Math.max(height, 4)}%` }} />
                                                <span className="text-xs text-muted-foreground mt-1">{new Date(t.date).getDate()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Role Distribution */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">User Roles</h3>
                            {roleDistribution.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No data yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {roleDistribution.map((r, i) => {
                                        const percentage = totalRoleCount > 0 ? Math.round((r.count / totalRoleCount) * 100) : 0;
                                        return (
                                            <div key={i}>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="capitalize text-foreground">{r.name}</span>
                                                    <span className="text-muted-foreground">{r.count} ({percentage}%)</span>
                                                </div>
                                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                                                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Enrollments */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Top Courses by Enrollment</h3>
                        {courseEnrollments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No data yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {courseEnrollments.map((c, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-48 truncate text-sm text-foreground">{c.name}</span>
                                        <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                                            <div className="h-full bg-accent rounded transition-all" style={{ width: `${(c.count / maxEnrollments) * 100}%` }} />
                                        </div>
                                        <span className="w-10 text-right text-sm font-medium text-foreground">{c.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Enrollments */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-foreground">Recent Enrollments</h3>
                            <Link href={route('reports.enrollments')} className="text-sm text-accent hover:text-accent/80">View all →</Link>
                        </div>
                        <div className="divide-y divide-border">
                            {recentEnrollments.map((e) => (
                                <div key={e.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="text-sm text-foreground">{e.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{e.course.title}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${e.status === 'completed' ? 'bg-success/10 text-success' : e.status === 'dropped' ? 'bg-destructive/10 text-destructive' : 'bg-info/10 text-info'}`}>
                                            {e.status}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">{new Date(e.enrolled_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Export Links */}
                    <div className="flex gap-3">
                        <a href={route('reports.export', 'enrollments')} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                            Export Enrollments (CSV)
                        </a>
                        <a href={route('reports.export', 'performance')} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                            Export Performance (CSV)
                        </a>
                        <a href={route('reports.export', 'users')} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                            Export Users (CSV)
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
