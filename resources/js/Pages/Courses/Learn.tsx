import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Attachment {
    id: number;
    filename: string;
    mime_type: string;
    size_bytes: number;
}

interface LessonCompletion {
    id: number;
}

interface Lesson {
    id: number;
    title: string;
    content?: string;
    type: string;
    video_url?: string;
    duration_minutes?: number;
    attachments: Attachment[];
    lessonCompletions: LessonCompletion[];
}

interface CourseModule {
    id: number;
    title: string;
    description?: string;
    lessons: Lesson[];
}

interface Course {
    id: number;
    title: string;
    description?: string;
    modules: CourseModule[];
}

interface Enrollment {
    id: number;
    status: string;
}

export default function Learn({ course, enrollment, progress }: { course: Course; enrollment: Enrollment; progress: number }) {
    // Find first incomplete lesson, or start from the beginning
    const getInitialLesson = (): Lesson | null => {
        for (const mod of course.modules || []) {
            for (const lesson of mod.lessons) {
                if (lesson.lessonCompletions.length === 0) {
                    return lesson;
                }
            }
        }
        return course.modules?.[0]?.lessons?.[0] || null;
    };

    const [activeLesson, setActiveLesson] = useState<Lesson | null>(getInitialLesson());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);

    // Get all lessons in order for navigation
    const allLessons = course.modules?.flatMap((mod) => mod.lessons) || [];
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const handleComplete = () => {
        if (!activeLesson) return;
        router.post(route('lessons.complete', activeLesson.id), {}, {
            onSuccess: () => {
                router.reload({ only: ['course'] });
            },
        });
    };

    const handleUnenroll = () => {
        router.delete(route('courses.unenroll', course.id));
        setShowUnenrollDialog(false);
    };

    // Auto-navigate to next lesson after completion
    useEffect(() => {
        if (nextLesson && activeLesson?.lessonCompletions.length > 0) {
            // Could auto-advance here if desired
        }
    }, [activeLesson]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold leading-tight text-foreground truncate">{course.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('courses.my')} className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
                            My Courses
                        </Link>
                        <button onClick={() => setShowUnenrollDialog(true)} className="rounded-md border border-destructive/50 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10">
                            Unenroll
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Learn: ${course.title}`} />

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar - Modules & Lessons */}
                <div className={`${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden border-r border-border bg-card transition-all duration-300 lg:w-80`}>
                    <div className="h-full overflow-y-auto p-4">
                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground">{progress}%</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                            {progress === 100 && (
                                <p className="mt-2 text-xs font-medium text-success">Course completed!</p>
                            )}
                        </div>

                        {/* Modules & Lessons */}
                        <div className="space-y-4">
                            {course.modules.map((mod, modIdx) => {
                                const completedInModule = mod.lessons.filter((l) => l.lessonCompletions.length > 0).length;
                                return (
                                    <div key={mod.id}>
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Module {modIdx + 1}
                                            </h3>
                                            <span className="text-xs text-muted-foreground">
                                                {completedInModule}/{mod.lessons.length}
                                            </span>
                                        </div>
                                        <p className="mb-2 text-xs text-muted-foreground">{mod.title}</p>
                                        <ul className="space-y-0.5">
                                            {mod.lessons.map((lesson) => {
                                                const isCompleted = lesson.lessonCompletions.length > 0;
                                                const isActive = activeLesson?.id === lesson.id;
                                                return (
                                                    <li key={lesson.id}>
                                                        <button
                                                            onClick={() => setActiveLesson(lesson)}
                                                            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                                                isActive
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : isCompleted
                                                                    ? 'bg-success/10 text-success'
                                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                {isCompleted ? (
                                                                    <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                ) : (
                                                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">
                                                                        {mod.lessons.indexOf(lesson) + 1}
                                                                    </span>
                                                                )}
                                                                <span className="truncate">{lesson.title}</span>
                                                            </span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeLesson ? (
                        <div className="mx-auto max-w-4xl p-6 lg:p-8">
                            {/* Lesson Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <span>{course.modules.find((m) => m.lessons.some((l) => l.id === activeLesson.id))?.title}</span>
                                    <span>·</span>
                                    <span>Lesson {currentIndex + 1} of {allLessons.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-foreground">{activeLesson.title}</h1>
                                    <div className="flex items-center gap-3">
                                        {activeLesson.duration_minutes && (
                                            <span className="text-sm text-muted-foreground">{activeLesson.duration_minutes} min</span>
                                        )}
                                        {activeLesson.lessonCompletions.length === 0 ? (
                                            <button
                                                onClick={handleComplete}
                                                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                                            >
                                                Mark Complete
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Video Player */}
                            {activeLesson.type === 'video' && activeLesson.video_url && (
                                <div className="mb-6 aspect-video rounded-lg overflow-hidden border border-border bg-black">
                                    <iframe
                                        src={activeLesson.video_url}
                                        className="h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}

                            {/* Audio Player */}
                            {activeLesson.type === 'audio' && activeLesson.video_url && (
                                <div className="mb-6 rounded-lg border border-border bg-card p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                                            <svg className="h-6 w-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3-.895-3-2s1.343-2 3-2 3 .895 3 2V3z" />
                                            </svg>
                                        </div>
                                        <audio controls className="flex-1">
                                            <source src={activeLesson.video_url} />
                                        </audio>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            {activeLesson.content && (
                                <div className="prose prose-slate max-w-none text-foreground">
                                    <div className="whitespace-pre-wrap">{activeLesson.content}</div>
                                </div>
                            )}

                            {/* Attachments */}
                            {activeLesson.attachments.length > 0 && (
                                <div className="mt-6 rounded-lg border border-border bg-card p-4">
                                    <h3 className="mb-3 text-sm font-medium text-foreground">Attachments</h3>
                                    <div className="space-y-2">
                                        {activeLesson.attachments.map((att) => (
                                            <a
                                                key={att.id}
                                                href={`/storage/${att.path}`}
                                                className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-muted transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                                                        {att.mime_type.split('/')[1]?.toUpperCase().slice(0, 3)}
                                                    </div>
                                                    <span className="text-sm text-foreground">{att.filename}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {(att.size_bytes / 1024).toFixed(1)} KB
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                                {prevLesson ? (
                                    <button
                                        onClick={() => setActiveLesson(prevLesson)}
                                        className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {nextLesson ? (
                                    <button
                                        onClick={() => setActiveLesson(nextLesson)}
                                        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        Next
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    progress === 100 && (
                                        <Link
                                            href={route('courses.my')}
                                            className="flex items-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90"
                                        >
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Course Complete!
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <p className="text-lg font-medium text-foreground">Select a lesson to begin</p>
                                <p className="mt-1 text-sm text-muted-foreground">Choose a lesson from the sidebar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={showUnenrollDialog}
                title="Unenroll from Course"
                message="Are you sure you want to unenroll? Your progress will be saved but you won't have access to course content."
                confirmLabel="Unenroll"
                variant="warning"
                onConfirm={handleUnenroll}
                onCancel={() => setShowUnenrollDialog(false)}
            />
        </AuthenticatedLayout>
    );
}
