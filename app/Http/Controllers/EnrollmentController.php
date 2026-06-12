<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
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
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->with(['course.category', 'course.modules.lessons.lessonCompletions' => function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            }])
            ->latest('enrolled_at')
            ->paginate(12);

        return Inertia::render('Courses/MyCourses', [
            'enrollments' => $enrollments,
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

        $course->load(['modules.lessons.attachments', 'modules.lessons.lessonCompletions' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }]);

        $totalLessons = $course->modules->sum(fn ($m) => $m->lessons->count());
        $completedLessons = $course->modules->sum(fn ($m) => $m->lessons->filter(fn ($l) => $l->lessonCompletions->isNotEmpty())->count());
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

        return back()->with('success', 'Lesson marked as complete.');
    }
}
