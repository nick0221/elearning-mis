<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseModule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
        ]);

        $validated['sort_order'] = $course->modules()->count();

        $course->modules()->create($validated);

        return back()->with('success', 'Module created.');
    }

    public function update(Request $request, CourseModule $module): RedirectResponse
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
        ]);

        $module->update($validated);

        return back()->with('success', 'Module updated.');
    }

    public function destroy(CourseModule $module): RedirectResponse
    {
        $this->authorize('update', $module->course);

        $module->delete();

        return back()->with('success', 'Module deleted.');
    }

    public function reorder(Request $request, Course $course): RedirectResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|exists:course_modules,id',
            'modules.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['modules'] as $item) {
            CourseModule::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Modules reordered.');
    }
}
