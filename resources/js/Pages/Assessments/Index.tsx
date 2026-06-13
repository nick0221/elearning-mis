import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
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
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    quiz: {
        icon: (
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'text-info',
        bg: 'bg-info/10',
    },
    assignment: {
        icon: (
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        color: 'text-warning',
        bg: 'bg-warning/10',
    },
};

export default function Index({ assessments, filters = {} }: { assessments: PaginatedData; filters?: { search?: string; type?: string } }) {
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
        >
            <Head title="Assessments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Section */}
                    <div className="rounded-xl bg-gradient-to-r from-primary to-primary-light p-8 text-primary-foreground">
                        <h1 className="text-3xl font-bold">Assessments</h1>
                        <p className="mt-2 text-primary-foreground/80">Create and manage quizzes and assignments for your courses</p>

                        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
                            <div className="relative flex-1 max-w-md">
                                <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search assessments..."
                                    className="h-10 w-full rounded-lg border-0 bg-white pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>
                            <button type="submit" className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors">
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Filters and Actions */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            {['', 'quiz', 'assignment'].map((type) => (
                                <button
                                    key={type || 'all'}
                                    onClick={() => handleTypeFilter(type)}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                        (filters.type || '') === type
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    {type && typeConfig[type] && (
                                        <span className={type === 'quiz' ? 'text-info' : 'text-warning'}>
                                            {typeConfig[type].icon}
                                        </span>
                                    )}
                                    {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'All'}
                                </button>
                            ))}
                        </div>

                        {canCreateAssessments() && (
                            <Link
                                href={route('assessments.create')}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Create Assessment
                            </Link>
                        )}
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
                        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                            <table className="min-w-full divide-y divide-border">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assessment</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pass Score</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {assessments.data.map((a) => {
                                        const tc = typeConfig[a.type] ?? typeConfig.quiz;
                                        return (
                                            <tr key={a.id} className="group transition-colors hover:bg-muted/30">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-foreground">{a.title}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        {a.course.title}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tc.bg} ${tc.color}`}>
                                                        {tc.icon}
                                                        {a.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-muted-foreground">{a.passing_score}%</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route('assessments.show', a.id)}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                                                    >
                                                        View
                                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <Pagination links={assessments.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
