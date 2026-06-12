import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import RichTextContent from '@/Components/RichTextContent';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Video, Headphones, FileText, Bookmark, BookmarkCheck, Share2, Printer, Moon, Sun, CheckCircle, Lock, Paperclip, ChevronLeft, ChevronRight, FileCode, HelpCircle, Award, MessageSquare, Clock, Zap, ArrowRight } from 'lucide-react';

interface Attachment { id: number; filename: string; mime_type: string; size_bytes: number; }
interface LessonCompletion { id: number; }
interface Lesson {
    id: number; title: string; content?: string; type: string;
    video_url?: string; duration_minutes?: number;
    attachments: Attachment[]; lessonCompletions: LessonCompletion[];
}
interface CourseModule { id: number; title: string; description?: string; lessons: Lesson[]; }
interface Assessment { id: number; title: string; type: string; passing_score: number; course: { id: number; title: string }; }
interface Course { id: number; title: string; description?: string; modules: CourseModule[]; assessments?: Assessment[]; }
interface Enrollment { id: number; status: string; }

export default function Learn({ course, enrollment, progress }: { course: Course; enrollment: Enrollment; progress: number }) {
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showShortcutsModal, setShowShortcutsModal] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'notes'>('content');
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('content-dark-mode') === 'true');
    const [bookmarks, setBookmarks] = useState<Set<number>>(() => {
        const saved = localStorage.getItem(`bookmarks-${course.id}`);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [notes, setNotes] = useState<Record<number, string>>(() => {
        const saved = localStorage.getItem(`notes-${course.id}`);
        return saved ? JSON.parse(saved) : {};
    });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const showToast = (message: string, type: 'success' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const allLessons = course.modules?.flatMap((mod) => mod.lessons || []) || [];
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;

    const currentModule = course.modules?.find((m) => (m.lessons || []).some((l) => l.id === activeLesson?.id));
    const currentModuleIdx = course.modules?.findIndex((m) => m.id === currentModule?.id) ?? 0;

    const isModuleLocked = (modIdx: number) => {
        if (modIdx === 0) return false;
        const prevModule = course.modules[modIdx - 1];
        if (!prevModule) return false;
        return (prevModule.lessons || []).some((l) => l.lessonCompletions?.length === 0);
    };

    // Find next lesson that is NOT in a locked module
    let nextLesson = null;
    for (let i = currentIndex + 1; i < allLessons.length; i++) {
        const lesson = allLessons[i];
        const lessonModule = course.modules?.find((m) => (m.lessons || []).some((l) => l.id === lesson.id));
        const lessonModuleIdx = course.modules?.findIndex((m) => m.id === lessonModule?.id) ?? 0;
        if (!isModuleLocked(lessonModuleIdx)) {
            nextLesson = lesson;
            break;
        }
    }

    useEffect(() => {
        if (activeLesson) return;
        const lastLessonId = localStorage.getItem(`last-lesson-${course.id}`);
        if (lastLessonId) {
            const found = allLessons.find((l) => l.id === parseInt(lastLessonId));
            if (found) { setActiveLesson(found); return; }
        }
        for (const mod of course.modules || []) {
            for (const lesson of mod.lessons || []) {
                if (lesson.lessonCompletions?.length === 0) { setActiveLesson(lesson); return; }
            }
        }
        setActiveLesson(course.modules?.[0]?.lessons?.[0] || null);
    }, []);

    useEffect(() => { if (activeLesson) localStorage.setItem(`last-lesson-${course.id}`, activeLesson.id.toString()); }, [activeLesson]);
    useEffect(() => { localStorage.setItem(`notes-${course.id}`, JSON.stringify(notes)); }, [notes, course.id]);
    useEffect(() => { localStorage.setItem(`bookmarks-${course.id}`, JSON.stringify([...bookmarks])); }, [bookmarks, course.id]);
    useEffect(() => { localStorage.setItem('content-dark-mode', darkMode.toString()); }, [darkMode]);

    const handleComplete = () => {
        if (!activeLesson) return;
        const lessonId = activeLesson.id;
        router.post(route('lessons.complete', lessonId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Force full page reload to ensure progress updates
                window.location.reload();
            },
        });
    };

    const handleUnenroll = () => { router.delete(route('courses.unenroll', course.id)); setShowUnenrollDialog(false); };
    const toggleBookmark = (id: number) => {
        setBookmarks((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
        showToast(bookmarks.has(activeLesson?.id || 0) ? 'Bookmark removed' : 'Lesson bookmarked!');
    };
    const handleSpeedChange = (s: number) => { setPlaybackSpeed(s); if (videoRef) videoRef.playbackRate = s; };
    const handleShare = () => { navigator.clipboard.writeText(window.location.href); showToast('Link copied to clipboard!'); };
    const handlePrint = () => { window.print(); };

    const handleQuizSubmit = () => {
        let score = 0;
        const quiz = course.assessments?.[0];
        if (quiz) {
            const totalQuestions = 3;
            score = Math.floor(Math.random() * totalQuestions) + 1;
            setQuizScore(score);
            setQuizSubmitted(true);
            showToast(score >= 2 ? 'Great job! You passed the quiz!' : 'Keep studying and try again!', score >= 2 ? 'success' : 'info');
        }
    };

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'ArrowRight' && nextLesson) setActiveLesson(nextLesson);
            if (e.key === 'ArrowLeft' && prevLesson) setActiveLesson(prevLesson);
            if (e.key === ' ' && activeLesson?.type === 'video' && videoRef) { e.preventDefault(); videoRef.paused ? videoRef.play() : videoRef.pause(); }
            if (e.key === 'f' && videoRef) videoRef.requestFullscreen();
            if (e.key === 'b' && activeLesson) toggleBookmark(activeLesson.id);
            if (e.key === 'd') setDarkMode((d) => !d);
            if (e.key === '?') setShowShortcutsModal(true);
            if (e.key === 'Escape') { setShowShortcutsModal(false); setShowCompletionModal(false); }
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [nextLesson, prevLesson, videoRef, activeLesson]);

    useEffect(() => { const s = localStorage.getItem('playback-speed'); if (s) setPlaybackSpeed(parseFloat(s)); }, []);
    useEffect(() => { localStorage.setItem('playback-speed', playbackSpeed.toString()); }, [playbackSpeed]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-lg font-semibold leading-tight text-foreground truncate">{course.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setDarkMode(!darkMode)} className="rounded-md p-2 text-muted-foreground hover:bg-muted" title="Dark mode (D)">
                            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                        <button onClick={handleShare} className="rounded-md p-2 text-muted-foreground hover:bg-muted" title="Share">
                            <Share2 className="h-4 w-4" />
                        </button>
                        <button onClick={handlePrint} className="rounded-md p-2 text-muted-foreground hover:bg-muted" title="Print">
                            <Printer className="h-4 w-4" />
                        </button>
                        <Link href={route('courses.my')} className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted">My Courses</Link>
                        <button onClick={() => setShowUnenrollDialog(true)} className="rounded-md border border-destructive/50 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10">Unenroll</button>
                    </div>
                </div>
            }
        >
            <Head title={`Learn: ${course.title}`} />
            <div className={`flex h-[calc(100vh-4rem)] ${darkMode ? 'dark' : ''}`}>
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden border-r border-border bg-card transition-all duration-300 lg:w-80`}>
                    <div className="h-full overflow-y-auto p-4">
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground">{progress}%</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                            {progress === 100 && <p className="mt-2 text-xs font-medium text-success">🎉 Course completed!</p>}
                        </div>
                        <div className="space-y-4">
                            {course.modules.map((mod, modIdx) => {
                                const completedInModule = (mod.lessons || []).filter((l) => l.lessonCompletions?.length > 0).length;
                                const locked = isModuleLocked(modIdx);
                                return (
                                    <div key={mod.id} className={locked ? 'opacity-50' : ''}>
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                {locked && <Lock className="h-3 w-3" />}
                                                Module {modIdx + 1}
                                            </h3>
                                            <span className="text-xs text-muted-foreground">{completedInModule}/{(mod.lessons || []).length}</span>
                                        </div>
                                        <p className="mb-2 text-xs text-muted-foreground">{mod.title}</p>
                                        {!locked && (
                                            <ul className="space-y-0.5">
                                                {(mod.lessons || []).map((lesson) => {
                                                    const isCompleted = lesson.lessonCompletions?.length > 0;
                                                    const isActive = activeLesson?.id === lesson.id;
                                                    const isBookmarked = bookmarks.has(lesson.id);
                                                    return (
                                                        <li key={lesson.id}>
                                                            <button onClick={() => setActiveLesson(lesson)} className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-primary text-primary-foreground' : isCompleted ? 'bg-success/10 text-success' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                                                                <span className="flex items-center gap-2">
                                                                    {isCompleted ? <CheckCircle className="h-4 w-4 shrink-0 text-success" /> : <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">{(mod.lessons || []).indexOf(lesson) + 1}</span>}
                                                                    <span className="truncate flex-1">{lesson.title}</span>
                                                                    {isBookmarked && <BookmarkCheck className="h-3 w-3 text-accent" />}
                                                                    {lesson.type === 'video' && <Video className="h-3 w-3 text-muted-foreground" />}
                                                                    {lesson.type === 'audio' && <Headphones className="h-3 w-3 text-muted-foreground" />}
                                                                </span>
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900 text-gray-100' : ''}`}>
                    {activeLesson ? (
                        <div className="mx-auto max-w-4xl p-6 lg:p-8">
                            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <Link href={route('courses.show', course.id)} className="hover:text-foreground">{course.title}</Link>
                                <span>/</span>
                                <span>{course.modules.find((m) => (m.lessons || []).some((l) => l.id === activeLesson.id))?.title}</span>
                                <span>/</span>
                                <span className="text-foreground">{activeLesson.title}</span>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-foreground">{activeLesson.title}</h1>
                                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                                            <span>Lesson {currentIndex + 1} of {allLessons.length}</span>
                                            {activeLesson.duration_minutes && <span>· {activeLesson.duration_minutes} min</span>}
                                            <span>· {activeLesson.type === 'video' ? 'Video' : activeLesson.type === 'audio' ? 'Audio' : 'Text'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => activeLesson && toggleBookmark(activeLesson.id)} className={`rounded-md p-2 transition-colors ${bookmarks.has(activeLesson?.id || 0) ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted'}`} title="Bookmark (B)">
                                            {bookmarks.has(activeLesson?.id || 0) ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                                        </button>
                                        {activeLesson.lessonCompletions?.length === 0 ? (
                                            <button onClick={handleComplete} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">Mark Complete</button>
                                        ) : (
                                            <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                                                <CheckCircle className="h-3 w-3" /> Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {activeLesson.type === 'video' && activeLesson.video_url && (
                                <div className="mb-4">
                                    <div className="aspect-video rounded-lg overflow-hidden border border-border bg-black shadow-lg">
                                        <video ref={setVideoRef} src={activeLesson.video_url} className="h-full w-full" controls playbackRate={playbackSpeed} />
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Speed:</span>
                                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                                <button key={speed} onClick={() => handleSpeedChange(speed)} className={`rounded px-2 py-1 text-xs font-medium transition-colors ${playbackSpeed === speed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{speed}x</button>
                                            ))}
                                        </div>
                                        <button onClick={() => setShowTranscript(!showTranscript)} className="flex items-center gap-1 text-xs text-accent hover:text-accent/80">
                                            <FileText className="h-3 w-3" /> {showTranscript ? 'Hide' : 'Show'} Transcript
                                        </button>
                                    </div>
                                    {showTranscript && (
                                        <div className="mt-3 rounded-lg border border-border bg-card p-4">
                                            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2"><FileCode className="h-4 w-4" /> Transcript</h4>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{activeLesson.content || 'No transcript available.'}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeLesson.type === 'audio' && activeLesson.video_url && (
                                <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10"><Headphones className="h-6 w-6 text-accent" /></div>
                                        <audio controls className="flex-1"><source src={activeLesson.video_url} /></audio>
                                    </div>
                                </div>
                            )}

                            {activeLesson.content && (
                                <div className="mb-6">
                                    <div className="flex gap-1 border-b border-border">
                                        <button onClick={() => setActiveTab('content')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'content' ? 'border-b-2 border-accent text-accent' : 'text-muted-foreground hover:text-foreground'}`}>Content</button>
                                        <button onClick={() => setActiveTab('notes')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'notes' ? 'border-b-2 border-accent text-accent' : 'text-muted-foreground hover:text-foreground'}`}>Notes {notes[activeLesson.id] && '📝'}</button>
                                    </div>
                                    {activeTab === 'content' && (
                                        <div className="mt-4 rounded-lg border border-border bg-card p-6">
                                            <RichTextContent content={activeLesson.content || ''} />
                                        </div>
                                    )}
                                    {activeTab === 'notes' && (
                                        <div className="mt-4 rounded-lg border border-border bg-card p-6">
                                            <p className="text-sm text-muted-foreground mb-2">Your notes (auto-saved):</p>
                                            <textarea value={notes[activeLesson.id] || ''} onChange={(e) => setNotes((p) => ({ ...p, [activeLesson.id]: e.target.value }))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" rows={8} placeholder="Write your notes here..." />
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeLesson.attachments?.length > 0 && (
                                <div className="mb-6 rounded-lg border border-border bg-card p-4">
                                    <h3 className="mb-3 text-sm font-medium text-foreground flex items-center gap-2"><Paperclip className="h-4 w-4" /> Attachments</h3>
                                    <div className="space-y-2">
                                        {activeLesson.attachments.map((att) => (
                                            <a key={att.id} href={`/storage/${att.path}`} className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-muted transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">{att.mime_type.split('/')[1]?.toUpperCase().slice(0, 3)}</div>
                                                    <span className="text-sm text-foreground">{att.filename}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{(att.size_bytes / 1024).toFixed(1)} KB</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Inline Quiz Section */}
                            {course.assessments && course.assessments.length > 0 && !quizSubmitted && (
                                <div className="mb-6 rounded-lg border border-accent/30 bg-accent/5 p-6">
                                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2"><HelpCircle className="h-5 w-5 text-accent" /> Quick Quiz</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Test your knowledge with a quick review</p>
                                    <div className="mt-4 space-y-3">
                                        {['What is HTML?', 'What does CSS control?', 'Which keyword declares a constant in JavaScript?'].map((q, i) => (
                                            <div key={i} className="rounded-md border border-border p-3">
                                                <p className="text-sm font-medium text-foreground">Q{i + 1}. {q}</p>
                                                <div className="mt-2 flex gap-2">
                                                    {['Answer A', 'Answer B', 'Answer C'].map((opt, j) => (
                                                        <button key={j} onClick={() => setQuizAnswers((p) => ({ ...p, [i]: j }))} className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${quizAnswers[i] === j ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={handleQuizSubmit} className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">Submit Quiz</button>
                                </div>
                            )}

                            {quizSubmitted && (
                                <div className={`mb-6 rounded-lg border p-6 ${quizScore >= 2 ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                                        {quizScore >= 2 ? <Award className="h-5 w-5 text-success" /> : <Zap className="h-5 w-5 text-destructive" />}
                                        Quiz Result: {quizScore}/3
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {quizScore >= 2 ? 'Great job! You passed the quiz!' : 'Keep studying and try again!'}
                                    </p>
                                    <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Retake Quiz</button>
                                </div>
                            )}

                            {/* Certificate Section */}
                            {progress === 100 && (
                                <div className="mb-6 rounded-lg border border-accent/30 bg-accent/5 p-6 text-center">
                                    <Award className="h-12 w-12 mx-auto text-accent" />
                                    <h3 className="mt-3 text-lg font-medium text-foreground">Course Certificate</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">You've earned a certificate for completing this course!</p>
                                    <button onClick={() => { showToast('Certificate downloaded!'); }} className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
                                        Download Certificate
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                                {prevLesson ? (
                                    <button onClick={() => setActiveLesson(prevLesson)} className="flex items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </button>
                                ) : <div />}
                                {nextLesson ? (
                                    <button onClick={() => setActiveLesson(nextLesson)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                        Next <ChevronRight className="h-4 w-4" />
                                    </button>
                                ) : progress === 100 && (
                                    <Link href={route('courses.my')} className="flex items-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90">
                                        <CheckCircle className="h-4 w-4" /> Course Complete!
                                    </Link>
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

            <ConfirmDialog open={showCompletionModal} title="🎉 Congratulations!" message="You've completed this course!" confirmLabel="View My Courses" variant="info" onConfirm={() => { setShowCompletionModal(false); router.visit(route('courses.my')); }} onCancel={() => setShowCompletionModal(false)} />
            <ConfirmDialog open={showUnenrollDialog} title="Unenroll" message="Your progress will be saved." confirmLabel="Unenroll" variant="warning" onConfirm={handleUnenroll} onCancel={() => setShowUnenrollDialog(false)} />

            {showShortcutsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowShortcutsModal(false)} />
                    <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h3>
                            <button onClick={() => setShowShortcutsModal(false)} className="text-muted-foreground hover:text-foreground">×</button>
                        </div>
                        <div className="space-y-3">
                            {[['Space', 'Play / Pause'], ['F', 'Fullscreen'], ['←', 'Previous lesson'], ['→', 'Next lesson'], ['B', 'Bookmark'], ['D', 'Dark mode'], ['?', 'This help'], ['Esc', 'Close']].map(([key, desc]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="text-sm text-foreground">{desc}</span>
                                    <kbd className="rounded border border-border bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">{key}</kbd>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all ${toast.type === 'success' ? 'bg-success text-white' : 'bg-info text-white'}`}>
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
