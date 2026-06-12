import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface Lesson {
    id: number;
    title: string;
    type: string;
    duration_minutes?: number;
}

interface CourseModule {
    id: number;
    title: string;
    description?: string;
    lessons: Lesson[];
}

interface Category {
    id: number;
    name: string;
}

interface Course {
    id: number;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    difficulty: string;
    status: string;
    max_students?: number;
    estimated_duration_minutes?: number;
    category?: Category;
    modules: CourseModule[];
    created_at: string;
}

export default function Show({ course, enrollmentCount, isEnrolled }: { course: Course; enrollmentCount: number; isEnrolled: boolean }) {
    const { canCreateCourses, canEditAnyCourse, canTakeAssessments } = usePermission();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const canEdit = canEditAnyCourse() || course.instructors?.some((i) => i.id === usePermission().user?.id);

    const handleDelete = () => {
        router.delete(route('courses.destroy', course.id));
        setShowDeleteDialog(false);
    };

    const statusColors: Record<string, string> = {
        draft: 'bg-muted text-muted-foreground',
        published: 'bg-success/10 text-success',
        archived: 'bg-warning/10 text-warning',
    };

    const difficultyColors: Record<string, string> = {
        beginner: 'bg-success/10 text-success',
        intermediate: 'bg-info/10 text-info',
        advanced: 'bg-destructive/10 text-destructive',
    };

    const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">{course.title}</h2>}
        >
            <Head title={course.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Course Header Card */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold capitalize ${statusColors[course.status]}`}>{course.status}</span>
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold capitalize ${difficultyColors[course.difficulty]}`}>{course.difficulty}</span>
                                    {course.category && (
                                        <span className="inline-flex rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">{course.category.name}</span>
                                    )}
                                </div>
                                {canEdit && (
                                    <div className="flex gap-2">
                                        <Link href={route('courses.edit', course.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                            Edit
                                        </Link>
                                        {canEditAnyCourse() && (
                                            <button onClick={() => setShowDeleteDialog(true)} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {course.description && (
                                <p className="mb-6 text-muted-foreground">{course.description}</p>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <div className="text-2xl font-bold text-foreground">{course.modules.length}</div>
                                    <div className="text-xs text-muted-foreground">Modules</div>
                                </div>
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <div className="text-2xl font-bold text-foreground">{totalLessons}</div>
                                    <div className="text-xs text-muted-foreground">Lessons</div>
                                </div>
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <div className="text-2xl font-bold text-foreground">{enrollmentCount}</div>
                                    <div className="text-xs text-muted-foreground">Enrolled</div>
                                </div>
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <div className="text-2xl font-bold text-foreground">{course.estimated_duration_minutes ? `${Math.round(course.estimated_duration_minutes / 60)}h` : '-'}</div>
                                    <div className="text-xs text-muted-foreground">Duration</div>
                                </div>
                            </div>

                            {/* Enroll / Continue Button */}
                            {!canEdit && course.status === 'published' && (
                                <div className="mt-6 flex gap-3">
                                    {isEnrolled ? (
                                        <Link
                                            href={route('courses.learn', course.id)}
                                            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                                        >
                                            Continue Learning →
                                        </Link>
                                    ) : (
                                        <form action={route('courses.enroll', course.id)} method="POST">
                                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                                            <button type="submit" className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                                Enroll in this Course
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modules Card */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Modules & Lessons</h3>
                            {course.modules.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                                    <p className="text-sm text-muted-foreground">No modules yet.</p>
                                    <Link href={route('courses.edit', course.id)} className="mt-2 inline-block text-sm text-accent hover:text-accent/80">
                                        Add modules →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {course.modules.map((mod, idx) => (
                                        <div key={mod.id} className="rounded-lg border border-border">
                                            <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
                                                <div>
                                                    <span className="text-sm font-medium text-foreground">Module {idx + 1}</span>
                                                    <span className="mx-2 text-muted-foreground">·</span>
                                                    <span className="text-sm text-foreground">{mod.title}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{mod.lessons.length} lessons</span>
                                            </div>
                                            {mod.lessons.length > 0 && (
                                                <ul className="divide-y divide-border">
                                                    {mod.lessons.map((lesson) => (
                                                        <li key={lesson.id} className="flex items-center justify-between px-4 py-2">
                                                            <span className="text-sm text-foreground">{lesson.title}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-muted-foreground capitalize">{lesson.type}</span>
                                                                {lesson.duration_minutes && (
                                                                    <span className="text-xs text-muted-foreground">{lesson.duration_minutes}m</span>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
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
                open={showDeleteDialog}
                title="Delete Course"
                message={`Are you sure you want to delete "${course.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </AuthenticatedLayout>
    );
}
