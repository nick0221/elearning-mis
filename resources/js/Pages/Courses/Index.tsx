import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface Category {
    id: number;
    name: string;
}

interface Instructor {
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
    instructors?: Instructor[];
    enrollments_count?: number;
    estimated_duration_minutes?: number;
    modules_count?: number;
    created_at: string;
}

interface PaginatedData {
    data: Course[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export default function Index({ courses, categories, filters }: { courses: PaginatedData; categories: Category[]; filters: { search?: string; status?: string; category_id?: string; sort?: string } }) {
    const { canCreateCourses } = usePermission();
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('courses.index'), { search, status: filters.status, category_id: filters.category_id, sort: filters.sort }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        router.get(route('courses.index'), {}, { preserveState: true });
    };

    const handleSort = (sort: string) => {
        router.get(route('courses.index'), { search, status: filters.status, category_id: filters.category_id, sort }, { preserveState: true });
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

    const difficultyIcons: Record<string, React.ReactNode> = {
        beginner: (
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        intermediate: (
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        advanced: (
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    };

    const hasFilters = filters.search || filters.status || filters.category_id;

    return (
        <AuthenticatedLayout
        >
            <Head title="Course Catalog" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="mb-8 rounded-xl bg-gradient-to-r from-primary to-primary-light p-8 text-primary-foreground">
                        <h1 className="text-3xl font-bold">Explore Our Courses</h1>
                        <p className="mt-2 text-primary-foreground/80">Discover courses to advance your career and learn new skills</p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search courses by title or description..."
                                    className="h-12 w-full rounded-lg border-0 bg-white pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>
                            <button type="submit" className="rounded-lg bg-accent px-6 py-2 font-medium text-accent-foreground hover:bg-accent/90">
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Filters and Actions */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status Filters */}
                            <button
                                onClick={clearFilters}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${!hasFilters ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                                All ({courses.total})
                            </button>
                            {['published', 'draft', 'archived'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => router.get(route('courses.index'), { search, status, category_id: filters.category_id, sort: filters.sort }, { preserveState: true })}
                                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${statusColors[status]} ${filters.status === status ? 'ring-2 ring-ring' : ''}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Sort Dropdown */}
                            <select
                                value={filters.sort || ''}
                                onChange={(e) => handleSort(e.target.value)}
                                className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Sort by: Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="title">Title A-Z</option>
                                <option value="popular">Most Popular</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="flex rounded-lg border border-border">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {canCreateCourses() && (
                                <Link
                                    href={route('courses.create')}
                                    className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                                >
                                    + Create Course
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Category Filters */}
                    {categories.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => router.get(route('courses.index'), { search, status: filters.status, category_id: cat.id, sort: filters.sort }, { preserveState: true })}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${filters.category_id == String(cat.id) ? 'border-accent bg-accent/10 text-accent-foreground' : 'border-border text-muted-foreground hover:bg-muted'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Course Grid/List */}
                    {courses.data.length === 0 ? (
                        <EmptyState
                            title="No courses found"
                            description={hasFilters ? 'Try adjusting your search or filters.' : 'Get started by creating your first course.'}
                            action={
                                hasFilters ? (
                                    <button onClick={clearFilters} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                        Clear Filters
                                    </button>
                                ) : canCreateCourses() ? (
                                    <Link href={route('courses.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                        Create Course
                                    </Link>
                                ) : null
                            }
                        />
                    ) : viewMode === 'grid' ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {courses.data.map((course) => (
                                <Link
                                    key={course.id}
                                    href={route('courses.show', course.id)}
                                    className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-accent/50 hover:-translate-y-1"
                                >
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="h-44 w-full object-cover" />
                                    ) : (
                                        <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 text-3xl font-bold text-primary">
                                            {course.title.charAt(0)}
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[course.status]}`}>
                                                {course.status}
                                            </span>
                                            <span className="text-xs">{difficultyIcons[course.difficulty]}</span>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${difficultyColors[course.difficulty]}`}>
                                                {course.difficulty}
                                            </span>
                                        </div>
                                        <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-accent transition-colors">{course.title}</h3>
                                        {course.description && (
                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{course.description}</p>
                                        )}
                                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                                            {course.instructors && course.instructors.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {course.instructors[0].name}
                                                </span>
                                            )}
                                            {course.estimated_duration_minutes && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {Math.round(course.estimated_duration_minutes / 60)}h
                                                </span>
                                            )}
                                            {course.enrollments_count !== undefined && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                    {course.enrollments_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {courses.data.map((course) => (
                                <Link
                                    key={course.id}
                                    href={route('courses.show', course.id)}
                                    className="group flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-accent/50"
                                >
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="h-32 w-48 flex-shrink-0 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex h-32 w-48 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-2xl font-bold text-primary">
                                            {course.title.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[course.status]}`}>
                                                {course.status}
                                            </span>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${difficultyColors[course.difficulty]}`}>
                                                {course.difficulty}
                                            </span>
                                            {course.category && (
                                                <span className="text-xs text-muted-foreground">{course.category.name}</span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{course.title}</h3>
                                        {course.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                                        )}
                                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                            {course.instructors && course.instructors.length > 0 && (
                                                <span>by {course.instructors[0].name}</span>
                                            )}
                                            {course.estimated_duration_minutes && (
                                                <span>{Math.round(course.estimated_duration_minutes / 60)} hours</span>
                                            )}
                                            {course.enrollments_count !== undefined && (
                                                <span>{course.enrollments_count} students</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Pagination links={courses.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
