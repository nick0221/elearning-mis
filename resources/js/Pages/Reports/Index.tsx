import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Stats {
    total_users: number;
    total_courses: number;
    total_enrollments: number;
    active_enrollments: number;
    completed_enrollments: number;
    total_submissions: number;
    graded_submissions: number;
}

interface Trend { date: string; count: number; }
interface CourseEnrollment { name: string; count: number; }

export default function Index({ stats, enrollmentTrends, courseEnrollments, recentEnrollments }: {
    stats: Stats;
    enrollmentTrends: Trend[];
    courseEnrollments: CourseEnrollment[];
    recentEnrollments: Array<{ id: number; status: string; enrolled_at: string; user: { name: string }; course: { title: string } }>;
}) {
    const statCards = [
        { label: 'Total Users', value: stats.total_users, color: 'bg-primary/10 text-primary' },
        { label: 'Total Courses', value: stats.total_courses, color: 'bg-accent/10 text-accent-foreground' },
        { label: 'Total Enrollments', value: stats.total_enrollments, color: 'bg-info/10 text-info' },
        { label: 'Active Enrollments', value: stats.active_enrollments, color: 'bg-success/10 text-success' },
        { label: 'Completed', value: stats.completed_enrollments, color: 'bg-success/10 text-success' },
        { label: 'Submissions', value: stats.total_submissions, color: 'bg-warning/10 text-warning' },
    ];

    const maxEnrollments = Math.max(...courseEnrollments.map(c => c.count), 1);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Reports & Analytics</h2>}>
            <Head title="Reports" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="flex gap-2">
                        <Link href={route('reports.index')} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">Overview</Link>
                        <Link href={route('reports.enrollments')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Enrollments</Link>
                        <Link href={route('reports.performance')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Performance</Link>
                        <Link href={route('reports.activity')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Activity</Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {statCards.map((s) => (
                            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className="mt-1 text-3xl font-bold text-foreground">{s.value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

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
                                        <div key={i} className="flex-1 flex flex-col items-center">
                                            <span className="text-xs text-muted-foreground mb-1">{t.count}</span>
                                            <div className="w-full bg-accent rounded-t" style={{ height: `${Math.max(height, 4)}%` }} />
                                            <span className="text-xs text-muted-foreground mt-1">{new Date(t.date).getDate()}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
                                        <span className="w-40 truncate text-sm text-foreground">{c.name}</span>
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
                        <h3 className="mb-4 text-lg font-medium text-foreground">Recent Enrollments</h3>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
