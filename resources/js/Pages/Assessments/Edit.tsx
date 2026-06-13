import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface QuestionOption {
    id?: number;
    body: string;
    is_correct: boolean;
}

interface Question {
    id: number;
    body: string;
    type: string;
    points: number;
    sort_order: number;
    explanation?: string;
    options: QuestionOption[];
}

interface Assessment {
    id: number;
    title: string;
    type: string;
    max_attempts: number;
    time_limit_minutes?: number;
    passing_score: number;
    is_randomized: boolean;
    questions: Question[];
}

export default function Edit({ assessment }: { assessment: Assessment }) {
    const { data, setData, put, processing } = useForm({
        title: assessment.title,
        type: assessment.type,
        max_attempts: assessment.max_attempts.toString(),
        time_limit_minutes: assessment.time_limit_minutes?.toString() || '',
        passing_score: assessment.passing_score.toString(),
        is_randomized: assessment.is_randomized,
    });

    const [newQuestion, setNewQuestion] = useState({
        body: '',
        type: 'mcq',
        points: '1',
        explanation: '',
        options: [
            { body: '', is_correct: false },
            { body: '', is_correct: false },
        ],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('assessments.update', assessment.id));
    };

    const addQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('assessments.add-question', assessment.id), newQuestion, {
            onSuccess: () => {
                setNewQuestion({
                    body: '', type: 'mcq', points: '1', explanation: '',
                    options: [{ body: '', is_correct: false }, { body: '', is_correct: false }],
                });
                router.reload({ only: ['assessment'] });
            },
        });
    };

    const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";

    return (
        <AuthenticatedLayout
        >
            <Head title="Edit Assessment" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Edit Assessment"
                    />
                    {/* Assessment Settings */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Assessment Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground">Title</label>
                                    <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Type</label>
                                        <select value={data.type} onChange={(e) => setData('type', e.target.value)} className={inputClass}>
                                            <option value="quiz">Quiz</option>
                                            <option value="assignment">Assignment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Max Attempts</label>
                                        <input type="number" value={data.max_attempts} onChange={(e) => setData('max_attempts', e.target.value)} className={inputClass} min="1" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Time Limit (min)</label>
                                        <input type="number" value={data.time_limit_minutes} onChange={(e) => setData('time_limit_minutes', e.target.value)} className={inputClass} placeholder="No limit" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Passing Score (%)</label>
                                        <input type="number" value={data.passing_score} onChange={(e) => setData('passing_score', e.target.value)} className={inputClass} min="0" max="100" />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" checked={data.is_randomized} onChange={(e) => setData('is_randomized', e.target.checked)} className="h-4 w-4 rounded border-border text-accent focus:ring-ring" />
                                    <label className="ms-2 text-sm text-foreground">Randomize order</label>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Save Settings</button>
                            </div>
                        </form>
                    </div>

                    {/* Existing Questions */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Questions ({assessment.questions.length})</h3>
                            {assessment.questions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No questions yet. Add one below.</p>
                            ) : (
                                <div className="space-y-4">
                                    {assessment.questions.map((q, idx) => (
                                        <div key={q.id} className="rounded-lg border border-border p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Q{idx + 1}. {q.body}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">{q.type} · {q.points} pts</p>
                                                    {q.options.length > 0 && (
                                                        <ul className="mt-2 space-y-1">
                                                            {q.options.map((opt, oi) => (
                                                                <li key={oi} className={`text-sm ${opt.is_correct ? 'text-success font-medium' : 'text-muted-foreground'}`}>
                                                                    {String.fromCharCode(65 + oi)}. {opt.body} {opt.is_correct && '✓'}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Question Form */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={addQuestion} className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Add Question</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground">Question</label>
                                    <textarea value={newQuestion.body} onChange={(e) => setNewQuestion({ ...newQuestion, body: e.target.value })} rows={2} className={inputClass} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Type</label>
                                        <select value={newQuestion.type} onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })} className={inputClass}>
                                            <option value="mcq">Multiple Choice</option>
                                            <option value="true_false">True/False</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Points</label>
                                        <input type="number" value={newQuestion.points} onChange={(e) => setNewQuestion({ ...newQuestion, points: e.target.value })} className={inputClass} min="1" />
                                    </div>
                                </div>

                                {newQuestion.type === 'mcq' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-foreground">Options (check correct)</label>
                                        {newQuestion.options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input type="radio" name="correct" checked={opt.is_correct} onChange={() => {
                                                    const opts = newQuestion.options.map((o, j) => ({ ...o, is_correct: j === i }));
                                                    setNewQuestion({ ...newQuestion, options: opts });
                                                }} className="h-4 w-4 text-accent focus:ring-ring" />
                                                <input type="text" value={opt.body} onChange={(e) => {
                                                    const opts = [...newQuestion.options];
                                                    opts[i] = { ...opts[i], body: e.target.value };
                                                    setNewQuestion({ ...newQuestion, options: opts });
                                                }} className="flex-1 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring" placeholder={`Option ${i + 1}`} />
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, { body: '', is_correct: false }] })} className="text-sm text-accent hover:text-accent/80">+ Add option</button>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Explanation (optional)</label>
                                    <input type="text" value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} className={inputClass} />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">Add Question</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
