import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Course { id: number; title: string; }

export default function Create({ courses }: { courses: Course[] }) {
    const { data, setData, post, processing, errors } = useForm({ course_id: '', title: '', body: '' });
    const submit = (e: React.FormEvent) => { e.preventDefault(); post(route('discussions.store')); };
    const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">New Discussion</h2>}>
            <Head title="New Discussion" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground">Course</label>
                                <select value={data.course_id} onChange={(e) => setData('course_id', e.target.value)} className={inputClass}>
                                    <option value="">Select course</option>
                                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                                {errors.course_id && <p className="mt-1 text-sm text-destructive">{errors.course_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground">Title</label>
                                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground">Content</label>
                                <textarea value={data.body} onChange={(e) => setData('body', e.target.value)} rows={6} className={inputClass} />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Link href={route('discussions.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</Link>
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
