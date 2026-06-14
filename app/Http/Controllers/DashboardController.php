<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonCompletion;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = request()->user();

        $data = [
            'stats' => [],
            'recentEnrollments' => [],
            'recentCompletions' => [],
        ];

        if ($user->can('create/edit own courses') || $user->can('edit/delete any course')) {
            $courseIds = Course::whereHas('instructors', fn ($q) => $q->where('user_id', $user->id))->pluck('id');

            $data['stats'] = [
                'totalCourses' => $courseIds->count(),
                'totalEnrollments' => Enrollment::whereIn('course_id', $courseIds)->count(),
                'totalAssessments' => DB::table('assessments')->whereIn('course_id', $courseIds)->count(),
                'totalCompletions' => LessonCompletion::whereIn(
                    'lesson_id',
                    DB::table('lessons')->whereIn('module_id', function ($q) use ($courseIds) {
                        $q->select('id')->from('course_modules')->whereIn('course_id', $courseIds);
                    })->pluck('id')
                )->count(),
            ];

            $data['recentEnrollments'] = Enrollment::whereIn('course_id', $courseIds)
                ->with(['user', 'course'])
                ->latest()
                ->take(10)
                ->get();

            $data['courses'] = Course::whereIn('id', $courseIds)
                ->withCount('enrollments')
                ->withAvg('reviews as average_rating', 'rating')
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'title' => $c->title,
                    'status' => $c->status,
                    'slug' => $c->slug,
                    'enrollments_count' => $c->enrollments_count,
                    'average_rating' => round($c->average_rating ?? 0, 1),
                    'updated_at' => $c->updated_at,
                ]);
        }

        if ($user->can('take/submit assessments')) {
            $data['stats'] = [
                'enrolledCourses' => Enrollment::where('user_id', $user->id)->count(),
                'completedLessons' => LessonCompletion::where('user_id', $user->id)->count(),
            ];

            $enrolled = Enrollment::where('user_id', $user->id)
                ->with(['course.modules.lessons.lessonCompletions' => function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                }])
                ->latest('enrolled_at')
                ->take(6)
                ->get();

            $data['enrolledCourses'] = $enrolled->map(fn ($e) => [
                'id' => $e->id,
                'status' => $e->status,
                'enrolled_at' => $e->enrolled_at,
                'completed_at' => $e->completed_at,
                'course' => [
                    'id' => $e->course->id,
                    'title' => $e->course->title,
                    'slug' => $e->course->slug,
                    'thumbnail' => $e->course->thumbnail,
                    'difficulty' => $e->course->difficulty,
                ],
                'progress' => (function () use ($e) {
                    $lessons = $e->course->modules->flatMap(fn ($m) => $m->lessons);
                    $total = $lessons->count();
                    $completed = $lessons->filter(fn ($l) => $l->lessonCompletions->isNotEmpty())->count();

                    return $total > 0 ? round(($completed / $total) * 100) : 0;
                })(),
            ]);

            $data['recentCompletions'] = LessonCompletion::where('user_id', $user->id)
                ->with(['lesson.module.course'])
                ->latest()
                ->take(10)
                ->get();

            // Course recommendations based on enrolled category overlap
            $enrolledCourseIds = $enrolled->pluck('course_id');
            $categoryIds = Course::whereIn('id', $enrolledCourseIds)
                ->whereNotNull('category_id')
                ->pluck('category_id')
                ->unique();

            $recommended = Course::with('category')
                ->whereNotIn('id', $enrolledCourseIds)
                ->where('status', 'published')
                ->where(function ($q) use ($categoryIds) {
                    if ($categoryIds->isNotEmpty()) {
                        $q->whereIn('category_id', $categoryIds);
                    }
                })
                ->withCount('enrollments')
                ->orderByDesc('enrollments_count')
                ->take(6)
                ->get();

            // Fallback: popular courses if no category overlap
            if ($recommended->isEmpty()) {
                $recommended = Course::with('category')
                    ->whereNotIn('id', $enrolledCourseIds)
                    ->where('status', 'published')
                    ->withCount('enrollments')
                    ->orderByDesc('enrollments_count')
                    ->take(6)
                    ->get();
            }

            $data['recommendedCourses'] = $recommended->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'slug' => $c->slug,
                'thumbnail' => $c->thumbnail,
                'difficulty' => $c->difficulty,
                'description' => $c->description,
                'category' => $c->category?->name,
                'enrollments_count' => $c->enrollments_count,
            ]);
        }

        return Inertia::render('Dashboard', $data);
    }
}
