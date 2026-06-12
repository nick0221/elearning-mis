<?php

namespace App\Http\Controllers;

use App\Models\CourseModule;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function store(Request $request, CourseModule $module)
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'required|in:text,video,audio',
            'video_url' => 'nullable|string|max:500',
            'duration_minutes' => 'nullable|integer|min:1',
        ]);

        $validated['sort_order'] = $module->lessons()->count();

        $module->lessons()->create($validated);

        return back()->with('success', 'Lesson added.');
    }

    public function update(Request $request, Lesson $lesson)
    {
        $this->authorize('update', $lesson->module->course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'required|in:text,video,audio',
            'video_url' => 'nullable|string|max:500',
            'duration_minutes' => 'nullable|integer|min:1',
        ]);

        $lesson->update($validated);

        return back()->with('success', 'Lesson updated.');
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        $this->authorize('update', $lesson->module->course);

        $lesson->delete();

        return back()->with('success', 'Lesson deleted.');
    }

    public function reorder(Request $request, CourseModule $module): RedirectResponse
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate([
            'lessons' => 'required|array',
            'lessons.*.id' => 'required|exists:lessons,id',
            'lessons.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['lessons'] as $item) {
            Lesson::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Lessons reordered.');
    }
}
