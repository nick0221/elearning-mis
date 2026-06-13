import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState, useCallback } from 'react';

function useScrollReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const { ref, visible } = useScrollReveal(0.5);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const duration = 1200;
        const step = Math.max(1, Math.floor(target / (duration / 16)));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [visible, target]);

    return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const { ref, visible } = useScrollReveal(0.1);
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
        >
            {children}
        </div>
    );
}

const features = [
    {
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        ),
        title: 'Course management',
        desc: 'Create and organize courses with modules, lessons, and rich content. Drag-and-drop reordering included.',
        color: 'primary',
    },
    {
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        ),
        title: 'Assessments & grading',
        desc: 'Build quizzes and assignments with auto-grading. Manual grading with feedback for assignments.',
        color: 'accent',
    },
    {
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        ),
        title: 'Progress tracking',
        desc: 'Track student progress with detailed analytics. Certificates awarded on course completion.',
        color: 'info',
    },
    {
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        ),
        title: 'Discussions & messaging',
        desc: 'Foster collaboration with course discussions and direct messaging between students and instructors.',
        color: 'success',
    },
    {
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        ),
        title: 'Reports & analytics',
        desc: 'Comprehensive reports on enrollments, performance, and platform activity for administrators.',
        color: 'warning',
    },
    {
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        ),
        title: 'Role-based access',
        desc: 'Granular permissions with roles for super admin, instructors, students, and members.',
        color: 'accent',
    },
];

const colorMap: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    accent: { bg: 'bg-accent/10', text: 'text-accent' },
    info: { bg: 'bg-info/10', text: 'text-info' },
    success: { bg: 'bg-success/10', text: 'text-success' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
};

const steps = [
    {
        number: '1',
        title: 'Instructors create courses',
        desc: 'Design structured courses with modules, lessons, quizzes, and assignments using an intuitive drag-and-drop editor.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        ),
    },
    {
        number: '2',
        title: 'Students enroll & learn',
        desc: 'Browse the course catalog, enroll in courses, and progress through lessons at your own pace with tracking.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        ),
    },
    {
        number: '3',
        title: 'Assess & certify',
        desc: 'Complete assessments, receive grades with feedback, and earn certificates upon successful course completion.',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        ),
    },
];

const testimonials = [
    {
        quote: 'This platform transformed how we deliver training. The course builder is incredibly intuitive, and students love the clean interface.',
        author: 'Dr. Sarah Chen',
        role: 'Computer Science Professor',
        initials: 'SC',
    },
    {
        quote: 'The auto-grading and progress tracking save me hours every week. I can finally focus on teaching instead of administrative work.',
        author: 'Marcus Johnson',
        role: 'High School Teacher',
        initials: 'MJ',
    },
    {
        quote: 'As a student, I love how easy it is to track my progress. The certificate system keeps me motivated to complete courses.',
        author: 'Elena Rodriguez',
        role: 'Online Learner',
        initials: 'ER',
    },
];

export default function Welcome() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-muted/30 to-background">
            <Head title="Welcome" />

            {/* Nav */}
            <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-10">
                    <Link href="/" className="flex items-center gap-2.5">
                        <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                        <span className="text-base font-bold text-foreground">E-Learning MIS</span>
                    </Link>
                    {/* Desktop nav */}
                    <div className="hidden items-center gap-6 sm:flex">
                        <button onClick={() => scrollTo('features')} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</button>
                        <button onClick={() => scrollTo('how-it-works')} className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</button>
                        <button onClick={() => scrollTo('testimonials')} className="text-sm text-muted-foreground transition-colors hover:text-foreground">Testimonials</button>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('login')}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                            >
                                Sign in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                            >
                                Get started
                            </Link>
                        </div>
                    </div>
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted sm:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="border-t border-border/50 bg-background px-6 pb-4 pt-2 sm:hidden">
                        <div className="flex flex-col gap-2">
                            <button onClick={() => { scrollTo('features'); setMobileMenuOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted">Features</button>
                            <button onClick={() => { scrollTo('how-it-works'); setMobileMenuOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted">How it works</button>
                            <button onClick={() => { scrollTo('testimonials'); setMobileMenuOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted">Testimonials</button>
                            <hr className="border-border" />
                            <Link href={route('login')} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">Sign in</Link>
                            <Link href={route('register')} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground text-center">Get started</Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="absolute -left-32 -top-32 h-64 w-64 animate-pulse rounded-full bg-primary/10 blur-3xl" style={{ animationDuration: '4s' }} />
                    <div className="absolute -right-32 top-32 h-64 w-64 animate-pulse rounded-full bg-accent/10 blur-3xl" style={{ animationDuration: '6s' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    {/* Dot grid background */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                    <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center sm:px-10 sm:pt-28">
                        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-success" />
                            Now available — Course management, assessments & more
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Learn without
                            <span className="relative ml-2">
                                <span className="relative z-10 text-accent">limits</span>
                                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent/20 skew-x-3" />
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            A modern learning management system designed for educators and students.
                            Create courses, track progress, and achieve more together.
                        </p>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href={route('register')}
                                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/30"
                            >
                                Start learning free
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link
                                href={route('courses.index')}
                                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Browse courses
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <RevealSection>
                    <section className="mx-auto max-w-5xl px-6 pb-20 sm:px-10">
                        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
                            {[
                                { target: 50, suffix: '+', label: 'Courses' },
                                { target: 1000, suffix: '+', label: 'Students' },
                                { target: 10, suffix: '+', label: 'Instructors' },
                                { target: 95, suffix: '%', label: 'Satisfaction' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center justify-center bg-card px-6 py-10 transition-colors hover:bg-muted/30">
                                    <span className="text-4xl font-bold text-foreground">
                                        <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                                    </span>
                                    <span className="mt-1.5 text-xs font-medium text-muted-foreground">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </RevealSection>

                {/* Features */}
                <section id="features" className="border-t border-border/50 bg-muted/20 py-20">
                    <RevealSection>
                        <div className="mx-auto max-w-6xl px-6 sm:px-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Everything you need
                                </span>
                                <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Built for modern learning</h2>
                                <p className="mt-3 text-muted-foreground">
                                    A complete platform that empowers instructors, engages students, and simplifies administration.
                                </p>
                            </div>
                            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature, i) => {
                                    const c = colorMap[feature.color] ?? colorMap.primary;
                                    return (
                                        <div
                                            key={i}
                                            className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg"
                                        >
                                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text} transition-transform group-hover:scale-110`}>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {feature.icon}
                                                </svg>
                                            </div>
                                            <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </RevealSection>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-20">
                    <RevealSection>
                        <div className="mx-auto max-w-6xl px-6 sm:px-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Simple workflow
                                </span>
                                <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">How it works</h2>
                                <p className="mt-3 text-muted-foreground">
                                    Three simple steps to transform your educational experience.
                                </p>
                            </div>
                            <div className="mt-12 grid gap-8 md:grid-cols-3">
                                {steps.map((step, i) => (
                                    <div key={i} className="group relative text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary/20 group-hover:scale-110">
                                            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {step.icon}
                                            </svg>
                                        </div>
                                        <div className="mx-auto mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform group-hover:scale-110">
                                            {step.number}
                                        </div>
                                        <h3 className="mt-3 font-semibold text-foreground">{step.title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                                        {i < steps.length - 1 && (
                                            <div className="absolute right-0 top-8 hidden md:block">
                                                <svg className="h-6 w-6 text-muted-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealSection>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="border-t border-border/50 bg-muted/20 py-20">
                    <RevealSection>
                        <div className="mx-auto max-w-6xl px-6 sm:px-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Testimonials
                                </span>
                                <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Loved by educators & learners</h2>
                                <p className="mt-3 text-muted-foreground">
                                    Hear from the community using E-Learning MIS every day.
                                </p>
                            </div>
                            <div className="mt-12 grid gap-6 md:grid-cols-3">
                                {testimonials.map((t, i) => (
                                    <div key={i} className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg">
                                        <svg className="mb-4 h-8 w-8 text-accent/30" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                        </svg>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
                                        <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                {t.initials}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-foreground">{t.author}</div>
                                                <div className="text-xs text-muted-foreground">{t.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </RevealSection>
                </section>

                {/* CTA */}
                <section className="relative overflow-hidden border-t border-border/50 py-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
                    <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <RevealSection>
                        <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
                            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                                Ready to get started?
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Join thousands of students and instructors already using E-Learning MIS.
                                Create your account today — it&apos;s free.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href={route('register')}
                                    className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                                >
                                    Create free account
                                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <button
                                    onClick={() => scrollTo('features')}
                                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    Learn more
                                </button>
                            </div>
                        </div>
                    </RevealSection>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card">
                <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2.5">
                                <ApplicationLogo className="h-7 w-7 fill-current text-primary" />
                                <span className="text-sm font-bold text-foreground">E-Learning MIS</span>
                            </div>
                            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                A modern learning management system empowering educators and students
                                to teach, learn, and grow together.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Platform</h4>
                            <ul className="mt-4 space-y-2.5">
                                {['Courses', 'Assessments', 'Reports', 'Certificates'].map((item) => (
                                    <li key={item}>
                                        <span className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-default">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Company</h4>
                            <ul className="mt-4 space-y-2.5">
                                {['About', 'Blog', 'Contact', 'Privacy'].map((item) => (
                                    <li key={item}>
                                        <span className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-default">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                        <p className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} E-Learning MIS. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            {['Twitter', 'GitHub', 'LinkedIn'].map((name) => (
                                <span key={name} className="text-xs text-muted-foreground transition-colors hover:text-foreground cursor-default">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
