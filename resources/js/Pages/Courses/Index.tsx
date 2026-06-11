import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

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
    category?: Category;
    created_at: string;
}

interface PaginatedData {
    data: Course[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function Index({ courses, categories, filters }: { courses: PaginatedData; categories: Category[]; filters: { search?: string; status?: string; category_id?: string } }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('courses.index'), { search, status: filters.status, category_id: filters.category_id }, { preserveState: true });
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
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Courses</h2>}
        >
            <Head title="Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search courses..."
                                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                Search
                            </button>
                        </form>

                        <Link
                            href={route('courses.create')}
                            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                        >
                            Create Course
                        </Link>
                    </div>

                    <div className="mb-4 flex gap-2">
                        {['draft', 'published', 'archived'].map((status) => (
                            <button
                                key={status}
                                onClick={() => router.get(route('courses.index'), { search, status, category_id: filters.category_id }, { preserveState: true })}
                                className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[status]} ${filters.status === status ? 'ring-2 ring-ring' : ''}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.data.map((course) => (
                            <Link
                                key={course.id}
                                href={route('courses.show', course.id)}
                                className="block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                            >
                                {course.thumbnail && (
                                    <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover" />
                                )}
                                <div className="p-4">
                                    <div className="mb-2 flex gap-2">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${statusColors[course.status]}`}>
                                            {course.status}
                                        </span>
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${difficultyColors[course.difficulty]}`}>
                                            {course.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground">{course.title}</h3>
                                    {course.description && (
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                                    )}
                                    {course.category && (
                                        <p className="mt-2 text-xs text-muted-foreground">{course.category.name}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {courses.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-1">
                            {Array.from({ length: courses.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={route('courses.index', { page, search, status: filters.status, category_id: filters.category_id })}
                                    className={`rounded-md px-3 py-2 text-sm ${page === courses.current_page ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
