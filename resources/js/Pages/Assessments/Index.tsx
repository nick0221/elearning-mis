import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface Course {
    id: number;
    title: string;
}

interface Assessment {
    id: number;
    title: string;
    type: string;
    passing_score: number;
    course: Course;
    created_at: string;
}

interface PaginatedData {
    data: Assessment[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function Index({ assessments, filters }: { assessments: PaginatedData; filters: { search?: string; type?: string } }) {
    const { canCreateAssessments } = usePermission();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('assessments.index'), { search, type: filters.type }, { preserveState: true });
    };

    const handleTypeFilter = (type: string) => {
        router.get(route('assessments.index'), { search, type }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        router.get(route('assessments.index'), {}, { preserveState: true });
    };

    const hasFilters = filters.search || filters.type;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Assessments</h2>}
        >
            <Head title="Assessments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header actions */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search assessments..."
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                Search
                            </button>
                        </form>

                        <div className="flex items-center gap-2">
                            <div className="flex gap-1 rounded-lg border border-border p-0.5">
                                {['', 'quiz', 'assignment'].map((type) => (
                                    <button
                                        key={type || 'all'}
                                        onClick={() => handleTypeFilter(type)}
                                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                            (filters.type || '') === type
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted'
                                        }`}
                                    >
                                        {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'All'}
                                    </button>
                                ))}
                            </div>

                            {canCreateAssessments() && (
                                <Link href={route('assessments.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                    + Create
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    {assessments.data.length === 0 ? (
                        <EmptyState
                            title="No assessments found"
                            description={hasFilters ? 'Try adjusting your search or filters.' : 'Create an assessment to get started.'}
                            action={
                                hasFilters ? (
                                    <button onClick={clearFilters} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                        Clear Filters
                                    </button>
                                ) : canCreateAssessments() ? (
                                    <Link href={route('assessments.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                        Create Assessment
                                    </Link>
                                ) : null
                            }
                        />
                    ) : (
                        <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Pass Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {assessments.data.map((a) => (
                                        <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{a.title}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{a.course.title}</td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="inline-flex rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground capitalize">{a.type}</span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{a.passing_score}%</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <Link href={route('assessments.show', a.id)} className="text-accent hover:text-accent/80 font-medium">View</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {assessments.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-1">
                            {Array.from({ length: assessments.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={route('assessments.index', { page, search, type: filters.type })}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        page === assessments.current_page ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
                                    }`}
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
