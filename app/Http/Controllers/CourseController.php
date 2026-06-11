<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with(['category', 'instructors']);

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        $courses = $query->latest()->paginate(12)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'category_id']),
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Courses/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'max_students' => 'nullable|integer|min:1',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['status'] = 'draft';

        $course = Course::create($validated);
        $course->instructors()->attach(auth()->id(), ['is_primary' => true]);

        return redirect()->route('courses.edit', $course)
            ->with('success', 'Course created. Now add modules and lessons.');
    }

    public function show(Course $course)
    {
        $course->load(['category', 'instructors', 'modules.lessons']);

        return Inertia::render('Courses/Show', [
            'course' => $course,
        ]);
    }

    public function edit(Course $course)
    {
        $course->load(['category', 'instructors', 'modules.lessons']);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Courses/Edit', [
            'course' => $course,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'status' => 'required|in:draft,published,archived',
            'max_students' => 'nullable|integer|min:1',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $course->update($validated);

        return redirect()->route('courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
