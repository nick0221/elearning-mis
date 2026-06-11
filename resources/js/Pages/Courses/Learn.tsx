import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

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
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(
        course.modules?.[0]?.lessons?.[0] || null
    );

    const handleComplete = () => {
        if (!activeLesson) return;
        router.post(route('lessons.complete', activeLesson.id), {}, {
            onSuccess: () => {
                router.reload({ only: ['course'] });
            },
        });
    };

    const handleUnenroll = () => {
        if (confirm('Are you sure you want to unenroll?')) {
            router.delete(route('courses.unenroll', course.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-foreground">{course.title}</h2>
                    <div className="flex gap-2">
                        <Link href={route('courses.my')} className="rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted">
                            My Courses
                        </Link>
                        <button onClick={handleUnenroll} className="rounded-md border border-destructive px-3 py-1 text-sm text-destructive hover:bg-destructive/10">
                            Unenroll
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Learn: ${course.title}`} />

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar - Modules & Lessons */}
                <div className="w-80 overflow-y-auto border-r border-border bg-card">
                    <div className="p-4">
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground">{progress}%</span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {course.modules.map((mod) => (
                                <div key={mod.id}>
                                    <h3 className="mb-2 text-sm font-medium text-foreground">{mod.title}</h3>
                                    <ul className="space-y-1">
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
                                                            {isCompleted && (
                                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                            {lesson.title}
                                                        </span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeLesson ? (
                        <div className="mx-auto max-w-3xl p-8">
                            <div className="mb-6 flex items-center justify-between">
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
                                        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Completed</span>
                                    )}
                                </div>
                            </div>

                            {activeLesson.type === 'video' && activeLesson.video_url && (
                                <div className="mb-6 aspect-video rounded-lg overflow-hidden border border-border">
                                    <iframe
                                        src={activeLesson.video_url}
                                        className="h-full w-full"
                                        allowFullScreen
                                    />
                                </div>
                            )}

                            {activeLesson.type === 'audio' && activeLesson.video_url && (
                                <div className="mb-6">
                                    <audio controls className="w-full">
                                        <source src={activeLesson.video_url} />
                                    </audio>
                                </div>
                            )}

                            {activeLesson.content && (
                                <div className="prose prose-slate max-w-none text-foreground">
                                    {activeLesson.content}
                                </div>
                            )}

                            {activeLesson.attachments.length > 0 && (
                                <div className="mt-6 rounded-lg border border-border p-4">
                                    <h3 className="mb-2 text-sm font-medium text-foreground">Attachments</h3>
                                    <ul className="space-y-2">
                                        {activeLesson.attachments.map((att) => (
                                            <li key={att.id}>
                                                <a href={`/storage/${att.path}`} className="text-sm text-accent hover:text-accent/80">
                                                    {att.filename}
                                                </a>
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    ({(att.size_bytes / 1024).toFixed(1)} KB)
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-muted-foreground">Select a lesson to begin</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
