import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Input } from '@/Components/ui/input';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface QuestionOption {
    id: number;
    body: string;
}

interface Question {
    id: number;
    body: string;
    type: string;
    points: number;
    options: QuestionOption[];
}

interface Assessment {
    id: number;
    title: string;
    time_limit_minutes?: number;
    questions: Question[];
}

interface Submission {
    id: number;
    started_at: string;
}

export default function Take({ assessment, submission }: { assessment: Assessment; submission: Submission }) {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, { selected_option_id?: number; text_answer?: string }>>({});
    const [flagged, setFlagged] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState<number | null>(
        assessment.time_limit_minutes ? assessment.time_limit_minutes * 60 : null
    );
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    const { post, processing, transform } = useForm({
        submission_id: submission.id,
        answers: [] as any[],
    });

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((t) => (t ? t - 1 : 0)), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) handleSubmit();
    }, [timeLeft]);

    const question = assessment.questions[current];
    const answeredCount = Object.keys(answers).length;

    const setAnswer = (questionId: number, value: { selected_option_id?: number; text_answer?: string }) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const toggleFlag = (questionId: number) => {
        setFlagged((prev) => {
            const next = new Set(prev);
            if (next.has(questionId)) {
                next.delete(questionId);
            } else {
                next.add(questionId);
            }
            return next;
        });
    };

    const handleSubmit = () => {
        const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
            question_id: parseInt(questionId),
            ...answer,
        }));
        transform((data) => ({ ...data, answers: answersArray }));
        post(route('assessments.submit', assessment.id));
    };

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <AuthenticatedLayout>
            <Head title={`Take: ${assessment.title}`} />

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Question Navigation Sidebar */}
                <div className="w-64 overflow-y-auto border-r border-border bg-card p-4 hidden lg:block">
                    <h3 className="mb-3 text-sm font-medium text-foreground">Questions</h3>
                    <div className="grid grid-cols-5 gap-1.5">
                        {assessment.questions.map((q, idx) => {
                            const isAnswered = answers[q.id] !== undefined;
                            const isFlagged = flagged.has(q.id);
                            const isCurrent = idx === current;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrent(idx)}
                                    className={`relative h-9 w-full rounded text-xs font-medium transition-colors ${
                                        isCurrent
                                            ? 'bg-primary text-primary-foreground'
                                            : isAnswered
                                            ? 'bg-success/10 text-success'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    {idx + 1}
                                    {isFlagged && (
                                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-warning" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded bg-primary" /> Current
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded bg-success/10" /> Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded bg-muted" /> Unanswered
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-warning" /> Flagged
                        </div>
                    </div>
                </div>

                {/* Main Question Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-2xl p-6 lg:p-8">
                        {/* Assessment header with timer */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold leading-tight text-foreground truncate">{assessment.title}</h2>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-sm text-muted-foreground">
                                    {answeredCount}/{assessment.questions.length} answered
                                </span>
                                {timeLeft !== null && (
                                    <span className={`rounded-md px-3 py-1 text-sm font-mono ${timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground'}`}>
                                        {formatTime(timeLeft)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                            <span>Question {current + 1} of {assessment.questions.length}</span>
                            <div className="flex items-center gap-3">
                                <span>{question.points} pts</span>
                                <button
                                    onClick={() => toggleFlag(question.id)}
                                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                        flagged.has(question.id) ? 'bg-warning/10 text-warning' : 'hover:bg-muted'
                                    }`}
                                >
                                    <svg className="h-3 w-3" fill={flagged.has(question.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                    </svg>
                                    Flag
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 h-1.5 rounded-full bg-muted">
                            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((current + 1) / assessment.questions.length) * 100}%` }} />
                        </div>

                        <p className="mb-6 text-lg text-foreground">{question.body}</p>

                        {question.type === 'mcq' && (
                            <div className="space-y-3">
                                {question.options.map((opt) => (
                                    <label key={opt.id} className={`flex items-center rounded-lg border p-3 cursor-pointer transition-colors ${answers[question.id]?.selected_option_id === opt.id ? 'border-accent bg-accent/10' : 'border-border hover:bg-muted/50'}`}>
                                        <input type="radio" name={`q-${question.id}`} checked={answers[question.id]?.selected_option_id === opt.id} onChange={() => setAnswer(question.id, { selected_option_id: opt.id })} className="h-4 w-4 text-accent focus:ring-ring" />
                                        <span className="ms-3 text-sm text-foreground">{opt.body}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {question.type === 'true_false' && (
                            <div className="space-y-3">
                                {[{ id: question.options[0]?.id, body: 'True' }, { id: question.options[1]?.id, body: 'False' }].map((opt) => (
                                    <label key={opt.id} className={`flex items-center rounded-lg border p-3 cursor-pointer transition-colors ${answers[question.id]?.selected_option_id === opt.id ? 'border-accent bg-accent/10' : 'border-border hover:bg-muted/50'}`}>
                                        <input type="radio" name={`q-${question.id}`} checked={answers[question.id]?.selected_option_id === opt.id} onChange={() => setAnswer(question.id, { selected_option_id: opt.id })} className="h-4 w-4 text-accent focus:ring-ring" />
                                        <span className="ms-3 text-sm text-foreground">{opt.body}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {question.type === 'fill_blank' && (
                            <Input type="text" value={answers[question.id]?.text_answer || ''} onChange={(e) => setAnswer(question.id, { text_answer: e.target.value })} placeholder="Your answer" />
                        )}

                        {/* Navigation */}
                        <div className="mt-8 flex items-center justify-between">
                            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="flex items-center gap-1 rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                Previous
                            </button>
                            {current < assessment.questions.length - 1 ? (
                                <button onClick={() => setCurrent(current + 1)} className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                    Next
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            ) : (
                                <button onClick={() => setShowSubmitDialog(true)} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                    Submit Assessment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showSubmitDialog}
                title="Submit Assessment"
                message={`You have answered ${answeredCount} of ${assessment.questions.length} questions. Are you sure you want to submit?`}
                confirmLabel="Submit"
                variant="info"
                onConfirm={handleSubmit}
                onCancel={() => setShowSubmitDialog(false)}
            />
        </AuthenticatedLayout>
    );
}
