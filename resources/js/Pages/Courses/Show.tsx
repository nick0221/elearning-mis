import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

interface Lesson {
    id: number;
    title: string;
    type: string;
}

interface CourseModule {
    id: number;
    title: string;
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

export default function Show({ course }: { course: Course }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this course?')) {
            router.delete(route('courses.destroy', course.id));
        }
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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">{course.title}</h2>}
        >
            <Head title={course.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${statusColors[course.status]}`}>{course.status}</span>
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${difficultyColors[course.difficulty]}`}>{course.difficulty}</span>
                                    {course.category && (
                                        <span className="inline-flex rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">{course.category.name}</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('courses.edit', course.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                        Edit
                                    </Link>
                                    <button onClick={handleDelete} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {course.description && (
                                <p className="mb-6 text-muted-foreground">{course.description}</p>
                            )}

                            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                                {course.max_students && (
                                    <div>
                                        <span className="font-medium text-foreground">Max Students:</span>
                                        <span className="ml-2 text-muted-foreground">{course.max_students}</span>
                                    </div>
                                )}
                                {course.estimated_duration_minutes && (
                                    <div>
                                        <span className="font-medium text-foreground">Duration:</span>
                                        <span className="ml-2 text-muted-foreground">{course.estimated_duration_minutes} min</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-medium text-foreground">Modules ({course.modules.length})</h3>
                                {course.modules.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No modules yet. Edit the course to add modules.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {course.modules.map((mod, idx) => (
                                            <div key={mod.id} className="rounded-lg border border-border p-4">
                                                <h4 className="font-medium text-foreground">Module {idx + 1}: {mod.title}</h4>
                                                <p className="mt-1 text-sm text-muted-foreground">{mod.lessons.length} lessons</p>
                                                {mod.lessons.length > 0 && (
                                                    <ul className="mt-2 space-y-1">
                                                        {mod.lessons.map((lesson) => (
                                                            <li key={lesson.id} className="text-sm text-muted-foreground">
                                                                - {lesson.title} ({lesson.type})
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
            </div>
        </AuthenticatedLayout>
    );
}
