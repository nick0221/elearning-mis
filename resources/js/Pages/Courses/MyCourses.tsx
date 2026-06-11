import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head, Link } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface LessonCompletion {
    id: number;
}

interface Lesson {
    id: number;
    lessonCompletions: LessonCompletion[];
}

interface CourseModule {
    id: number;
    lessons: Lesson[];
}

interface Course {
    id: number;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    difficulty: string;
    category?: Category;
    modules: CourseModule[];
}

interface Enrollment {
    id: number;
    status: string;
    enrolled_at: string;
    course: Course;
}

interface PaginatedData {
    data: Enrollment[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function MyCourses({ enrollments }: { enrollments: PaginatedData }) {
    const calculateProgress = (course: Course): number => {
        const totalLessons = course.modules?.reduce((acc, mod) => acc + mod.lessons.length, 0) || 0;
        const completedLessons = course.modules?.reduce(
            (acc, mod) => acc + mod.lessons.filter((l) => l.lessonCompletions?.length > 0).length,
            0
        ) || 0;
        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">My Courses</h2>}
        >
            <Head title="My Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {enrollments.data.length === 0 ? (
                        <EmptyState
                            title="No courses yet"
                            description="You haven't enrolled in any courses yet. Browse our catalog to get started."
                            action={
                                <Link href={route('courses.index')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                    Browse Courses
                                </Link>
                            }
                        />
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {enrollments.data.map((enrollment) => {
                                const progress = calculateProgress(enrollment.course);
                                return (
                                    <Link
                                        key={enrollment.id}
                                        href={route('courses.learn', enrollment.course.id)}
                                        className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-accent/50"
                                    >
                                        {enrollment.course.thumbnail ? (
                                            <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="h-40 w-full object-cover" />
                                        ) : (
                                            <div className="flex h-40 w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
                                                {enrollment.course.title.charAt(0)}
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="mb-2 flex gap-2">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                                    enrollment.status === 'completed' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'
                                                }`}>
                                                    {enrollment.status}
                                                </span>
                                                <span className="inline-flex rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground capitalize">
                                                    {enrollment.course.difficulty}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                                                {enrollment.course.title}
                                            </h3>
                                            {enrollment.course.description && (
                                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                    {enrollment.course.description}
                                                </p>
                                            )}

                                            {/* Progress Bar */}
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-medium text-foreground">{progress}%</span>
                                                </div>
                                                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            progress === 100 ? 'bg-success' : 'bg-accent'
                                                        }`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {enrollment.course.category && (
                                                <p className="mt-3 text-xs text-muted-foreground">
                                                    {enrollment.course.category.name}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
