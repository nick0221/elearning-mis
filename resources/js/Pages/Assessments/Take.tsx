import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
    const [timeLeft, setTimeLeft] = useState<number | null>(
        assessment.time_limit_minutes ? assessment.time_limit_minutes * 60 : null
    );

    const { post, processing } = useForm({
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

    const setAnswer = (questionId: number, value: { selected_option_id?: number; text_answer?: string }) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = () => {
        const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
            question_id: parseInt(questionId),
            ...answer,
        }));
        post(route('assessments.submit', assessment.id), { answers: answersArray });
    };

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-foreground">{assessment.title}</h2>
                    {timeLeft !== null && (
                        <span className={`rounded-md px-3 py-1 text-sm font-mono ${timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    )}
                </div>
            }
        >
            <Head title={`Take: ${assessment.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm sm:rounded-lg p-6">
                        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                            <span>Question {current + 1} of {assessment.questions.length}</span>
                            <span>{question.points} pts</span>
                        </div>

                        <div className="mb-6 h-2 rounded-full bg-muted">
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
                            <input type="text" value={answers[question.id]?.text_answer || ''} onChange={(e) => setAnswer(question.id, { text_answer: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Your answer" />
                        )}

                        <div className="mt-8 flex items-center justify-between">
                            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50">Previous</button>
                            {current < assessment.questions.length - 1 ? (
                                <button onClick={() => setCurrent(current + 1)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Next</button>
                            ) : (
                                <button onClick={handleSubmit} disabled={processing} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50">Submit</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
