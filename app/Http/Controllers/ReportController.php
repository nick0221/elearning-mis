<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Submission;
use App\Models\User;
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
            'total_courses' => Course::where('status', 'published')->count(),
            'total_enrollments' => Enrollment::count(),
            'active_enrollments' => Enrollment::where('status', 'enrolled')->count(),
            'completed_enrollments' => Enrollment::where('status', 'completed')->count(),
            'total_submissions' => Submission::where('status', '!=', 'in_progress')->count(),
            'avg_score' => Submission::where('status', '!=', 'in_progress')->whereNotNull('auto_score')->avg('auto_score'),
            'completion_rate' => $this->calculateCompletionRate(),
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

        // User role distribution
        $roleDistribution = User::join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('roles.name', DB::raw('count(*) as count'))
            ->groupBy('roles.name')
            ->get();

        return Inertia::render('Reports/Index', [
            'stats' => $stats,
            'enrollmentTrends' => $enrollmentTrends,
            'courseEnrollments' => $courseEnrollments,
            'recentEnrollments' => $recentEnrollments,
            'roleDistribution' => $roleDistribution,
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

        if ($dateFrom = $request->input('date_from')) {
            $query->where('enrolled_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->where('enrolled_at', '<=', $dateTo);
        }

        $enrollments = $query->latest('enrolled_at')->paginate(20)->withQueryString();

        $trends = Enrollment::where('enrolled_at', '>=', now()->subDays(30))
            ->select(DB::raw('DATE(enrolled_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $courses = Course::orderBy('title')->get();

        $statusCounts = Enrollment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        return Inertia::render('Reports/Enrollments', [
            'enrollments' => $enrollments,
            'trends' => $trends,
            'courses' => $courses,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['course_id', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function performance(Request $request)
    {
        $query = Submission::with(['user', 'assessment.course', 'grade'])
            ->where('status', '!=', 'in_progress');

        if ($courseId = $request->input('course_id')) {
            $query->whereHas('assessment', fn ($q) => $q->where('course_id', $courseId));
        }

        $submissions = $query->latest()->paginate(20)->withQueryString();

        $avgScores = Submission::where('status', '!=', 'in_progress')
            ->whereNotNull('auto_score')
            ->join('assessments', 'submissions.assessment_id', '=', 'assessments.id')
            ->select('assessments.title', DB::raw('avg(submissions.auto_score) as avg_score'), DB::raw('count(distinct submissions.id) as submission_count'))
            ->groupBy('assessments.title')
            ->get();

        $passRate = Submission::where('status', '!=', 'in_progress')
            ->whereNotNull('auto_score')
            ->join('assessments', 'submissions.assessment_id', '=', 'assessments.id')
            ->select(DB::raw('count(*) as total'), DB::raw('sum(CASE WHEN auto_score >= assessments.passing_score * (SELECT sum(points) FROM questions WHERE assessment_id = submissions.assessment_id) / 100 THEN 1 ELSE 0 END) as passed'))
            ->first();

        return Inertia::render('Reports/Performance', [
            'submissions' => $submissions,
            'avgScores' => $avgScores,
            'passRate' => $passRate,
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

        $activityLogs = ActivityLog::with('user')
            ->latest()
            ->limit(20)
            ->get();

        return Inertia::render('Reports/Activity', [
            'recentUsers' => $recentUsers,
            'logins' => $logins,
            'roleDistribution' => $roleDistribution,
            'activityLogs' => $activityLogs,
        ]);
    }

    public function export(Request $request, string $type)
    {
        $this->authorize('viewSystemAnalytics');

        $filename = "report_{$type}_".now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($type) {
            $handle = fopen('php://output', 'w');

            switch ($type) {
                case 'enrollments':
                    fputcsv($handle, ['ID', 'Student', 'Course', 'Status', 'Enrolled At']);
                    Enrollment::with(['user', 'course'])->latest('enrolled_at')->limit(1000)->each(function ($e) use ($handle) {
                        fputcsv($handle, [$e->id, $e->user->name, $e->course->title, $e->status, $e->enrolled_at]);
                    });
                    break;

                case 'performance':
                    fputcsv($handle, ['ID', 'Student', 'Assessment', 'Score', 'Status', 'Submitted At']);
                    Submission::with(['user', 'assessment'])->where('status', '!=', 'in_progress')->latest()->limit(1000)->each(function ($s) use ($handle) {
                        fputcsv($handle, [$s->id, $s->user->name, $s->assessment->title, $s->auto_score, $s->status, $s->submitted_at]);
                    });
                    break;

                case 'users':
                    fputcsv($handle, ['ID', 'Name', 'Email', 'Active', 'Created At']);
                    User::latest()->limit(1000)->each(function ($u) use ($handle) {
                        fputcsv($handle, [$u->id, $u->name, $u->email, $u->is_active ? 'Yes' : 'No', $u->created_at]);
                    });
                    break;
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    protected function calculateCompletionRate(): float
    {
        $total = Enrollment::count();
        if ($total === 0) {
            return 0;
        }
        $completed = Enrollment::where('status', 'completed')->count();

        return round(($completed / $total) * 100, 1);
    }
}
