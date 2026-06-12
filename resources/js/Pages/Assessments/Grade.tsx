import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface QuestionOption {
    id: number;
    body: string;
    is_correct: boolean;
}

interface Question {
    id: number;
    body: string;
    type: string;
    points: number;
    explanation?: string;
    options: QuestionOption[];
}

interface Answer {
    id: number;
    question_id: number;
    selected_option_id?: number;
    text_answer?: string;
    is_correct: boolean;
    points_earned: number;
    question: Question;
}

interface Submission {
    id: number;
    attempt_number: number;
    auto_score?: number;
    status: string;
    submitted_at?: string;
    user: { id: number; name: string };
    answers: Answer[];
}

interface Assessment {
    id: number;
    title: string;
    course: { id: number; title: string };
}

export default function Grade({ assessment, submission }: {
    assessment: Assessment;
    submission: Submission;
}) {
    const { data, setData, post, processing, errors } = useForm({
        score: submission.auto_score ?? 0,
        feedback: '',
    });

    const totalPoints = submission.answers.reduce((sum, a) => sum + a.question.points, 0);
    const correctCount = submission.answers.filter((a) => a.is_correct).length;

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('assessments.submissions.grade.store', [assessment.id, submission.id]));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Grade: {assessment.title}</h2>}
        >
            <Head title="Grade Submission" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Student Info */}
                    <div className="bg-card shadow-sm sm:rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-foreground">{submission.user.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Attempt #{submission.attempt_number} &middot; {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'Not submitted'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Auto Score</p>
                                <p className="text-2xl font-bold text-foreground">{submission.auto_score ?? '-'} / {totalPoints}</p>
                                <p className="text-xs text-muted-foreground">{correctCount} of {submission.answers.length} correct</p>
                            </div>
                        </div>
                    </div>

                    {/* Review Answers */}
                    <div className="bg-card shadow-sm sm:rounded-lg p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Student Answers</h3>
                        <div className="space-y-4">
                            {submission.answers.map((answer, idx) => (
                                <div key={answer.id} className={`rounded-lg border p-4 ${answer.is_correct ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-medium text-foreground">Q{idx + 1}. {answer.question.body}</p>
                                        <span className="text-xs font-semibold text-muted-foreground">{answer.question.points} pts</span>
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
                                            Student answer: <span className={answer.is_correct ? 'text-success font-medium' : 'text-destructive'}>{answer.text_answer || '(empty)'}</span>
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

                    {/* Grade Form */}
                    <form onSubmit={handleSubmit} className="bg-card shadow-sm sm:rounded-lg p-6">
                        <h3 className="mb-4 text-lg font-medium text-foreground">Manual Grade</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="score" className="block text-sm font-medium text-foreground">
                                    Score (max {totalPoints})
                                </label>
                                <input
                                    id="score"
                                    type="number"
                                    min={0}
                                    max={totalPoints}
                                    value={data.score}
                                    onChange={(e) => setData('score', Number(e.target.value))}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                                {errors.score && <p className="mt-1 text-sm text-destructive">{errors.score}</p>}
                            </div>
                            <div>
                                <label htmlFor="feedback" className="block text-sm font-medium text-foreground">
                                    Feedback
                                </label>
                                <textarea
                                    id="feedback"
                                    rows={4}
                                    value={data.feedback}
                                    onChange={(e) => setData('feedback', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                                    placeholder="Optional feedback for the student..."
                                />
                                {errors.feedback && <p className="mt-1 text-sm text-destructive">{errors.feedback}</p>}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Grade'}
                                </button>
                                <Link
                                    href={route('assessments.show', assessment.id)}
                                    className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
