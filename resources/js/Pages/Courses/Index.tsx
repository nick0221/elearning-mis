import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

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
    enrollments_count?: number;
    created_at: string;
}

interface PaginatedData {
    data: Course[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function Index({ courses, categories, filters }: { courses: PaginatedData; categories: Category[]; filters: { search?: string; status?: string; category_id?: string } }) {
    const { canCreateCourses } = usePermission();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('courses.index'), { search, status: filters.status, category_id: filters.category_id }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        router.get(route('courses.index'), {}, { preserveState: true });
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

    const hasFilters = filters.search || filters.status || filters.category_id;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Courses</h2>}
        >
            <Head title="Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search and Actions */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search courses..."
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-64"
                            />
                            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                Search
                            </button>
                        </form>

                        {canCreateCourses() && (
                            <Link
                                href={route('courses.create')}
                                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                            >
                                Create Course
                            </Link>
                        )}
                    </div>

                    {/* Status Filters */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            onClick={clearFilters}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${!hasFilters ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                        >
                            All ({courses.total})
                        </button>
                        {['draft', 'published', 'archived'].map((status) => (
                            <button
                                key={status}
                                onClick={() => router.get(route('courses.index'), { search, status, category_id: filters.category_id }, { preserveState: true })}
                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[status]} ${filters.status === status ? 'ring-2 ring-ring' : ''}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Category Filters */}
                    {categories.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => router.get(route('courses.index'), { search, status: filters.status, category_id: cat.id }, { preserveState: true })}
                                    className={`rounded-full border px-3 py-1 text-xs font-medium ${filters.category_id == String(cat.id) ? 'border-accent bg-accent/10 text-accent-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Course Grid */}
                    {courses.data.length === 0 ? (
                        <EmptyState
                            title="No courses found"
                            description={hasFilters ? 'Try adjusting your search or filters.' : 'Get started by creating your first course.'}
                            action={
                                hasFilters ? (
                                    <button onClick={clearFilters} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                        Clear Filters
                                    </button>
                                ) : (
                                    <Link href={route('courses.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                        Create Course
                                    </Link>
                                )
                            }
                        />
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {courses.data.map((course) => (
                                <Link
                                    key={course.id}
                                    href={route('courses.show', course.id)}
                                    className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-accent/50"
                                >
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover" />
                                    ) : (
                                        <div className="flex h-40 w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
                                            {course.title.charAt(0)}
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold capitalize ${statusColors[course.status]}`}>
                                                {course.status}
                                            </span>
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold capitalize ${difficultyColors[course.difficulty]}`}>
                                                {course.difficulty}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">{course.title}</h3>
                                        {course.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                                        )}
                                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                            {course.category && <span>{course.category.name}</span>}
                                            {course.enrollments_count !== undefined && (
                                                <span>{course.enrollments_count} enrolled</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
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
