<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\Discussion;
use App\Notifications\DiscussionReplied;
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

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            });
        }

        $discussions = $query->orderBy('is_pinned', 'desc')->latest()->paginate(15)->withQueryString();
        $courses = Course::orderBy('title')->get(['id', 'title']);

        return Inertia::render('Discussions/Index', [
            'discussions' => $discussions,
            'filters' => $request->only(['search', 'course_id']),
            'courses' => $courses,
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
            'body' => 'required|string|max:5000',
        ]);

        $validated['user_id'] = $request->user()->id;

        $discussion = Discussion::create($validated);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'discussion_created',
            'subject_type' => Discussion::class,
            'subject_id' => $discussion->id,
            'properties' => ['title' => $discussion->title],
        ]);

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
            'body' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:discussion_replies,id',
        ]);

        $reply = $discussion->replies()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'discussion_replied',
            'subject_type' => Discussion::class,
            'subject_id' => $discussion->id,
            'properties' => ['discussion_title' => $discussion->title],
        ]);

        if ($discussion->user_id !== $request->user()->id) {
            $discussion->user->notify(
                new DiscussionReplied($discussion, $reply, $request->user())
            );
        }

        return back()->with('success', 'Reply posted.');
    }

    public function destroy(Discussion $discussion)
    {
        ActivityLog::create([
            'user_id' => request()->user()->id,
            'action' => 'discussion_deleted',
            'subject_type' => Discussion::class,
            'subject_id' => $discussion->id,
            'properties' => ['title' => $discussion->title],
        ]);

        $discussion->delete();

        return redirect()->route('discussions.index')
            ->with('success', 'Discussion deleted.');
    }
}
