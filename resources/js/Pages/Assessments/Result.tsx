import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Result: {assessment.title}</h2>}
        >
            <Head title="Assessment Result" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-card shadow-sm sm:rounded-lg p-6 text-center">
                        <div className={`mb-4 text-6xl font-bold ${passed ? 'text-success' : 'text-destructive'}`}>
                            {autoScore}/{totalPoints}
                        </div>
                        <p className={`text-lg font-medium ${passed ? 'text-success' : 'text-destructive'}`}>
                            {passed ? 'Passed!' : 'Not Passed'}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Score: {totalPoints > 0 ? Math.round((autoScore / totalPoints) * 100) : 0}%
                        </p>
                    </div>

                    <div className="bg-card shadow-sm sm:rounded-lg p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Review Answers</h3>
                        <div className="space-y-6">
                            {submission.answers.map((answer, idx) => (
                                <div key={answer.id} className={`rounded-lg border p-4 ${answer.is_correct ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-medium text-foreground">Q{idx + 1}. {answer.question.body}</p>
                                        <span className={`text-xs font-semibold ${answer.is_correct ? 'text-success' : 'text-destructive'}`}>
                                            {answer.points_earned}/{answer.question.options.length > 0 ? answer.question.options[0]?.id ? 1 : 1 : 1} pts
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
                                    {answer.question.explanation && (
                                        <p className="mt-2 text-xs text-muted-foreground italic">{answer.question.explanation}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-3">
                        <Link href={route('courses.learn', assessment.course.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Back to Course</Link>
                        <Link href={route('assessments.take', assessment.id)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Retake</Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
