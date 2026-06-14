import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Select } from '@/Components/ui/select';
import { Label } from '@/Components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

interface Course { id: number; title: string; }

export default function Create({ courses }: { courses: Course[] }) {
    const { data, setData, post, processing, errors } = useForm({ course_id: '', title: '', body: '' });
    const submit = (e: React.FormEvent) => { e.preventDefault(); post(route('discussions.store')); };

    return (
        <AuthenticatedLayout>
            <Head title="New Discussion" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="New Discussion"
                        section="Community"
                        description="Start a conversation with your peers and instructors"
                        breadcrumbs={[
                            { label: 'Discussions', href: route('discussions.index') },
                        ]}
                    />

                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label>Course</Label>
                                <Select
                                    value={data.course_id}
                                    onChange={(e) => setData('course_id', e.target.value)}
                                >
                                    <option value="">Select a course...</option>
                                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </Select>
                                {errors.course_id && <p className="text-sm text-destructive">{errors.course_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Give your discussion a clear, descriptive title"
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    rows={6}
                                    placeholder="Describe your question, idea, or topic in detail..."
                                />
                                <div className="flex justify-between items-center">
                                    {errors.body && <p className="text-sm text-destructive">{errors.body}</p>}
                                    <span className="ml-auto text-xs text-muted-foreground">{data.body.length}/5000</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                                <Link
                                    href={route('discussions.index')}
                                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Discussion
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
