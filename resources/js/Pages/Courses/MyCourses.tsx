import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import { Input } from '@/Components/ui/input';
import { Select } from '@/Components/ui/select';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Search, ArrowUpDown, CheckCircle, Clock, BookOpen, LayoutGrid, List, Award, ArrowRight, ExternalLink, FilterX } from 'lucide-react';

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
    completed_at?: string;
    progress: number;
    course: Course;
}

interface PaginatedData {
    data: Enrollment[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Filters {
    search?: string;
    status?: string;
    sort?: string;
    category?: string;
}

export default function MyCourses({ enrollments, filters, categories }: { enrollments: PaginatedData; filters: Filters; categories: string[] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => (localStorage.getItem('my-courses-view') as 'grid' | 'list') || 'grid');
    const status = filters.status || '';
    const sort = filters.sort || 'recent';
    const category = filters.category || '';

    useEffect(() => {
        localStorage.setItem('my-courses-view', viewMode);
    }, [viewMode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('courses.my'), { search, status, sort, category: category || undefined }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilter = (key: string, value: string) => {
        router.get(route('courses.my'), { search, ...filters, [key]: value || undefined }, { preserveState: true });
    };

    const clearFilters = () => {
        router.get(route('courses.my'), {}, { preserveState: true });
        setSearch('');
    };

    const completedCount = enrollments.data.filter((e) => e.status === 'completed').length;
    const inProgressCount = enrollments.total - completedCount;
    const hasActiveFilters = search || status || sort !== 'recent' || category;

    const renderCard = (enrollment: Enrollment, isList: boolean) => {
        const progress = enrollment.progress;
        const isCompleted = enrollment.status === 'completed';

        if (isList) {
            return (
                <Link
                    key={enrollment.id}
                    href={route('courses.learn', enrollment.course.id)}
                    className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-accent/50"
                >
                    {enrollment.course.thumbnail ? (
                        <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="h-16 w-24 flex-shrink-0 rounded-md object-cover" />
                    ) : (
                        <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-md bg-muted text-lg font-bold text-muted-foreground">
                            {enrollment.course.title.charAt(0)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="truncate text-sm font-medium text-foreground group-hover:text-accent transition-colors">{enrollment.course.title}</h3>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                isCompleted ? 'bg-success/10 text-success' : 'bg-info/10 text-info'
                            }`}>
                                {isCompleted ? <CheckCircle className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                                {isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                            <span className="capitalize">{enrollment.course.difficulty}</span>
                            {enrollment.course.category && <span>{enrollment.course.category.name}</span>}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                                <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-success' : 'bg-accent'}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs font-medium text-foreground">{progress}%</span>
                        </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                        {isCompleted && (
                            <a
                                href={route('courses.certificate', enrollment.course.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
                                title="Download Certificate"
                            >
                                <Award className="h-3.5 w-3.5" />
                            </a>
                        )}
                        <span className="rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary group-hover:bg-primary/20 transition-colors">
                            {isCompleted ? 'Review' : 'Resume'}
                            <ArrowRight className="ml-1 inline h-3 w-3" />
                        </span>
                    </div>
                </Link>
            );
        }

        return (
            <Link
                key={enrollment.id}
                href={route('courses.learn', enrollment.course.id)}
                className="group relative block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-accent/50 hover:-translate-y-0.5"
            >
                <div className="relative">
                    {enrollment.course.thumbnail ? (
                        <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="h-40 w-full object-cover" />
                    ) : (
                        <div className="flex h-40 w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
                            {enrollment.course.title.charAt(0)}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-lg">
                            {isCompleted ? 'Review' : 'Continue'}
                            <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                    {isCompleted && (
                        <div className="absolute right-2 top-2">
                            <a
                                href={route('courses.certificate', enrollment.course.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
                                title="Download Certificate"
                            >
                                <Award className="h-4 w-4" />
                            </a>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="mb-2 flex flex-wrap gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            isCompleted ? 'bg-success/10 text-success' : 'bg-info/10 text-info'
                        }`}>
                            {isCompleted ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground capitalize">
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

                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{progress}%</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${
                                    progress === 100 ? 'bg-success' : 'bg-accent'
                                }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        {enrollment.course.category && (
                            <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {enrollment.course.category.name}
                            </span>
                        )}
                        <span>
                            {isCompleted && enrollment.completed_at
                                ? `Completed ${new Date(enrollment.completed_at).toLocaleDateString()}`
                                : `Enrolled ${new Date(enrollment.enrolled_at).toLocaleDateString()}`
                            }
                        </span>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <AuthenticatedLayout
        >
            <Head title="My Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="My Courses"
                    />
                    {/* Stats Summary */}
                    {enrollments.total > 0 && (
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="text-2xl font-bold text-foreground">{enrollments.total}</div>
                                <div className="mt-0.5 text-sm text-muted-foreground">Total Enrolled</div>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="text-2xl font-bold text-success">{completedCount}</div>
                                <div className="mt-0.5 text-sm text-muted-foreground">Completed</div>
                            </div>
                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="text-2xl font-bold text-info">{inProgressCount}</div>
                                <div className="mt-0.5 text-sm text-muted-foreground">In Progress</div>
                            </div>
                        </div>
                    )}

                    {/* Search & Filters */}
                    <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search courses..."
                                        className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex rounded-md border border-border overflow-hidden">
                                        {['', 'enrolled', 'completed'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => applyFilter('status', s)}
                                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                                    status === s
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-background text-muted-foreground hover:bg-muted'
                                                }`}
                                            >
                                                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <ArrowUpDown className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                        <Select
                                            value={sort}
                                            onChange={(e) => applyFilter('sort', e.target.value)}
                                            className="appearance-none rounded-md border border-input bg-background pl-8 pr-8 py-1.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <option value="recent">Recent</option>
                                            <option value="oldest">Oldest</option>
                                            <option value="title">A-Z</option>
                                        </Select>
                                    </div>
                                    <div className="flex rounded-md border border-border overflow-hidden">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                            title="Grid view"
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                            title="List view"
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                                        >
                                            <FilterX className="h-3 w-3" /> Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Category Pills */}
                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={() => applyFilter('category', '')}
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                            !category
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => applyFilter('category', cat)}
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                                category === cat
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Cards */}
                    {enrollments.data.length === 0 ? (
                        <EmptyState
                            title={hasActiveFilters ? 'No matching courses' : 'No courses yet'}
                            description={
                                hasActiveFilters
                                    ? 'Try adjusting your search or filters.'
                                    : "You haven't enrolled in any courses yet. Browse our catalog to get started."
                            }
                            action={
                                hasActiveFilters ? (
                                    <button onClick={clearFilters} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                        Clear Filters
                                    </button>
                                ) : (
                                    <Link href={route('courses.index')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                        Browse Courses
                                    </Link>
                                )
                            }
                        />
                    ) : (
                        <>
                            <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
                                {enrollments.data.map((enrollment) => renderCard(enrollment, viewMode === 'list'))}
                            </div>

                            <Pagination links={enrollments.links} from={enrollments.from} to={enrollments.to} total={enrollments.total} />
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
