<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $courseIds = Course::whereHas('instructors', fn ($q) => $q->where('user_id', $user->id))
            ->pluck('id');

        $courses = Course::whereIn('id', $courseIds)
            ->withCount([
                'enrollments',
                'enrollments as completed_enrollments_count' => fn ($q) => $q->where('status', 'completed'),
                'reviews as average_rating' => fn ($q) => $q->selectRaw('COALESCE(AVG(rating), 0)'),
            ])
            ->get();

        $totalEnrollments = Enrollment::whereIn('course_id', $courseIds)->count();
        $completedEnrollments = Enrollment::whereIn('course_id', $courseIds)->where('status', 'completed')->count();
        $totalAssessments = Assessment::whereIn('course_id', $courseIds)->count();
        $totalSubmissions = Submission::whereIn('assessment_id', Assessment::whereIn('course_id', $courseIds)->pluck('id'))->count();

        $completionRate = $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100) : 0;

        $recentSubmissions = Submission::whereIn('assessment_id', Assessment::whereIn('course_id', $courseIds)->pluck('id'))
            ->with(['user', 'assessment.course'])
            ->latest()
            ->take(10)
            ->get();

        $monthlyEnrollments = Enrollment::whereIn('course_id', $courseIds)
            ->selectRaw("strftime('%Y-%m', enrolled_at) as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        return Inertia::render('Instructor/Dashboard', [
            'stats' => [
                'totalCourses' => $courses->count(),
                'totalEnrollments' => $totalEnrollments,
                'completedEnrollments' => $completedEnrollments,
                'completionRate' => $completionRate,
                'totalAssessments' => $totalAssessments,
                'totalSubmissions' => $totalSubmissions,
            ],
            'courses' => $courses,
            'recentSubmissions' => $recentSubmissions,
            'monthlyEnrollments' => $monthlyEnrollments,
        ]);
    }
}
