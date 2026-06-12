import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import ConfirmDialog from '@/Components/ConfirmDialog';
import RichTextEditor from '@/Components/RichTextEditor';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Lesson {
    id: number;
    title: string;
    type: string;
    content?: string;
    video_url?: string;
    duration_minutes?: number;
    sort_order: number;
}

interface CourseModule {
    id: number;
    title: string;
    description?: string;
    sort_order: number;
    lessons: Lesson[];
}

interface Course {
    id: number;
    title: string;
    slug: string;
    description?: string;
    category_id?: number;
    difficulty: string;
    status: string;
    max_students?: number;
    estimated_duration_minutes?: number;
    modules: CourseModule[];
}

export default function Edit({ course, categories }: { course: Course; categories: Category[] }) {
    const { data, setData, put, processing, errors } = useForm({
        title: course.title,
        description: course.description || '',
        category_id: course.category_id?.toString() || '',
        difficulty: course.difficulty,
        status: course.status,
        max_students: course.max_students?.toString() || '',
        estimated_duration_minutes: course.estimated_duration_minutes?.toString() || '',
    });

    const [editingModule, setEditingModule] = useState<Partial<CourseModule> | null>(null);
    const [editingLesson, setEditingLesson] = useState<{ moduleId: number; lesson: Partial<Lesson> } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'module' | 'lesson'; id: number } | null>(null);
    const [showNewModule, setShowNewModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newModuleDesc, setNewModuleDesc] = useState('');

    const inputClass = 'mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('courses.update', course.id));
    };

    const createModule = () => {
        if (!newModuleTitle.trim()) return;
        router.post(route('courses.modules.store', course.id), {
            title: newModuleTitle,
            description: newModuleDesc,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setNewModuleTitle('');
                setNewModuleDesc('');
                setShowNewModule(false);
            },
        });
    };

    const saveModule = () => {
        if (!editingModule?.id || !editingModule?.title?.trim()) return;
        router.put(route('modules.update', editingModule.id), {
            title: editingModule.title,
            description: editingModule.description,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setEditingModule(null),
        });
    };

    const createLesson = (moduleId: number) => {
        router.post(route('modules.lessons.store', moduleId), {
            title: 'New Lesson',
            type: 'text',
            content: '',
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const saveLesson = () => {
        if (!editingLesson?.lesson?.id || !editingLesson?.lesson?.title?.trim()) return;
        const { moduleId, lesson } = editingLesson;
        router.put(route('lessons.update', lesson.id), {
            title: lesson.title,
            type: lesson.type || 'text',
            content: lesson.content || '',
            video_url: lesson.video_url || '',
            duration_minutes: lesson.duration_minutes,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setEditingLesson(null),
        });
    };

    const confirmDelete = () => {
        if (!deleteConfirm) return;
        if (deleteConfirm.type === 'module') {
            router.delete(route('modules.destroy', deleteConfirm.id), {
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            router.delete(route('lessons.destroy', deleteConfirm.id), {
                preserveState: true,
                preserveScroll: true,
            });
        }
        setDeleteConfirm(null);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Edit Course</h2>}
        >
            <Head title="Edit Course" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Course Settings */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Course Settings</h3>
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

                                <div className="grid grid-cols-3 gap-4">
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
                                        <label className="block text-sm font-medium text-foreground">Status</label>
                                        <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={inputClass}>
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Max Students</label>
                                        <input type="number" value={data.max_students} onChange={(e) => setData('max_students', e.target.value)} className={inputClass} min="1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">Duration (minutes)</label>
                                        <input type="number" value={data.estimated_duration_minutes} onChange={(e) => setData('estimated_duration_minutes', e.target.value)} className={inputClass} min="1" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <Link href={route('courses.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                    Cancel
                                </Link>
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                    Update Course
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Modules & Lessons */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-foreground">Modules & Lessons</h3>
                                <button
                                    onClick={() => setShowNewModule(true)}
                                    className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                                >
                                    + Add Module
                                </button>
                            </div>

                            {/* New Module Form */}
                            {showNewModule && (
                                <div className="mb-4 rounded-lg border border-border p-4">
                                    <input
                                        type="text"
                                        value={newModuleTitle}
                                        onChange={(e) => setNewModuleTitle(e.target.value)}
                                        placeholder="Module title"
                                        className="mb-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        autoFocus
                                    />
                                    <input
                                        type="text"
                                        value={newModuleDesc}
                                        onChange={(e) => setNewModuleDesc(e.target.value)}
                                        placeholder="Description (optional)"
                                        className="mb-3 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setShowNewModule(false); setNewModuleTitle(''); setNewModuleDesc(''); }} className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
                                            Cancel
                                        </button>
                                        <button onClick={createModule} disabled={!newModuleTitle.trim()} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                            Create Module
                                        </button>
                                    </div>
                                </div>
                            )}

                            {course.modules.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                                    <p className="text-sm text-muted-foreground">No modules yet. Create your first module to start building your course.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {course.modules.map((mod) => (
                                        <div key={mod.id} className="rounded-lg border border-border">
                                            {/* Module Header */}
                                            {editingModule?.id === mod.id ? (
                                                <div className="border-b border-border bg-muted/50 p-4">
                                                    <input
                                                        type="text"
                                                        value={editingModule.title}
                                                        onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                                                        className="mb-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingModule.description || ''}
                                                        onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                                                        placeholder="Description (optional)"
                                                        className="mb-3 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setEditingModule(null)} className="rounded-md border border-input bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-muted">
                                                            Cancel
                                                        </button>
                                                        <button onClick={saveModule} className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-foreground">{mod.title}</span>
                                                        {mod.description && (
                                                            <span className="hidden text-xs text-muted-foreground sm:inline">· {mod.description}</span>
                                                        )}
                                                        <span className="text-xs text-muted-foreground">({mod.lessons.length} lessons)</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => setEditingModule({ id: mod.id, title: mod.title, description: mod.description })} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-background hover:text-foreground">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => createLesson(mod.id)} className="rounded px-2 py-1 text-xs text-accent hover:bg-background">
                                                            + Lesson
                                                        </button>
                                                        <button onClick={() => setDeleteConfirm({ type: 'module', id: mod.id })} className="rounded px-2 py-1 text-xs text-destructive hover:bg-background">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Lessons */}
                                            {mod.lessons.length > 0 && (
                                                <ul className="divide-y divide-border">
                                                    {mod.lessons.map((lesson) => (
                                                        <li key={lesson.id}>
                                                            {editingLesson?.moduleId === mod.id && editingLesson?.lesson?.id === lesson.id ? (
                                                                <div className="p-4">
                                                                    <div className="mb-3 grid grid-cols-3 gap-3">
                                                                        <div className="col-span-2">
                                                                            <label className="mb-1 block text-xs font-medium text-foreground">Title</label>
                                                                            <input
                                                                                type="text"
                                                                                value={editingLesson.lesson.title}
                                                                                onChange={(e) => setEditingLesson({ moduleId: mod.id, lesson: { ...editingLesson.lesson, title: e.target.value } })}
                                                                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="mb-1 block text-xs font-medium text-foreground">Type</label>
                                                                            <select
                                                                                value={editingLesson.lesson.type || 'text'}
                                                                                onChange={(e) => setEditingLesson({ moduleId: mod.id, lesson: { ...editingLesson.lesson, type: e.target.value } })}
                                                                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                                            >
                                                                                <option value="text">Text</option>
                                                                                <option value="video">Video</option>
                                                                                <option value="audio">Audio</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    {editingLesson.lesson.type === 'video' && (
                                                                        <div className="mb-3">
                                                                            <label className="mb-1 block text-xs font-medium text-foreground">Video URL</label>
                                                                            <input
                                                                                type="text"
                                                                                value={editingLesson.lesson.video_url || ''}
                                                                                onChange={(e) => setEditingLesson({ moduleId: mod.id, lesson: { ...editingLesson.lesson, video_url: e.target.value } })}
                                                                                placeholder="https://example.com/video.mp4"
                                                                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {editingLesson.lesson.type === 'text' && (
                                                                        <div className="mb-3">
                                                                            <label className="mb-1 block text-xs font-medium text-foreground">Content</label>
                                                                            <RichTextEditor
                                                                                content={editingLesson.lesson.content || ''}
                                                                                onChange={(html) => setEditingLesson({ moduleId: mod.id, lesson: { ...editingLesson.lesson, content: html } })}
                                                                                placeholder="Write your lesson content here..."
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    <div className="mb-3">
                                                                        <label className="mb-1 block text-xs font-medium text-foreground">Duration (minutes)</label>
                                                                        <input
                                                                            type="number"
                                                                            value={editingLesson.lesson.duration_minutes || ''}
                                                                            onChange={(e) => setEditingLesson({ moduleId: mod.id, lesson: { ...editingLesson.lesson, duration_minutes: parseInt(e.target.value) || 0 } })}
                                                                            min="1"
                                                                            className="block w-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                                        />
                                                                    </div>

                                                                    <div className="flex justify-end gap-2">
                                                                        <button onClick={() => setEditingLesson(null)} className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                                                                            Cancel
                                                                        </button>
                                                                        <button onClick={saveLesson} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                                                                            Save Lesson
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-between px-4 py-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm text-foreground">{lesson.title}</span>
                                                                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground capitalize">{lesson.type}</span>
                                                                        {lesson.duration_minutes && (
                                                                            <span className="text-xs text-muted-foreground">{lesson.duration_minutes}m</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-1">
                                                                        <button
                                                                            onClick={() => setEditingLesson({ moduleId: mod.id, lesson: { id: lesson.id, title: lesson.title, type: lesson.type, content: lesson.content, video_url: lesson.video_url, duration_minutes: lesson.duration_minutes } })}
                                                                            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button onClick={() => setDeleteConfirm({ type: 'lesson', id: lesson.id })} className="rounded px-2 py-1 text-xs text-destructive hover:bg-muted">
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {mod.lessons.length === 0 && (
                                                <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                                                    No lessons yet.{' '}
                                                    <button onClick={() => createLesson(mod.id)} className="text-accent hover:text-accent/80">Add one</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={deleteConfirm !== null}
                title={`Delete ${deleteConfirm?.type === 'module' ? 'Module' : 'Lesson'}`}
                message={`Are you sure you want to delete this ${deleteConfirm?.type}? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm(null)}
            />
        </AuthenticatedLayout>
    );
}
