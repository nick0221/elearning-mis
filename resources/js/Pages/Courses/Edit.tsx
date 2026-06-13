import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, Link, router, useForm } from '@inertiajs/react';
import ConfirmDialog from '@/Components/ConfirmDialog';
import RichTextEditor from '@/Components/RichTextEditor';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

function SortableModule({
    mod, idx, courseId, isEditing, onEdit, onSave, onCancel, onAddLesson, onDelete,
    lessons,
}: {
    mod: CourseModule;
    idx: number;
    courseId: number;
    isEditing: boolean;
    onEdit: (m: CourseModule) => void;
    onSave: () => void;
    onCancel: () => void;
    onAddLesson: (moduleId: number) => void;
    onDelete: (id: number) => void;
    lessons: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `module-${mod.id}` });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

    const [editTitle, setEditTitle] = useState(mod.title);
    const [editDesc, setEditDesc] = useState(mod.description || '');

    return (
        <div ref={setNodeRef} style={style} className="rounded-lg border border-border">
            {isEditing ? (
                <div className="border-b border-border bg-muted/50 p-4">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mb-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        autoFocus
                    />
                    <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description (optional)"
                        className="mb-3 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditTitle(mod.title); setEditDesc(mod.description || ''); onCancel(); }} className="rounded-md border border-input bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-muted">
                            Cancel
                        </button>
                        <button onClick={() => { mod.title = editTitle; mod.description = editDesc; onSave(); }} className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground" title="Drag to reorder">
                            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path d="M7 2a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0zM7 5a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0zM7 8a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                        </button>
                        <span className="text-sm font-medium text-foreground">{mod.title}</span>
                        {mod.description && (
                            <span className="hidden text-xs text-muted-foreground sm:inline">· {mod.description}</span>
                        )}
                        <span className="text-xs text-muted-foreground">({mod.lessons.length} lessons)</span>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => { setEditTitle(mod.title); setEditDesc(mod.description || ''); onEdit(mod); }} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-background hover:text-foreground">
                            Edit
                        </button>
                        <button onClick={() => onAddLesson(mod.id)} className="rounded px-2 py-1 text-xs text-accent hover:bg-background">
                            + Lesson
                        </button>
                        <button onClick={() => onDelete(mod.id)} className="rounded px-2 py-1 text-xs text-destructive hover:bg-background">
                            Delete
                        </button>
                    </div>
                </div>
            )}
            {lessons}
        </div>
    );
}

function SortableLessonItem({
    lesson, moduleId, courseId, isEditing, onEdit, onSave, onCancel, onDelete,
}: {
    lesson: Lesson;
    moduleId: number;
    courseId: number;
    isEditing: boolean;
    onEdit: (moduleId: number, lesson: Lesson) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (id: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `lesson-${lesson.id}` });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

    const [editTitle, setEditTitle] = useState(lesson.title);
    const [editType, setEditType] = useState(lesson.type);
    const [editContent, setEditContent] = useState(lesson.content || '');
    const [editVideoUrl, setEditVideoUrl] = useState(lesson.video_url || '');
    const [editDuration, setEditDuration] = useState(lesson.duration_minutes?.toString() || '');

    return (
        <div ref={setNodeRef} style={style}>
            {isEditing ? (
                <div className="border-t border-border p-4">
                    <div className="mb-3 grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-medium text-foreground">Title</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-foreground">Type</label>
                            <select
                                value={editType}
                                onChange={(e) => setEditType(e.target.value)}
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="text">Text</option>
                                <option value="video">Video</option>
                                <option value="audio">Audio</option>
                            </select>
                        </div>
                    </div>

                    {editType === 'video' && (
                        <div className="mb-3">
                            <label className="mb-1 block text-xs font-medium text-foreground">Video URL</label>
                            <input
                                type="text"
                                value={editVideoUrl}
                                onChange={(e) => setEditVideoUrl(e.target.value)}
                                placeholder="https://example.com/video.mp4"
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    )}

                    {editType === 'text' && (
                        <div className="mb-3">
                            <label className="mb-1 block text-xs font-medium text-foreground">Content</label>
                            <RichTextEditor
                                content={editContent}
                                onChange={(html) => setEditContent(html)}
                                placeholder="Write your lesson content here..."
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="mb-1 block text-xs font-medium text-foreground">Duration (minutes)</label>
                        <input
                            type="number"
                            value={editDuration}
                            onChange={(e) => setEditDuration(e.target.value)}
                            min="1"
                            className="block w-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditTitle(lesson.title); setEditType(lesson.type); setEditContent(lesson.content || ''); setEditVideoUrl(lesson.video_url || ''); setEditDuration(lesson.duration_minutes?.toString() || ''); onCancel(); }} className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                            Cancel
                        </button>
                        <button onClick={() => {
                            lesson.title = editTitle;
                            lesson.type = editType;
                            lesson.content = editContent;
                            lesson.video_url = editVideoUrl;
                            lesson.duration_minutes = parseInt(editDuration) || 0;
                            onSave();
                        }} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                            Save Lesson
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between border-t border-border px-4 py-2">
                    <div className="flex items-center gap-2">
                        <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground" title="Drag to reorder">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M7 2a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0zM7 5a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0zM7 8a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                        </button>
                        <span className="text-sm text-foreground">{lesson.title}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground capitalize">{lesson.type}</span>
                        {lesson.duration_minutes && (
                            <span className="text-xs text-muted-foreground">{lesson.duration_minutes}m</span>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => { setEditTitle(lesson.title); setEditType(lesson.type); setEditContent(lesson.content || ''); setEditVideoUrl(lesson.video_url || ''); setEditDuration(lesson.duration_minutes?.toString() || ''); onEdit(moduleId, lesson); }} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                            Edit
                        </button>
                        <button onClick={() => onDelete(lesson.id)} className="rounded px-2 py-1 text-xs text-destructive hover:bg-muted">
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
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

    const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
    const [editingLessonKey, setEditingLessonKey] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'module' | 'lesson'; id: number } | null>(null);
    const [showNewModule, setShowNewModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newModuleDesc, setNewModuleDesc] = useState('');
    const [moduleIds, setModuleIds] = useState<number[]>(course.modules.map((m) => m.id));

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

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

    const handleSaveModule = (mod: CourseModule) => {
        if (!mod.title.trim()) return;
        router.put(route('modules.update', mod.id), {
            title: mod.title,
            description: mod.description,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setEditingModuleId(null),
        });
    };

    const handleSaveLesson = (lesson: Lesson) => {
        if (!lesson.title.trim()) return;
        router.put(route('lessons.update', lesson.id), {
            title: lesson.title,
            type: lesson.type || 'text',
            content: lesson.content || '',
            video_url: lesson.video_url || '',
            duration_minutes: lesson.duration_minutes,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setEditingLessonKey(null),
        });
    };

    const handleModuleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = moduleIds.indexOf(Number(active.id.toString().replace('module-', '')));
        const newIndex = moduleIds.indexOf(Number(over.id.toString().replace('module-', '')));
        const newOrder = arrayMove(moduleIds, oldIndex, newIndex);
        setModuleIds(newOrder);

        router.put(route('courses.modules.reorder', course.id), {
            modules: newOrder.map((id, i) => ({ id, sort_order: i })),
        }, { preserveState: true, preserveScroll: true });
    };

    const handleLessonDragEnd = (event: DragEndEvent, moduleId: number) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const mod = course.modules.find((m) => m.id === moduleId);
        if (!mod) return;

        const lessonIds = mod.lessons.map((l) => l.id);
        const oldIndex = lessonIds.indexOf(Number(active.id.toString().replace('lesson-', '')));
        const newIndex = lessonIds.indexOf(Number(over.id.toString().replace('lesson-', '')));
        const newOrder = arrayMove(lessonIds, oldIndex, newIndex);

        router.put(route('modules.lessons.reorder', moduleId), {
            lessons: newOrder.map((id, i) => ({ id, sort_order: i })),
        }, { preserveState: true, preserveScroll: true });
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

    const sortedModules = [...course.modules].sort((a, b) => moduleIds.indexOf(a.id) - moduleIds.indexOf(b.id));

    return (
        <AuthenticatedLayout
        >
            <Head title="Edit Course" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Edit Course"
                    />
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
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
                                    <SortableContext items={sortedModules.map((m) => `module-${m.id}`)} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-4">
                                            {sortedModules.map((mod, idx) => {
                                                const modLessons = [...mod.lessons].sort((a, b) => a.sort_order - b.sort_order);

                                                return (
                                                    <SortableModule
                                                        key={mod.id}
                                                        mod={mod}
                                                        idx={idx}
                                                        courseId={course.id}
                                                        isEditing={editingModuleId === mod.id}
                                                        onEdit={() => setEditingModuleId(mod.id)}
                                                        onSave={() => handleSaveModule(mod)}
                                                        onCancel={() => setEditingModuleId(null)}
                                                        onAddLesson={createLesson}
                                                        onDelete={(id) => setDeleteConfirm({ type: 'module', id })}
                                                        lessons={
                                                            modLessons.length > 0 ? (
                                                                <DndContext
                                                                    sensors={sensors}
                                                                    collisionDetection={closestCenter}
                                                                    onDragEnd={(e) => handleLessonDragEnd(e, mod.id)}
                                                                >
                                                                    <SortableContext items={modLessons.map((l) => `lesson-${l.id}`)} strategy={verticalListSortingStrategy}>
                                                                        {modLessons.map((lesson) => (
                                                                            <SortableLessonItem
                                                                                key={lesson.id}
                                                                                lesson={lesson}
                                                                                moduleId={mod.id}
                                                                                courseId={course.id}
                                                                                isEditing={editingLessonKey === `lesson-${lesson.id}`}
                                                                                onEdit={(mId, l) => setEditingLessonKey(`lesson-${l.id}`)}
                                                                                onSave={() => handleSaveLesson(lesson)}
                                                                                onCancel={() => setEditingLessonKey(null)}
                                                                                onDelete={(id) => setDeleteConfirm({ type: 'lesson', id })}
                                                                            />
                                                                        ))}
                                                                    </SortableContext>
                                                                </DndContext>
                                                            ) : (
                                                                <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
                                                                    No lessons yet.{' '}
                                                                    <button onClick={() => createLesson(mod.id)} className="text-accent hover:text-accent/80">Add one</button>
                                                                </div>
                                                            )
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    </SortableContext>
                                </DndContext>
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
