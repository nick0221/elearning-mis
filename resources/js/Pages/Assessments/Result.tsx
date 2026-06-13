import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link } from '@inertiajs/react';

interface Answer {
    id: number;
    question_id: number;
    selected_option_id?: number;
    text_answer?: string;
    is_correct: boolean;
    points_earned: number;
    question: {
        id: number;
        body: string;
        type: string;
        points: number;
        explanation?: string;
        options: Array<{ id: number; body: string; is_correct: boolean }>;
    };
}

interface Submission {
    id: number;
    auto_score: number;
    status: string;
    answers: Answer[];
}

interface Assessment {
    id: number;
    title: string;
    course: { id: number; title: string };
}

export default function Result({ assessment, submission, autoScore, totalPoints, passed }: {
    assessment: Assessment;
    submission: Submission;
    autoScore: number;
    totalPoints: number;
    passed: boolean;
}) {
    const percentage = totalPoints > 0 ? Math.round((autoScore / totalPoints) * 100) : 0;
    const correctCount = submission.answers.filter((a) => a.is_correct).length;

    return (
        <AuthenticatedLayout
        >
            <Head title="Assessment Result" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title={`Result: ${assessment.title}`}
                    />
                    {/* Score Card */}
                    <div className={`rounded-lg border p-8 text-center ${passed ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                        <div className={`text-6xl font-bold ${passed ? 'text-success' : 'text-destructive'}`}>
                            {percentage}%
                        </div>
                        <div className="mt-2 text-lg font-medium text-foreground">
                            {autoScore} / {totalPoints} points
                        </div>
                        <div className={`mt-2 text-lg font-semibold ${passed ? 'text-success' : 'text-destructive'}`}>
                            {passed ? 'Passed!' : 'Not Passed'}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {correctCount} of {submission.answers.length} questions correct
                        </p>

                        {passed && (
                            <div className="mt-4 rounded-md bg-success/10 p-3">
                                <p className="text-sm font-medium text-success">Congratulations! You passed the assessment.</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-3">
                        <Link href={route('courses.learn', assessment.course.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                            Back to Course
                        </Link>
                        <Link href={route('assessments.take', assessment.id)} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                            Retake
                        </Link>
                    </div>

                    {/* Review Answers */}
                    <div className="bg-card shadow-sm sm:rounded-lg p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Review Answers</h3>
                        <div className="space-y-4">
                            {submission.answers.map((answer, idx) => (
                                <div key={answer.id} className={`rounded-lg border p-4 ${answer.is_correct ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-medium text-foreground">Q{idx + 1}. {answer.question.body}</p>
                                        <span className={`text-xs font-semibold ${answer.is_correct ? 'text-success' : 'text-destructive'}`}>
                                            {answer.points_earned}/{answer.question.points} pts
                                        </span>
                                    </div>

                                    {answer.question.type === 'mcq' && (
                                        <div className="mt-2 space-y-1">
                                            {answer.question.options.map((opt) => (
                                                <p key={opt.id} className={`text-sm ${opt.is_correct ? 'text-success font-medium' : opt.id === answer.selected_option_id ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    {opt.body} {opt.is_correct && '✓'} {opt.id === answer.selected_option_id && !opt.is_correct && '✗'}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    {answer.question.type === 'true_false' && (
                                        <div className="mt-2 space-y-1">
                                            {answer.question.options.map((opt) => (
                                                <p key={opt.id} className={`text-sm ${opt.is_correct ? 'text-success font-medium' : opt.id === answer.selected_option_id ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    {opt.body} {opt.is_correct && '✓'} {opt.id === answer.selected_option_id && !opt.is_correct && '✗'}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    {answer.question.type === 'fill_blank' && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Your answer: <span className={answer.is_correct ? 'text-success font-medium' : 'text-destructive'}>{answer.text_answer || '(empty)'}</span>
                                        </p>
                                    )}

                                    {answer.question.explanation && (
                                        <div className="mt-3 rounded-md bg-muted/50 p-3">
                                            <p className="text-xs font-medium text-muted-foreground">Explanation</p>
                                            <p className="mt-1 text-sm text-foreground">{answer.question.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
