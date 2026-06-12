<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CourseReviewController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'body' => 'nullable|string|max:2000',
        ]);

        $course->reviews()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return redirect()->back()->with('success', 'Review submitted successfully.');
    }

    public function destroy(Course $course, Request $request): RedirectResponse
    {
        $review = $course->reviews()->where('user_id', $request->user()->id)->first();

        if (! $review) {
            abort(403);
        }

        $this->authorize('delete', $review);

        $review->delete();

        return redirect()->back()->with('success', 'Review deleted.');
    }
}
