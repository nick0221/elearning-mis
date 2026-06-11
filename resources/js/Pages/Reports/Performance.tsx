import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Submission {
    id: number;
    auto_score: number;
    status: string;
    submitted_at: string;
    user: { name: string };
    assessment: { title: string; course: { title: string } };
    grade?: { score: number; max_score: number; feedback?: string };
}

interface AvgScore {
    title: string;
    avg_score: number;
    submission_count: number;
}

interface PaginatedData { data: Submission[]; current_page: number; last_page: number; total: number; }

export default function Performance({ submissions, avgScores }: { submissions: PaginatedData; avgScores: AvgScore[] }) {
    const maxAvg = Math.max(...avgScores.map(a => a.avg_score), 1);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Performance Reports</h2>}>
            <Head title="Performance Reports" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="flex gap-2">
                        <Link href={route('reports.index')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Overview</Link>
                        <Link href={route('reports.enrollments')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Enrollments</Link>
                        <Link href={route('reports.performance')} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">Performance</Link>
                        <Link href={route('reports.activity')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">Activity</Link>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Average Scores by Assessment</h3>
                        {avgScores.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> : (
                            <div className="space-y-3">
                                {avgScores.map((a, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-48 truncate text-sm text-foreground">{a.title}</span>
                                        <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                                            <div className="h-full bg-accent rounded transition-all" style={{ width: `${(a.avg_score / maxAvg) * 100}%` }} />
                                        </div>
                                        <span className="w-16 text-right text-sm font-medium text-foreground">{a.avg_score.toFixed(1)}%</span>
                                        <span className="w-20 text-right text-xs text-muted-foreground">{a.submission_count} submissions</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-border bg-card overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted"><tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Student</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Assessment</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Score</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Date</th>
                            </tr></thead>
                            <tbody className="divide-y divide-border">
                                {submissions.data.map((s) => (
                                    <tr key={s.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3 text-sm text-foreground">{s.user.name}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{s.assessment.title}</td>
                                        <td className="px-4 py-3 text-sm text-foreground">{s.auto_score ?? '-'}</td>
                                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 text-xs font-semibold ${s.status === 'graded' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{s.status}</span></td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '-'}</td>
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
