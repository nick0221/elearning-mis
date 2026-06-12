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

            $data['recentCompletions'] = LessonCompletion::where('user_id', $user->id)
                ->with(['lesson.module.course'])
                ->latest()
                ->take(10)
                ->get();
        }

        return Inertia::render('Dashboard', $data);
    }
}
