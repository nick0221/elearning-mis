import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Users, CheckCircle, Clipboard, BarChart3, ArrowRight, Star, TrendingUp } from 'lucide-react';

interface CourseStat {
    id: number;
    title: string;
    slug: string;
    status: string;
    enrollments_count: number;
    completed_enrollments_count: number;
    average_rating: number;
}

interface Submission {
    id: number;
    status: string;
    created_at: string;
    auto_score: number;
    user: { id: number; name: string };
    assessment: { id: number; title: string; course: { id: number; title: string } };
}

export default function Dashboard({ stats, courses, recentSubmissions, monthlyEnrollments }: {
    stats: {
        totalCourses: number;
        totalEnrollments: number;
        completedEnrollments: number;
        completionRate: number;
        totalAssessments: number;
        totalSubmissions: number;
    };
    courses: CourseStat[];
    recentSubmissions: Submission[];
    monthlyEnrollments: Record<string, number>;
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Instructor Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Instructor Dashboard</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Performance overview across all your courses</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Courses</span>
                                <BookOpen className="h-4 w-4 text-accent" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalCourses}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Enrollments</span>
                                <Users className="h-4 w-4 text-blue-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalEnrollments}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Completed</span>
                                <CheckCircle className="h-4 w-4 text-success" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-foreground">{stats.completedEnrollments}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Completion Rate</span>
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-foreground">{stats.completionRate}%</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Assessments</span>
                                <Clipboard className="h-4 w-4 text-purple-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalAssessments}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Submissions</span>
                                <BarChart3 className="h-4 w-4 text-amber-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalSubmissions}</p>
                        </div>
                    </div>

                    {/* Course Performance Table */}
                    <div className="rounded-xl border border-border bg-card shadow-sm">
                        <div className="border-b border-border px-6 py-4">
                            <h2 className="text-lg font-semibold text-foreground">Course Performance</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        <th className="px-6 py-3">Course</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Enrolled</th>
                                        <th className="px-6 py-3 text-right">Completed</th>
                                        <th className="px-6 py-3 text-right">Rate</th>
                                        <th className="px-6 py-3 text-right">Rating</th>
                                        <th className="px-6 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {courses.map((course) => {
                                        const rate = course.enrollments_count > 0
                                            ? Math.round((course.completed_enrollments_count / course.enrollments_count) * 100)
                                            : 0;
                                        return (
                                            <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-foreground">{course.title}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        course.status === 'published' ? 'bg-success/10 text-success'
                                                            : course.status === 'draft' ? 'bg-muted text-muted-foreground'
                                                                : 'bg-destructive/10 text-destructive'
                                                    }`}>
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-foreground">{course.enrollments_count}</td>
                                                <td className="px-6 py-4 text-right text-sm text-foreground">{course.completed_enrollments_count}</td>
                                                <td className="px-6 py-4 text-right text-sm font-medium text-foreground">{rate}%</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="inline-flex items-center gap-1 text-sm text-amber-500">
                                                        <Star className="h-3.5 w-3.5 fill-current" />
                                                        {Number(course.average_rating).toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route('courses.edit', course.id)}
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                                                    >
                                                        View <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {courses.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                                                No courses yet. Create your first course to see performance data.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Monthly Enrollments Chart */}
                    {Object.keys(monthlyEnrollments).length > 0 && (
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">Monthly Enrollments</h2>
                            <div className="flex items-end gap-2">
                                {Object.entries(monthlyEnrollments).slice(-12).map(([month, count]) => {
                                    const maxCount = Math.max(...Object.values(monthlyEnrollments), 1);
                                    const height = (count / maxCount) * 100;
                                    return (
                                        <div key={month} className="flex flex-1 flex-col items-center gap-1">
                                            <span className="text-xs font-medium text-foreground">{count}</span>
                                            <div
                                                className="w-full rounded-t bg-accent transition-all hover:bg-accent/80"
                                                style={{ height: `${Math.max(height, 4)}px` }}
                                                title={`${month}: ${count} enrollments`}
                                            />
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(month + '-01').toLocaleDateString('en', { month: 'short' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Recent Submissions */}
                    {recentSubmissions.length > 0 && (
                        <div className="rounded-xl border border-border bg-card shadow-sm">
                            <div className="border-b border-border px-6 py-4">
                                <h2 className="text-lg font-semibold text-foreground">Recent Submissions</h2>
                            </div>
                            <div className="divide-y divide-border">
                                {recentSubmissions.map((sub) => (
                                    <div key={sub.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-foreground truncate">{sub.user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {sub.assessment.title} · {sub.assessment.course.title}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                sub.status === 'graded' ? 'bg-success/10 text-success'
                                                    : sub.status === 'submitted' ? 'bg-accent/10 text-accent'
                                                        : 'bg-muted text-muted-foreground'
                                            }`}>
                                                {sub.status}
                                            </span>
                                            {sub.auto_score !== null && (
                                                <span className="text-sm font-medium text-foreground">{sub.auto_score}</span>
                                            )}
                                            <Link
                                                href={route('assessments.submissions.grade', [sub.assessment_id, sub.id])}
                                                className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                                            >
                                                Grade
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
