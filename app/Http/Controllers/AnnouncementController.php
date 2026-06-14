<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Course;
use App\Notifications\NewAnnouncement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with(['user', 'course']);

        if ($courseId = $request->input('course_id')) {
            $query->where('course_id', $courseId);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            });
        }

        $announcements = $query->latest('published_at')->paginate(15)->withQueryString();
        $courses = Course::orderBy('title')->get(['id', 'title']);

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'course_id']),
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'course_id' => 'nullable|exists:courses,id',
            'is_pinned' => 'boolean',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['published_at'] = now();

        $announcement = Announcement::create($validated);

        if ($announcement->course_id) {
            $announcement->course->enrollments()
                ->with('user')
                ->where('status', 'enrolled')
                ->get()
                ->each(fn ($enrollment) => $enrollment->user->notify(
                    new NewAnnouncement($announcement, $request->user())
                ));
        }

        return back()->with('success', 'Announcement posted.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return back()->with('success', 'Announcement deleted.');
    }
}
