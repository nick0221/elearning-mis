import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';

interface Course { id: number; title: string; }
interface Enrollment { id: number; status: string; enrolled_at: string; user: { name: string; email: string }; course: { title: string }; }
interface Trend { date: string; count: number; }
interface PaginatedData { data: Enrollment[]; current_page: number; last_page: number; total: number; links: Array<{ url: string | null; label: string; active: boolean }>; }

export default function Enrollments({ enrollments, trends, courses, filters }: {
    enrollments: PaginatedData; trends: Trend[]; courses: Course[]; filters: { course_id?: string; status?: string };
}) {
    return (
        <AuthenticatedLayout >
            <Head title="Enrollment Reports" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Enrollment Reports"
                    />
                    <div className="flex gap-2">
                        <Link href={route('reports.index')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Overview</Link>
                        <Link href={route('reports.enrollments')} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">Enrollments</Link>
                        <Link href={route('reports.performance')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Performance</Link>
                        <Link href={route('reports.activity')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Activity</Link>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => router.get(route('reports.enrollments'), { status: 'enrolled' }, { preserveState: true })} className={`rounded-full px-3 py-1 text-xs font-medium bg-info/10 text-info ${filters.status === 'enrolled' ? 'ring-2 ring-ring' : ''}`}>Enrolled</button>
                        <button onClick={() => router.get(route('reports.enrollments'), { status: 'completed' }, { preserveState: true })} className={`rounded-full px-3 py-1 text-xs font-medium bg-success/10 text-success ${filters.status === 'completed' ? 'ring-2 ring-ring' : ''}`}>Completed</button>
                        <button onClick={() => router.get(route('reports.enrollments'), { status: 'dropped' }, { preserveState: true })} className={`rounded-full px-3 py-1 text-xs font-medium bg-destructive/10 text-destructive ${filters.status === 'dropped' ? 'ring-2 ring-ring' : ''}`}>Dropped</button>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Trends</h3>
                        <div className="flex items-end gap-1 h-32">
                            {trends.length === 0 ? <p className="text-sm text-muted-foreground">No data</p> : trends.map((t, i) => {
                                const max = Math.max(...trends.map(e => e.count));
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center">
                                        <span className="text-xs text-muted-foreground">{t.count}</span>
                                        <div className="w-full bg-accent rounded-t" style={{ height: `${max > 0 ? (t.count / max) * 100 : 0}%`, minHeight: '4px' }} />
                                    </div>
                                );
                            })}
                    </div>

                    <Pagination links={enrollments.links} />
                </div>

                    <div className="rounded-lg border border-border bg-card overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted"><tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Student</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Course</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Date</th>
                            </tr></thead>
                            <tbody className="divide-y divide-border">
                                {enrollments.data.map((e) => (
                                    <tr key={e.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3 text-sm text-foreground">{e.user.name}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{e.course.title}</td>
                                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 text-xs font-semibold ${e.status === 'completed' ? 'bg-success/10 text-success' : e.status === 'dropped' ? 'bg-destructive/10 text-destructive' : 'bg-info/10 text-info'}`}>{e.status}</span></td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(e.enrolled_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
