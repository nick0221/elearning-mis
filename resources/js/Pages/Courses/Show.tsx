import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
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
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">{course.title}</h2>}
        >
            <Head title={course.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Course Header Card */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold capitalize ${statusColors[course.status]}`}>{course.status}</span>
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold capitalize ${difficultyColors[course.difficulty]}`}>{course.difficulty}</span>
                                    {course.category && (
                                        <span className="inline-flex rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">{course.category.name}</span>
                                    )}
                                </div>
                                {canEdit && (
                                    <div className="flex gap-2">
                                        <Link href={route('courses.edit', course.id)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                            Edit
                                        </Link>
                                        {canEditAnyCourse() && (
                                            <button onClick={() => setShowDeleteDialog(true)} className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {course.description && (
                                <p className="mb-6 text-muted-foreground">{course.description}</p>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <div className="text-2xl font-bold text-foreground">{course.modules.length}</div>
                                    <div className="text-xs text-muted-foreground">Modules</div>
                                </div>
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <div className="text-2xl font-bold text-foreground">{totalLessons}</div>
                                    <div className="text-xs text-muted-foreground">Lessons</div>
                                </div>
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <div className="text-2xl font-bold text-foreground">{enrollmentCount}</div>
                                    <div className="text-xs text-muted-foreground">Enrolled</div>
                                </div>
                                <div className="rounded-lg border border-border p-3 text-center">
                                    <div className="text-2xl font-bold text-foreground">{course.estimated_duration_minutes ? `${Math.round(course.estimated_duration_minutes / 60)}h` : '-'}</div>
                                    <div className="text-xs text-muted-foreground">Duration</div>
                                </div>
                            </div>

                            {/* Enroll / Continue Button */}
                            {!canEdit && course.status === 'published' && (
                                <div className="mt-6 flex gap-3">
                                    {isEnrolled ? (
                                        <Link
                                            href={route('courses.learn', course.id)}
                                            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                                        >
                                            Continue Learning →
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => router.post(route('courses.enroll', course.id))}
                                            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                                        >
                                            Enroll in this Course
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modules Card */}
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-foreground">Modules & Lessons</h3>
                            {course.modules.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                                    <p className="text-sm text-muted-foreground">No modules yet.</p>
                                    <Link href={route('courses.edit', course.id)} className="mt-2 inline-block text-sm text-accent hover:text-accent/80">
                                        Add modules →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {course.modules.map((mod, idx) => (
                                        <div key={mod.id} className="rounded-lg border border-border">
                                            <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
                                                <div>
                                                    <span className="text-sm font-medium text-foreground">Module {idx + 1}</span>
                                                    <span className="mx-2 text-muted-foreground">·</span>
                                                    <span className="text-sm text-foreground">{mod.title}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{mod.lessons.length} lessons</span>
                                            </div>
                                            {mod.lessons.length > 0 && (
                                                <ul className="divide-y divide-border">
                                                    {mod.lessons.map((lesson) => (
                                                        <li key={lesson.id} className="flex items-center justify-between px-4 py-2">
                                                            <span className="text-sm text-foreground">{lesson.title}</span>
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
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-foreground">Reviews & Ratings</h3>
                                {user && !userReview && (
                                    <button
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                                    >
                                        {showReviewForm ? 'Cancel' : 'Write a Review'}
                                    </button>
                                )}
                            </div>

                            {/* Average Rating */}
                            <div className="mb-6 flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-foreground">{averageRating ? averageRating.toFixed(1) : '—'}</div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} className={`h-4 w-4 ${star <= Math.round(averageRating ?? 0) ? 'text-yellow-500' : 'text-muted-foreground/30'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {ratingsCount ?? 0} review{ratingsCount !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {/* Review Form */}
                            {user && showReviewForm && (
                                <div className="mb-6 rounded-lg border border-border p-4">
                                    <h4 className="mb-3 text-sm font-medium text-foreground">{userReview ? 'Edit Your Review' : 'Write a Review'}</h4>
                                    <div className="mb-3 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                                                className="transition-colors hover:scale-110"
                                            >
                                                <svg className={`h-6 w-6 ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-muted-foreground/30'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={reviewForm.body}
                                        onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                                        rows={3}
                                        placeholder="Share your thoughts about this course..."
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    <div className="mt-3 flex justify-end gap-2">
                                        {userReview && (
                                            <button
                                                onClick={() => setDeleteReviewId(userReview.id)}
                                                className="rounded-md border border-destructive/30 bg-background px-4 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                                            >
                                                Delete
                                            </button>
                                        )}
                                        <button
                                            onClick={submitReview}
                                            disabled={submitting}
                                            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : userReview ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Reviews List */}
                            {course.reviews.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No reviews yet.</p>
                            ) : (
                                <div className="space-y-4 divide-y divide-border">
                                    {course.reviews.map((review) => (
                                        <div key={review.id} className="pt-4 first:pt-0">
                                            <div className="mb-1 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                                                        {review.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-foreground">{review.user.name}</span>
                                                        <span className="ml-2 text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? 'text-yellow-500' : 'text-muted-foreground/30'}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            {review.body && (
                                                <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
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
