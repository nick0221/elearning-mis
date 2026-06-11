<?php

namespace App\Http\Controllers;

use App\Models\Discussion;
use App\Models\DiscussionReply;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscussionController extends Controller
{
    public function index(Request $request)
    {
        $query = Discussion::with(['user', 'course', 'replies']);

        if ($courseId = $request->input('course_id')) {
            $query->where('course_id', $courseId);
        }

        $discussions = $query->orderBy('is_pinned', 'desc')->latest()->paginate(15)->withQueryString();

        return Inertia::render('Discussions/Index', [
            'discussions' => $discussions,
        ]);
    }

    public function create()
    {
        $courses = Course::orderBy('title')->get();

        return Inertia::render('Discussions/Create', [
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        $discussion = Discussion::create($validated);

        return redirect()->route('discussions.show', $discussion)
            ->with('success', 'Discussion created.');
    }

    public function show(Discussion $discussion)
    {
        $discussion->load(['user', 'course', 'replies.user', 'replies.parent']);

        return Inertia::render('Discussions/Show', [
            'discussion' => $discussion,
        ]);
    }

    public function reply(Request $request, Discussion $discussion)
    {
        if ($discussion->is_locked) {
            return back()->with('error', 'This discussion is locked.');
        }

        $validated = $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:discussion_replies,id',
        ]);

        $discussion->replies()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return back()->with('success', 'Reply posted.');
    }

    public function destroy(Discussion $discussion)
    {
        $discussion->delete();

        return redirect()->route('discussions.index')
            ->with('success', 'Discussion deleted.');
    }
}
