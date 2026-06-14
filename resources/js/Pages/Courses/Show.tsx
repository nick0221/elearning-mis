import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Textarea } from '@/Components/ui/textarea';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface Instructor {
    id: number;
    name: string;
}

interface Lesson {
    id: number;
    title: string;
    type: string;
    duration_minutes?: number;
}

interface CourseModule {
    id: number;
    title: string;
    description?: string;
    lessons: Lesson[];
}

interface Category {
    id: number;
    name: string;
}

interface ReviewUser {
    id: number;
    name: string;
    avatar?: string;
}

interface Review {
    id: number;
    rating: number;
    body?: string;
    user: ReviewUser;
    created_at: string;
}

interface Course {
    id: number;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    difficulty: string;
    status: string;
    max_students?: number;
    estimated_duration_minutes?: number;
    category?: Category;
    modules: CourseModule[];
    reviews: Review[];
    instructors?: Instructor[];
    created_at: string;
}

function StarIcon({ className = 'h-4 w-4' }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

function ModuleIcon() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    );
}

function LessonIcon() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function VideoIcon() {
    return (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    );
}

function QuizIcon() {
    return (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

const lessonTypeIcons: Record<string, React.ReactNode> = {
    video: <VideoIcon />,
    file: <FileIcon />,
    quiz: <QuizIcon />,
};

const lessonTypeColors: Record<string, string> = {
    video: 'text-info',
    file: 'text-warning',
    quiz: 'text-destructive',
};

export default function Show({
    course, enrollmentCount, isEnrolled,
    userReview, averageRating, ratingsCount,
}: {
    course: Course;
    enrollmentCount: number;
    isEnrolled: boolean;
    userReview?: Review | null;
    averageRating?: number;
    ratingsCount?: number;
}) {
    const { user, canCreateCourses, canEditAnyCourse, canTakeAssessments } = usePermission();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(!userReview);
    const [reviewForm, setReviewForm] = useState({ rating: userReview?.rating ?? 5, body: userReview?.body ?? '' });
    const [submitting, setSubmitting] = useState(false);
    const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);

    const submitReview = () => {
        setSubmitting(true);
        router.post(route('courses.reviews.store', course.id), {
            rating: reviewForm.rating,
            body: reviewForm.body,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowReviewForm(false);
                setSubmitting(false);
            },
            onError: () => setSubmitting(false),
        });
    };

    const handleDeleteReview = () => {
        if (!deleteReviewId) return;
        router.delete(route('courses.reviews.destroy', course.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setDeleteReviewId(null),
        });
    };
    const canEdit = canEditAnyCourse() || course.instructors?.some((i) => i.id === usePermission().user?.id);

    const handleDelete = () => {
        router.delete(route('courses.destroy', course.id));
        setShowDeleteDialog(false);
    };

    const statusColors: Record<string, string> = {
        draft: 'bg-muted text-muted-foreground',
        published: 'bg-success/10 text-success',
        archived: 'bg-warning/10 text-warning',
    };

    const difficultyColors: Record<string, string> = {
        beginner: 'bg-success/10 text-success',
        intermediate: 'bg-info/10 text-info',
        advanced: 'bg-destructive/10 text-destructive',
    };

    const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

    return (
        <AuthenticatedLayout
        >
            <Head title={course.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-accent/5 to-info/5 shadow-sm">
                        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
                        <div className="relative p-6 sm:p-8">
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[course.status]}`}>{course.status}</span>
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${difficultyColors[course.difficulty]}`}>{course.difficulty}</span>
                                    {course.category && (
                                        <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">{course.category.name}</span>
                                    )}
                                </div>
                                {canEdit && (
                                    <div className="flex gap-2">
                                        <Link href={route('courses.edit', course.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                            Edit
                                        </Link>
                                        {canEditAnyCourse() && (
                                            <button onClick={() => setShowDeleteDialog(true)} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{course.title}</h1>

                            {course.description && (
                                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{course.description}</p>
                            )}

                            {/* Stats Grid */}
                            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                    { value: course.modules.length, label: 'Modules', icon: <ModuleIcon />, bg: 'bg-primary/10' },
                                    { value: totalLessons, label: 'Lessons', icon: <LessonIcon />, bg: 'bg-accent/10' },
                                    { value: enrollmentCount, label: 'Enrolled', icon: <UsersIcon />, bg: 'bg-info/10' },
                                    { value: course.estimated_duration_minutes ? `${Math.round(course.estimated_duration_minutes / 60)}h` : '-', label: 'Duration', icon: <ClockIcon />, bg: 'bg-warning/10' },
                                ].map((stat, i) => (
                                    <div key={i} className="group rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} text-foreground transition-transform group-hover:scale-110`}>
                                                {stat.icon}
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-foreground tabular-nums">{stat.value}</div>
                                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Enroll / Continue Button */}
                            {!canEdit && course.status === 'published' && (
                                <div className="mt-6 flex gap-3">
                                    {isEnrolled ? (
                                        <Link
                                            href={route('courses.learn', course.id)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md"
                                        >
                                            Continue Learning
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => router.post(route('courses.enroll', course.id))}
                                            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md"
                                        >
                                            Enroll in this Course
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modules Card */}
                    <div className="rounded-xl bg-card shadow-sm">
                        <div className="p-6 sm:p-8">
                            <h3 className="mb-1 text-lg font-semibold text-foreground">Modules & Lessons</h3>
                            <p className="mb-6 text-sm text-muted-foreground">{course.modules.length} modules · {totalLessons} lessons total</p>
                            {course.modules.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                                    <ModuleIcon />
                                    <p className="mt-2 text-sm text-muted-foreground">No modules yet.</p>
                                    {canEdit && (
                                        <Link href={route('courses.edit', course.id)} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                                            Add modules
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {course.modules.map((mod, idx) => (
                                        <div key={mod.id} className="overflow-hidden rounded-lg border border-border transition-all hover:border-accent/30 hover:shadow-sm">
                                            <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{idx + 1}</span>
                                                    <span className="text-sm font-medium text-foreground">{mod.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">{mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                            {mod.description && (
                                                <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">{mod.description}</p>
                                            )}
                                            {mod.lessons.length > 0 && (
                                                <ul className="divide-y divide-border border-t border-border">
                                                    {mod.lessons.map((lesson) => (
                                                        <li key={lesson.id} className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/30">
                                                            <div className="flex items-center gap-2.5">
                                                                {lesson.type && lessonTypeIcons[lesson.type] ? (
                                                                    <span className={lessonTypeColors[lesson.type] ?? 'text-muted-foreground'}>
                                                                        {lessonTypeIcons[lesson.type]}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted-foreground">
                                                                        <FileIcon />
                                                                    </span>
                                                                )}
                                                                <span className="text-sm text-foreground">{lesson.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-muted-foreground capitalize">{lesson.type}</span>
                                                                {lesson.duration_minutes && (
                                                                    <span className="text-xs text-muted-foreground">{lesson.duration_minutes}m</span>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Reviews */}
                    <div className="rounded-xl bg-card shadow-sm">
                        <div className="p-6 sm:p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Reviews & Ratings</h3>
                                    <p className="mt-0.5 text-sm text-muted-foreground">See what others are saying</p>
                                </div>
                                {user && !userReview && (
                                    <button
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                        className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        {showReviewForm ? 'Cancel' : 'Write a Review'}
                                    </button>
                                )}
                            </div>

                            {/* Average Rating */}
                            <div className="mb-6 flex items-center gap-6 rounded-lg bg-muted/50 p-5">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-foreground">{averageRating ? averageRating.toFixed(1) : '—'}</div>
                                    <div className="mt-1 flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon key={star} className={`h-4 w-4 ${star <= Math.round(averageRating ?? 0) ? 'text-yellow-500' : 'text-muted-foreground/30'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground">Course Rating</div>
                                    <div className="text-sm text-muted-foreground">
                                        {ratingsCount ?? 0} review{ratingsCount !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>

                            {/* Review Form */}
                            {user && showReviewForm && (
                                <div className="mb-6 rounded-lg border border-border bg-muted/20 p-5">
                                    <h4 className="mb-3 text-sm font-semibold text-foreground">{userReview ? 'Edit Your Review' : 'Write a Review'}</h4>
                                    <div className="mb-3 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <StarIcon className={`h-6 w-6 ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-muted-foreground/30'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <Textarea
                                        value={reviewForm.body}
                                        onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                                        rows={3}
                                        placeholder="Share your thoughts about this course..."
                                    />
                                    <div className="mt-3 flex justify-end gap-2">
                                        {userReview && (
                                            <button
                                                onClick={() => setDeleteReviewId(userReview.id)}
                                                className="rounded-lg border border-destructive/30 bg-background px-4 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                                            >
                                                Delete
                                            </button>
                                        )}
                                        <button
                                            onClick={submitReview}
                                            disabled={submitting}
                                            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : userReview ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Reviews List */}
                            {course.reviews.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                                    <StarIcon className="mx-auto h-8 w-8 text-muted-foreground/40" />
                                    <p className="mt-2 text-sm text-muted-foreground">No reviews yet.</p>
                                    <p className="text-xs text-muted-foreground/60">Be the first to share your experience.</p>
                                </div>
                            ) : (
                                <div className="space-y-5 divide-y divide-border">
                                    {course.reviews.map((review) => (
                                        <div key={review.id} className="pt-5 first:pt-0">
                                            <div className="mb-1 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                        {review.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-foreground">{review.user.name}</span>
                                                        <span className="ml-2 text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <StarIcon key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? 'text-yellow-500' : 'text-muted-foreground/30'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.body && (
                                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                title="Delete Course"
                message={`Are you sure you want to delete "${course.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />

            <ConfirmDialog
                open={deleteReviewId !== null}
                title="Delete Review"
                message="Are you sure you want to delete your review?"
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDeleteReview}
                onCancel={() => setDeleteReviewId(null)}
            />
        </AuthenticatedLayout>
    );
}
