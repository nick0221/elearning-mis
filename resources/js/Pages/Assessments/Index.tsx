import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import { Head, Link } from '@inertiajs/react';
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

export default function Index({ assessments }: { assessments: PaginatedData }) {
    const { canCreateAssessments } = usePermission();

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Assessments</h2>}
        >
            <Head title="Assessments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {canCreateAssessments() && (
                        <div className="mb-6 flex justify-end">
                            <Link href={route('assessments.create')} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                Create Assessment
                            </Link>
                        </div>
                    )}

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
                                    <tr key={a.id} className="hover:bg-muted/50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{a.title}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{a.course.title}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="inline-flex rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">{a.type}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{a.passing_score}%</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <Link href={route('assessments.show', a.id)} className="text-accent hover:text-accent/80">View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
