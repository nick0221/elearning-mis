import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

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
    category?: Category;
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
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">My Courses</h2>}
        >
            <Head title="My Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {enrollments.data.length === 0 ? (
                        <div className="text-center">
                            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
                            <Link href={route('courses.index')} className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                Browse Courses
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {enrollments.data.map((enrollment) => (
                                <Link
                                    key={enrollment.id}
                                    href={route('courses.learn', enrollment.course.id)}
                                    className="block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                                >
                                    {enrollment.course.thumbnail && (
                                        <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="h-40 w-full object-cover" />
                                    )}
                                    <div className="p-4">
                                        <div className="mb-2 flex gap-2">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                                enrollment.status === 'completed' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'
                                            }`}>
                                                {enrollment.status}
                                            </span>
                                            <span className="inline-flex rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">
                                                {enrollment.course.difficulty}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-medium text-foreground">{enrollment.course.title}</h3>
                                        {enrollment.course.description && (
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{enrollment.course.description}</p>
                                        )}
                                        {enrollment.course.category && (
                                            <p className="mt-2 text-xs text-muted-foreground">{enrollment.course.category.name}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
