import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

export default function Create({ categories }: { categories: Category[] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        difficulty: 'beginner',
        max_students: '',
        estimated_duration_minutes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('courses.store'));
    };

    const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Create Course</h2>}
        >
            <Head title="Create Course" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground">Title</label>
                                    <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
                                    {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Description</label>
                                    <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} className={inputClass} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Category</label>
                                    <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className={inputClass}>
                                        <option value="">No category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Difficulty</label>
                                    <select value={data.difficulty} onChange={(e) => setData('difficulty', e.target.value)} className={inputClass}>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Max Students (optional)</label>
                                    <input type="number" value={data.max_students} onChange={(e) => setData('max_students', e.target.value)} className={inputClass} min="1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Estimated Duration (minutes, optional)</label>
                                    <input type="number" value={data.estimated_duration_minutes} onChange={(e) => setData('estimated_duration_minutes', e.target.value)} className={inputClass} min="1" />
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <Link href={route('courses.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                    Cancel
                                </Link>
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                    Create Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
