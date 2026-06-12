<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Assessment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function create(Assessment $assessment, Submission $submission)
    {
        $this->authorize('grade', $assessment);

        if ($submission->assessment_id !== $assessment->id) {
            abort(404);
        }

        if ($submission->status === 'graded') {
            return redirect()->route('assessments.show', $assessment)
                ->with('error', 'This submission has already been graded.');
        }

        $submission->load(['user', 'answers.question.options', 'assessment.course']);

        return Inertia::render('Assessments/Grade', [
            'assessment' => $assessment->load('course'),
            'submission' => $submission,
        ]);
    }

    public function store(Request $request, Assessment $assessment, Submission $submission)
    {
        $this->authorize('grade', $assessment);

        if ($submission->assessment_id !== $assessment->id) {
            abort(404);
        }

        if ($submission->status === 'graded') {
            return back()->with('error', 'This submission has already been graded.');
        }

        $validated = $request->validate([
            'score' => 'required|integer|min:0',
            'feedback' => 'nullable|string',
        ]);

        $maxScore = $assessment->questions()->sum('points');

        $submission->grade()->create([
            'graded_by' => $request->user()->id,
            'score' => $validated['score'],
            'max_score' => $maxScore,
            'feedback' => $validated['feedback'] ?? null,
            'graded_at' => now(),
        ]);

        $submission->update(['status' => 'graded']);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'submission_graded',
            'subject_type' => Assessment::class,
            'subject_id' => $assessment->id,
            'properties' => [
                'submission_id' => $submission->id,
                'score' => $validated['score'],
                'max_score' => $maxScore,
            ],
        ]);

        return redirect()->route('assessments.show', $assessment)
            ->with('success', 'Submission graded successfully.');
    }
}
