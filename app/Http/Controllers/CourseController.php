<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Course::class);

        $query = Course::with(['category', 'instructors']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
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
        $this->authorize('create', Course::class);

        $categories = Category::orderBy('name')->get();

        return Inertia::render('Courses/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreCourseRequest $request)
    {
        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['title']);
        $validated['status'] = 'draft';

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('courses', 'public');
        }

        $course = Course::create($validated);
        $course->instructors()->attach(auth()->id(), ['is_primary' => true]);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'course_created',
            'subject_type' => Course::class,
            'subject_id' => $course->id,
            'properties' => ['title' => $course->title],
        ]);

        return redirect()->route('courses.edit', $course)
            ->with('success', 'Course created. Now add modules and lessons.');
    }

    public function show(Course $course)
    {
        $this->authorize('view', $course);

        $course->load(['category', 'instructors', 'modules.lessons', 'enrollments']);

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'enrollmentCount' => $course->enrollments()->count(),
        ]);
    }

    public function edit(Course $course)
    {
        $this->authorize('update', $course);

        $course->load(['category', 'instructors', 'modules.lessons']);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Courses/Edit', [
            'course' => $course,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course)
    {
        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['title']);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($course->thumbnail) {
                Storage::disk('public')->delete($course->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('courses', 'public');
        }

        $oldStatus = $course->status;
        $course->update($validated);

        // Log status change
        if ($oldStatus !== $course->status) {
            ActivityLog::create([
                'user_id' => $this->userId(),
                'action' => 'course_status_changed',
                'subject_type' => Course::class,
                'subject_id' => $course->id,
                'properties' => ['old_status' => $oldStatus, 'new_status' => $course->status],
            ]);
        } else {
            ActivityLog::create([
                'user_id' => $this->userId(),
                'action' => 'course_updated',
                'subject_type' => Course::class,
                'subject_id' => $course->id,
                'properties' => ['title' => $course->title],
            ]);
        }

        return redirect()->route('courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'course_deleted',
            'subject_type' => Course::class,
            'subject_id' => $course->id,
            'properties' => ['title' => $course->title],
        ]);

        // Delete thumbnail if exists
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();

        return redirect()->route('courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
