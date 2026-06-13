import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';

interface CourseStat {
    id: number;
    title: string;
    status: string;
    slug: string;
    enrollments_count: number;
    average_rating: number;
    updated_at: string;
}

interface Enrollment {
    id: number;
    user: { id: number; name: string };
    course: { id: number; title: string; slug: string };
    created_at: string;
}

interface Completion {
    id: number;
    lesson: { title: string; module: { course: { id: number; title: string } } };
    created_at: string;
}

interface EnrolledCourse {
    id: number;
    status: string;
    enrolled_at: string;
    completed_at?: string;
    course: {
        id: number;
        title: string;
        slug: string;
        thumbnail?: string;
        difficulty: string;
    };
    progress: number;
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
    const colorMap: Record<string, { bg: string; icon: string }> = {
        primary: { bg: 'bg-primary/10', icon: 'text-primary' },
        accent: { bg: 'bg-accent/10', icon: 'text-accent' },
        info: { bg: 'bg-info/10', icon: 'text-info' },
        success: { bg: 'bg-success/10', icon: 'text-success' },
        warning: { bg: 'bg-warning/10', icon: 'text-warning' },
    };
    const c = colorMap[color] ?? colorMap.primary;
    return (
        <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.icon} transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 text-3xl font-bold text-foreground tabular-nums">{value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        </div>
    );
}

export default function Dashboard({
    stats, recentEnrollments, recentCompletions, courses, enrolledCourses,
}: {
    stats?: Record<string, number>;
    recentEnrollments?: Enrollment[];
    recentCompletions?: Completion[];
    courses?: CourseStat[];
    enrolledCourses?: EnrolledCourse[];
}) {
    const { user } = usePage().props.auth;
    const { isSuperAdmin, isInstructor, isStudent } = usePermission();

    const role = user?.roles?.[0];

    return (
        <AuthenticatedLayout
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Card */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground shadow-lg sm:p-8">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
                        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />
                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-xl font-bold backdrop-blur-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold">Welcome back, {user?.name}!</h3>
                                <p className="mt-0.5 text-primary-foreground/70 text-sm">Here's what's happening today</p>
                            </div>
                            {role && (
                                <span className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium capitalize backdrop-blur-sm sm:inline-block">
                                    {role}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {stats && Object.keys(stats).length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {isInstructor() && (
                                <>
                                    <StatCard
                                        icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                                        value={stats.totalCourses ?? 0}
                                        label="My Courses"
                                        color="primary"
                                    />
                                    <StatCard
                                        icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                                        value={stats.totalEnrollments ?? 0}
                                        label="Total Enrollments"
                                        color="accent"
                                    />
                                    <StatCard
                                        icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                        value={stats.totalAssessments ?? 0}
                                        label="Assessments"
                                        color="info"
                                    />
                                    <StatCard
                                        icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                                        value={stats.totalCompletions ?? 0}
                                        label="Lessons Completed"
                                        color="success"
                                    />
                                </>
                            )}
                            {isStudent() && (
                                <>
                                    <StatCard
                                        icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                                        value={stats.enrolledCourses ?? 0}
                                        label="Enrolled Courses"
                                        color="accent"
                                    />
                                    <StatCard
                                        icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                                        value={stats.completedLessons ?? 0}
                                        label="Lessons Completed"
                                        color="success"
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            <h3 className="text-lg font-medium text-foreground">Quick Actions</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href={route('courses.index')} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                Browse Courses
                            </Link>
                            {isStudent() && (
                                <Link href={route('courses.my')} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/90 transition-colors">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    My Courses
                                </Link>
                            )}
                            {isInstructor() && (
                                <Link href={route('courses.create')} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/90 transition-colors">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    New Course
                                </Link>
                            )}
                            {(isSuperAdmin() || isInstructor()) && (
                                <Link href={route('reports.index')} className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    Reports
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Instructor: Course Overview */}
                    {isInstructor() && courses && courses.length > 0 && (
                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    <h3 className="text-lg font-medium text-foreground">Your Courses</h3>
                                </div>
                                <Link href={route('courses.create')} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">+ New Course</Link>
                            </div>
                            <div className="divide-y divide-border">
                                {courses.map((c) => (
                                    <Link key={c.id} href={route('courses.edit', c.id)} className="flex items-center justify-between py-3.5 transition-colors hover:bg-muted/30 -mx-6 px-6 rounded-none first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                                                {c.title.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-sm font-medium text-foreground truncate block">{c.title}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`inline-flex rounded-full px-1.5 py-0.5 text-xs capitalize font-medium ${
                                                        c.status === 'published' ? 'bg-success/10 text-success' :
                                                        c.status === 'archived' ? 'bg-warning/10 text-warning' :
                                                        'bg-muted text-muted-foreground'
                                                    }`}>{c.status}</span>
                                                    <span className="text-xs text-muted-foreground">{c.enrollments_count} enrolled</span>
                                                    {c.average_rating > 0 && (
                                                        <span className="inline-flex gap-0.5 text-yellow-600">
                                                            {Array.from({ length: Math.round(c.average_rating) }).map((_, i) => (
                                                                <svg key={i} className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                                </svg>
                                                            ))}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Enrollments (Instructor) */}
                    {isInstructor() && recentEnrollments && recentEnrollments.length > 0 && (
                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                <h3 className="text-lg font-medium text-foreground">Recent Enrollments</h3>
                            </div>
                            <div className="divide-y divide-border">
                                {recentEnrollments.map((e) => (
                                    <div key={e.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                                                {e.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-sm text-foreground">{e.user.name}</span>
                                                <span className="ml-1 text-xs text-muted-foreground">enrolled in</span>
                                                <Link href={route('courses.show', e.course.id)} className="ml-1 text-sm font-medium text-accent hover:text-accent/80 truncate">{e.course.title}</Link>
                                            </div>
                                        </div>
                                        <span className="shrink-0 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student: Enrolled Courses */}
                    {isStudent() && enrolledCourses && enrolledCourses.length > 0 && (
                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                    <h3 className="text-lg font-medium text-foreground">Continue Learning</h3>
                                </div>
                                <Link href={route('courses.my')} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">View All</Link>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {enrolledCourses.map((ec) => {
                                    const isCompleted = ec.status === 'completed';
                                    return (
                                        <Link
                                            key={ec.id}
                                            href={isCompleted ? route('courses.show', ec.course.id) : route('courses.learn', ec.course.id)}
                                            className="group block overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-accent/50"
                                        >
                                            {ec.course.thumbnail ? (
                                                <img src={ec.course.thumbnail} alt={ec.course.title} className="h-36 w-full object-cover" />
                                            ) : (
                                                <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 text-3xl font-bold text-primary">
                                                    {ec.course.title.charAt(0)}
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="mb-2 flex items-center gap-2">
                                                    {isCompleted ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-xs font-semibold text-info">
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                                                            In Progress
                                                        </span>
                                                    )}
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                                        ec.course.difficulty === 'beginner' ? 'bg-success/10 text-success' :
                                                        ec.course.difficulty === 'intermediate' ? 'bg-info/10 text-info' :
                                                        'bg-destructive/10 text-destructive'
                                                    }`}>
                                                        {ec.course.difficulty}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                                                    {ec.course.title}
                                                </h4>
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">Progress</span>
                                                        <span className="font-semibold text-foreground">{ec.progress}%</span>
                                                    </div>
                                                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${
                                                                ec.progress === 100 ? 'bg-success' : 'bg-accent'
                                                            }`}
                                                            style={{ width: `${ec.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Role-Specific Quick Links */}
                    {isSuperAdmin() && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Link href={route('users.index')} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-accent/50">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <h4 className="mt-3 font-semibold text-foreground group-hover:text-accent transition-colors">Users</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Manage system users and roles</p>
                            </Link>
                            <Link href={route('courses.index')} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-accent/50">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <h4 className="mt-3 font-semibold text-foreground group-hover:text-accent transition-colors">Courses</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Manage courses and content</p>
                            </Link>
                            <Link href={route('reports.index')} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-accent/50">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info/10 text-info transition-transform group-hover:scale-110">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <h4 className="mt-3 font-semibold text-foreground group-hover:text-accent transition-colors">Reports</h4>
                                <p className="mt-1 text-xs text-muted-foreground">View analytics and reports</p>
                            </Link>
                            <Link href={route('settings.index')} className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-accent/50">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning transition-transform group-hover:scale-110">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h4 className="mt-3 font-semibold text-foreground group-hover:text-accent transition-colors">Settings</h4>
                                <p className="mt-1 text-xs text-muted-foreground">System configuration</p>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
