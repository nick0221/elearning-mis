<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Notifications\CourseCompleted;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $user = $request->user();

        if ($course->enrollments()->where('user_id', $user->id)->exists()) {
            return back()->with('error', 'Already enrolled in this course.');
        }

        if ($course->max_students && $course->enrollments()->count() >= $course->max_students) {
            return back()->with('error', 'Course is full.');
        }

        $enrollment = $course->enrollments()->create([
            'user_id' => $user->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'course_enrolled',
            'subject_type' => Course::class,
            'subject_id' => $course->id,
            'properties' => ['course_title' => $course->title],
        ]);

        return back()->with('success', 'Enrolled successfully!');
    }

    public function destroy(Request $request, Course $course)
    {
        $course->enrollments()->where('user_id', $request->user()->id)->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'course_unenrolled',
            'subject_type' => Course::class,
            'subject_id' => $course->id,
            'properties' => ['course_title' => $course->title],
        ]);

        return back()->with('success', 'Unenrolled successfully.');
    }

    public function myCourses(Request $request)
    {
        $query = Enrollment::where('user_id', $request->user()->id)
            ->with(['course.category', 'course.modules.lessons.lessonCompletions' => function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            }]);

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Category filter
        if ($request->filled('category')) {
            $query->whereHas('course.category', fn ($q) => $q->where('name', $request->category));
        }

        // Search by course title
        if ($request->filled('search')) {
            $query->whereHas('course', fn ($q) => $q->where('title', 'like', '%'.$request->search.'%'));
        }

        // Sort
        $sort = $request->input('sort', 'recent');
        match ($sort) {
            'title' => $query->orderBy(Course::select('title')->whereColumn('id', 'enrollments.course_id')),
            'oldest' => $query->oldest('enrolled_at'),
            default => $query->latest('enrolled_at'),
        };

        $enrollments = $query->paginate(12)->withQueryString();

        // Attach server-calculated progress to each enrollment
        $enrollments->getCollection()->transform(function ($enrollment) {
            $lessons = $enrollment->course->modules->flatMap(fn ($m) => $m->lessons);
            $total = $lessons->count();
            $enrollment->progress = $total > 0
                ? round(($lessons->filter(fn ($l) => $l->lessonCompletions->isNotEmpty())->count() / $total) * 100)
                : 0;

            return $enrollment;
        });

        $categories = Category::whereHas('courses.enrollments', fn ($q) => $q->where('user_id', $request->user()->id))
            ->pluck('name');

        return Inertia::render('Courses/MyCourses', [
            'enrollments' => $enrollments,
            'filters' => $request->only(['search', 'status', 'sort', 'category']),
            'categories' => $categories,
        ]);
    }

    public function learn(Course $course)
    {
        $user = request()->user();
        $enrollment = $course->enrollments()->where('user_id', $user->id)->first();

        if (! $enrollment) {
            return redirect()->route('courses.show', $course)
                ->with('error', 'You must enroll in this course first.');
        }

        // Load course with lessons and their completions for current user only
        $course->load(['modules.lessons.attachments']);

        // Load completions separately to ensure proper filtering
        $lessonIds = $course->modules->flatMap(fn ($m) => $m->lessons->pluck('id'))->toArray();
        $completions = LessonCompletion::whereIn('lesson_id', $lessonIds)
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('lesson_id');

        // Attach completions to lessons
        foreach ($course->modules as $module) {
            foreach ($module->lessons as $lesson) {
                $lesson->lessonCompletions = $completions->has($lesson->id) ? [$completions->get($lesson->id)] : [];
            }
        }

        $totalLessons = $course->modules->sum(fn ($m) => $m->lessons->count());
        $completedLessons = $course->modules->sum(fn ($m) => $m->lessons->filter(fn ($l) => ! empty($l->lessonCompletions))->count());
        $progress = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

        // Check if course is completed
        if ($progress === 100 && $enrollment->status !== 'completed') {
            $enrollment->update(['status' => 'completed', 'completed_at' => now()]);

            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'course_completed',
                'subject_type' => Course::class,
                'subject_id' => $course->id,
                'properties' => ['course_title' => $course->title],
            ]);

            $user->notify(new CourseCompleted($course));
        }

        return Inertia::render('Courses/Learn', [
            'course' => $course,
            'enrollment' => $enrollment,
            'progress' => $progress,
        ]);
    }

    public function completeLesson(Request $request, Lesson $lesson)
    {
        $user = $request->user();

        LessonCompletion::firstOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['completed_at' => now()]
        );

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'lesson_completed',
            'subject_type' => Lesson::class,
            'subject_id' => $lesson->id,
            'properties' => ['lesson_title' => $lesson->title],
        ]);

        $course = Course::with(['modules.lessons.lessonCompletions' => function ($q) use ($user) {
            $q->where('user_id', $user->id);
        }])->find($lesson->module->course_id);

        $enrollment = Enrollment::where('user_id', $user->id)->where('course_id', $course->id)->first();

        if ($enrollment && $enrollment->status !== 'completed') {
            $allLessons = $course->modules->flatMap(fn ($m) => $m->lessons);
            $total = $allLessons->count();
            $completed = $allLessons->filter(fn ($l) => $l->lessonCompletions->isNotEmpty())->count();

            if ($total > 0 && $completed >= $total) {
                $enrollment->update(['status' => 'completed', 'completed_at' => now()]);

                ActivityLog::create([
                    'user_id' => $user->id,
                    'action' => 'course_completed',
                    'subject_type' => Course::class,
                    'subject_id' => $course->id,
                    'properties' => ['course_title' => $course->title],
                ]);

                $user->notify(new CourseCompleted($course));
            }
        }

        return redirect()->route('courses.learn', $course)->with('success', 'Lesson marked as complete!');
    }
}
