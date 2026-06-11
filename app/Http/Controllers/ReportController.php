<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Submission;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_users' => User::count(),
            'total_courses' => Course::count(),
            'total_enrollments' => Enrollment::count(),
            'active_enrollments' => Enrollment::where('status', 'enrolled')->count(),
            'completed_enrollments' => Enrollment::where('status', 'completed')->count(),
            'total_submissions' => Submission::count(),
            'graded_submissions' => Submission::where('status', 'graded')->count(),
        ];

        // Enrollment trends (last 30 days)
        $enrollmentTrends = Enrollment::where('enrolled_at', '>=', now()->subDays(30))
            ->select(DB::raw('DATE(enrolled_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Course enrollment distribution
        $courseEnrollments = Course::withCount('enrollments')
            ->orderByDesc('enrollments_count')
            ->limit(10)
            ->get()
            ->map(fn ($c) => ['name' => $c->title, 'count' => $c->enrollments_count]);

        // Recent activity
        $recentEnrollments = Enrollment::with(['user', 'course'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Reports/Index', [
            'stats' => $stats,
            'enrollmentTrends' => $enrollmentTrends,
            'courseEnrollments' => $courseEnrollments,
            'recentEnrollments' => $recentEnrollments,
        ]);
    }

    public function enrollments(Request $request)
    {
        $query = Enrollment::with(['user', 'course']);

        if ($courseId = $request->input('course_id')) {
            $query->where('course_id', $courseId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $enrollments = $query->latest('enrolled_at')->paginate(20)->withQueryString();

        $trends = Enrollment::where('enrolled_at', '>=', now()->subDays(30))
            ->select(DB::raw('DATE(enrolled_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $courses = Course::orderBy('title')->get();

        return Inertia::render('Reports/Enrollments', [
            'enrollments' => $enrollments,
            'trends' => $trends,
            'courses' => $courses,
            'filters' => $request->only(['course_id', 'status']),
        ]);
    }

    public function performance(Request $request)
    {
        $submissions = Submission::with(['user', 'assessment.course', 'grade'])
            ->where('status', '!=', 'in_progress')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $avgScores = Submission::where('status', '!=', 'in_progress')
            ->whereNotNull('auto_score')
            ->join('assessments', 'submissions.assessment_id', '=', 'assessments.id')
            ->join('questions', 'questions.assessment_id', '=', 'assessments.id')
            ->select('assessments.title', DB::raw('avg(submissions.auto_score) as avg_score'), DB::raw('count(distinct submissions.id) as submission_count'))
            ->groupBy('assessments.title')
            ->get();

        return Inertia::render('Reports/Performance', [
            'submissions' => $submissions,
            'avgScores' => $avgScores,
        ]);
    }

    public function activity(Request $request)
    {
        $recentUsers = User::latest()->limit(10)->get();

        $logins = DB::table('sessions')
            ->select(DB::raw('DATE(last_activity, "unixepoch") as date'), DB::raw('count(distinct user_id) as unique_users'))
            ->where('last_activity', '>=', now()->subDays(30)->timestamp)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $roleDistribution = User::join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('roles.name', DB::raw('count(*) as count'))
            ->groupBy('roles.name')
            ->get();

        return Inertia::render('Reports/Activity', [
            'recentUsers' => $recentUsers,
            'logins' => $logins,
            'roleDistribution' => $roleDistribution,
        ]);
    }
}
