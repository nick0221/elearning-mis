import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/50 to-background">
            <Head title="Welcome" />

            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-4 sm:px-10">
                <Link href="/" className="flex items-center gap-2.5">
                    <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                    <span className="text-base font-bold text-foreground">E-Learning MIS</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('login')}
                        className="rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link
                        href={route('register')}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Get started
                    </Link>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero */}
                <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center sm:px-10">
                    <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground">
                        <span className="flex h-2 w-2 rounded-full bg-success" />
                        Now available — Course management, assessments & more
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Learn without
                        <span className="text-accent"> limits</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        A modern learning management system designed for educators and students.
                        Create courses, track progress, and achieve more together.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link
                            href={route('register')}
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                        >
                            Start learning free
                        </Link>
                        <Link
                            href={route('login')}
                            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto max-w-5xl px-6 pb-20 sm:px-10">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                ),
                                title: 'Course management',
                                desc: 'Create and organize courses with modules, lessons, and rich content. Drag-and-drop reordering included.',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ),
                                title: 'Assessments & grading',
                                desc: 'Build quizzes and assignments with auto-grading. Manual grading with feedback for assignments.',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                ),
                                title: 'Progress tracking',
                                desc: 'Track student progress with detailed analytics. Certificates awarded on course completion.',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                ),
                                title: 'Discussions & messaging',
                                desc: 'Foster collaboration with course discussions and direct messaging between students and instructors.',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                ),
                                title: 'Reports & analytics',
                                desc: 'Comprehensive reports on enrollments, performance, and platform activity for administrators.',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                ),
                                title: 'Role-based access',
                                desc: 'Granular permissions with roles for super admin, instructors, students, and members.',
                            },
                        ].map((feature, i) => (
                            <div key={i} className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-accent/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {feature.icon}
                                    </svg>
                                </div>
                                <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-8 text-center">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} E-Learning MIS. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
