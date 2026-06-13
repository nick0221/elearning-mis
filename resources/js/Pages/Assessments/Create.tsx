import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, useForm } from '@inertiajs/react';

interface Course {
    id: number;
    title: string;
}

export default function Create({ courses, courseId }: { courses: Course[]; courseId?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        course_id: courseId || '',
        title: '',
        type: 'quiz',
        max_attempts: '1',
        time_limit_minutes: '',
        passing_score: '60',
        is_randomized: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assessments.store'));
    };

    const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";

    return (
        <AuthenticatedLayout
        >
            <Head title="Create Assessment" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Create Assessment"
                    />
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground">Course</label>
                                    <select value={data.course_id} onChange={(e) => setData('course_id', e.target.value)} className={inputClass}>
                                        <option value="">Select course</option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                    {errors.course_id && <p className="mt-1 text-sm text-destructive">{errors.course_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Title</label>
                                    <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
                                    {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
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
                                        <label className="block text-sm font-medium text-foreground">Time Limit (minutes)</label>
                                        <input type="number" value={data.time_limit_minutes} onChange={(e) => setData('time_limit_minutes', e.target.value)} className={inputClass} min="1" placeholder="No limit" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Passing Score (%)</label>
                                        <input type="number" value={data.passing_score} onChange={(e) => setData('passing_score', e.target.value)} className={inputClass} min="0" max="100" />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" checked={data.is_randomized} onChange={(e) => setData('is_randomized', e.target.checked)} className="h-4 w-4 rounded border-border text-accent focus:ring-ring" />
                                    <label className="ms-2 text-sm text-foreground">Randomize question order</label>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <Link href={route('assessments.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</Link>
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Create Assessment</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
