<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
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

        $announcements = $query->latest('published_at')->paginate(15)->withQueryString();

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
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

        Announcement::create($validated);

        return back()->with('success', 'Announcement posted.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return back()->with('success', 'Announcement deleted.');
    }
}
