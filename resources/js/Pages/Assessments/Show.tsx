import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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

function TargetIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function LayersIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function QuizIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

function HelpIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ShuffleIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    );
}

export default function Show({ assessment }: { assessment: Assessment }) {
    const { canCreateAssessments, canTakeAssessments, canGradeSubmissions } = usePermission();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        router.delete(route('assessments.destroy', assessment.id));
        setShowDeleteDialog(false);
    };

    const typeColors: Record<string, string> = {
        quiz: 'bg-info/10 text-info',
        assignment: 'bg-warning/10 text-warning',
        exam: 'bg-destructive/10 text-destructive',
    };

    const submissionStatusColors: Record<string, string> = {
        submitted: 'bg-muted text-muted-foreground',
        graded: 'bg-success/10 text-success',
    };

    return (
        <AuthenticatedLayout
        >
            <Head title={assessment.title} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-accent/5 to-info/5 shadow-sm">
                        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
                        <div className="relative p-6 sm:p-8">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${typeColors[assessment.type] ?? 'bg-muted text-muted-foreground'}`}>{assessment.type}</span>
                                    <span className="inline-flex rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-semibold text-info">Pass: {assessment.passing_score}%</span>
                                    {assessment.is_randomized && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning">
                                            <ShuffleIcon /> Randomized
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {canCreateAssessments() && (
                                        <Link href={route('assessments.edit', assessment.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Edit</Link>
                                    )}
                                    {canTakeAssessments() && (
                                        <Link href={route('assessments.take', assessment.id)} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">Take Assessment</Link>
                                    )}
                                    {canCreateAssessments() && (
                                        <button onClick={() => setShowDeleteDialog(true)} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">Delete</button>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{assessment.title}</h1>

                            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                    { label: 'Course', value: assessment.course.title, icon: <LayersIcon />, bg: 'bg-primary/10' },
                                    { label: 'Max Attempts', value: assessment.max_attempts, icon: <HelpIcon />, bg: 'bg-accent/10' },
                                    { label: 'Time Limit', value: assessment.time_limit_minutes ? `${assessment.time_limit_minutes} min` : 'None', icon: <ClockIcon />, bg: 'bg-warning/10' },
                                    { label: 'Submissions', value: assessment.submissions.length, icon: <UsersIcon />, bg: 'bg-info/10' },
                                ].map((stat, i) => (
                                    <div key={i} className="group rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} text-foreground transition-transform group-hover:scale-110`}>
                                                {stat.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold text-foreground">{stat.value}</div>
                                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submissions */}
                    <div className="rounded-xl bg-card shadow-sm">
                        <div className="p-6 sm:p-8">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-foreground">Submissions</h3>
                                <p className="mt-0.5 text-sm text-muted-foreground">{assessment.submissions.length} total submission{assessment.submissions.length !== 1 ? 's' : ''}</p>
                            </div>
                            {assessment.submissions.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                                    <QuizIcon />
                                    <p className="mt-2 text-sm text-muted-foreground">No submissions yet.</p>
                                    <p className="text-xs text-muted-foreground/60">Submissions will appear here once students complete the assessment.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border border-border">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Student</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Attempt</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Score</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Date</th>
                                                {canGradeSubmissions() && <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {assessment.submissions.map((s) => (
                                                <tr key={s.id} className="transition-colors hover:bg-muted/30">
                                                    <td className="px-4 py-3 text-sm font-medium text-foreground">{s.user.name}</td>
                                                    <td className="px-4 py-3 text-sm text-muted-foreground">#{s.attempt_number}</td>
                                                    <td className="px-4 py-3 text-sm tabular-nums text-foreground">{s.auto_score ?? '-'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${submissionStatusColors[s.status] ?? 'bg-muted text-muted-foreground'}`}>
                                                            {s.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                                        {s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '-'}
                                                    </td>
                                                    {canGradeSubmissions() && (
                                                        <td className="px-4 py-3">
                                                            {s.status === 'submitted' ? (
                                                                <Link href={route('assessments.submissions.grade', [assessment.id, s.id])} className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
                                                                    Grade →
                                                                </Link>
                                                            ) : s.status === 'graded' && s.grade ? (
                                                                <span className="text-sm font-medium text-muted-foreground">
                                                                    {s.grade.score}/{s.grade.max_score}
                                                                </span>
                                                            ) : null}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                title="Delete Assessment"
                message={`Are you sure you want to delete "${assessment.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </AuthenticatedLayout>
    );
}
