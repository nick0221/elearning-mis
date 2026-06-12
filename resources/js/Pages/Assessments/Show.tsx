import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';

interface Grade {
    score: number;
    max_score: number;
    feedback?: string;
}

interface Submission {
    id: number;
    attempt_number: number;
    auto_score: number;
    status: string;
    submitted_at?: string;
    user: { name: string };
    grade?: Grade;
}

interface Assessment {
    id: number;
    title: string;
    type: string;
    max_attempts: number;
    time_limit_minutes?: number;
    passing_score: number;
    is_randomized: boolean;
    course: { id: number; title: string };
    submissions: Submission[];
}

export default function Show({ assessment }: { assessment: Assessment }) {
    const { canCreateAssessments, canTakeAssessments, canGradeSubmissions } = usePermission();

    const handleDelete = () => {
        if (confirm('Delete this assessment?')) {
            router.delete(route('assessments.destroy', assessment.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">{assessment.title}</h2>}
        >
            <Head title={assessment.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-card shadow-sm sm:rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <span className="inline-flex rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">{assessment.type}</span>
                                <span className="inline-flex rounded-full bg-info/10 px-2 text-xs font-semibold text-info">Pass: {assessment.passing_score}%</span>
                            </div>
                            <div className="flex gap-2">
                                {canCreateAssessments() && (
                                    <Link href={route('assessments.edit', assessment.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Edit</Link>
                                )}
                                {canTakeAssessments() && (
                                    <Link href={route('assessments.take', assessment.id)} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">Take</Link>
                                )}
                                {canCreateAssessments() && (
                                    <button onClick={handleDelete} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">Delete</button>
                                )}
                            </div>
                        </div>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div><dt className="text-muted-foreground">Course</dt><dd className="text-foreground">{assessment.course.title}</dd></div>
                            <div><dt className="text-muted-foreground">Max Attempts</dt><dd className="text-foreground">{assessment.max_attempts}</dd></div>
                            <div><dt className="text-muted-foreground">Time Limit</dt><dd className="text-foreground">{assessment.time_limit_minutes ? `${assessment.time_limit_minutes} min` : 'None'}</dd></div>
                            <div><dt className="text-muted-foreground">Questions</dt><dd className="text-foreground">{assessment.submissions.length} submissions</dd></div>
                        </dl>
                    </div>

                    <div className="bg-card shadow-sm sm:rounded-lg p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Submissions</h3>
                        {assessment.submissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No submissions yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">Student</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">Attempt</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">Score</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                                        {canGradeSubmissions() && <th className="px-4 py-2 text-left text-xs font-medium uppercase text-muted-foreground">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {assessment.submissions.map((s) => (
                                        <tr key={s.id}>
                                            <td className="px-4 py-2 text-sm text-foreground">{s.user.name}</td>
                                            <td className="px-4 py-2 text-sm text-muted-foreground">#{s.attempt_number}</td>
                                            <td className="px-4 py-2 text-sm text-foreground">{s.auto_score ?? '-'}</td>
                                            <td className="px-4 py-2"><span className={`inline-flex rounded-full px-2 text-xs font-semibold ${s.status === 'graded' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{s.status}</span></td>
                                            {canGradeSubmissions() && (
                                                <td className="px-4 py-2">
                                                    {s.status === 'submitted' ? (
                                                        <Link href={route('assessments.submissions.grade', [assessment.id, s.id])} className="text-sm font-medium text-primary hover:text-primary/80">
                                                            Grade
                                                        </Link>
                                                    ) : s.status === 'graded' && s.grade ? (
                                                        <span className="text-sm text-muted-foreground">
                                                            {s.grade.score}/{s.grade.max_score}
                                                        </span>
                                                    ) : null}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
