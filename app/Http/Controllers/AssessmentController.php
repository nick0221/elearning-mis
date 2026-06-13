<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssessmentRequest;
use App\Models\ActivityLog;
use App\Models\Assessment;
use App\Models\Course;
use App\Models\Question;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Assessment::with('course');

        if ($courseId = $request->input('course_id')) {
            $query->where('course_id', $courseId);
        }

        $assessments = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Assessments/Index', [
            'assessments' => $assessments,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', Assessment::class);

        $courses = Course::orderBy('title')->get();

        return Inertia::render('Assessments/Create', [
            'courses' => $courses,
            'courseId' => $request->input('course_id'),
        ]);
    }

    public function store(StoreAssessmentRequest $request)
    {
        $validated = $request->validated();

        $assessment = Assessment::create($validated);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'assessment_created',
            'subject_type' => Assessment::class,
            'subject_id' => $assessment->id,
            'properties' => ['title' => $assessment->title, 'type' => $assessment->type],
        ]);

        return redirect()->route('assessments.edit', $assessment)
            ->with('success', 'Assessment created. Now add questions.');
    }

    public function show(Assessment $assessment)
    {
        $assessment->load(['course', 'questions.options', 'submissions.user', 'submissions.grade']);

        return Inertia::render('Assessments/Show', [
            'assessment' => $assessment,
        ]);
    }

    public function edit(Assessment $assessment)
    {
        $this->authorize('update', $assessment);

        $assessment->load(['course', 'questions.options']);

        return Inertia::render('Assessments/Edit', [
            'assessment' => $assessment,
        ]);
    }

    public function update(Request $request, Assessment $assessment)
    {
        $this->authorize('update', $assessment);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:quiz,assignment',
            'max_attempts' => 'required|integer|min:1',
            'time_limit_minutes' => 'nullable|integer|min:1',
            'passing_score' => 'required|integer|min:0|max:100',
            'is_randomized' => 'boolean',
        ]);

        $assessment->update($validated);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'assessment_updated',
            'subject_type' => Assessment::class,
            'subject_id' => $assessment->id,
            'properties' => ['title' => $assessment->title],
        ]);

        return back()->with('success', 'Assessment updated.');
    }

    public function destroy(Assessment $assessment)
    {
        $this->authorize('delete', $assessment);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'assessment_deleted',
            'subject_type' => Assessment::class,
            'subject_id' => $assessment->id,
            'properties' => ['title' => $assessment->title],
        ]);

        $assessment->delete();

        return redirect()->route('assessments.index')
            ->with('success', 'Assessment deleted.');
    }

    public function addQuestion(Request $request, Assessment $assessment)
    {
        $validated = $request->validate([
            'body' => 'required|string',
            'type' => 'required|in:mcq,true_false,fill_blank,matching',
            'points' => 'required|integer|min:1',
            'explanation' => 'nullable|string',
            'options' => 'required_if:type,mcq|array|min:2',
            'options.*.body' => 'required|string',
            'options.*.is_correct' => 'boolean',
        ]);

        $question = $assessment->questions()->create([
            'body' => $validated['body'],
            'type' => $validated['type'],
            'points' => $validated['points'],
            'sort_order' => $assessment->questions()->count(),
            'explanation' => $validated['explanation'] ?? null,
        ]);

        if (! empty($validated['options'])) {
            foreach ($validated['options'] as $i => $opt) {
                $question->options()->create([
                    'body' => $opt['body'],
                    'is_correct' => $opt['is_correct'] ?? false,
                    'sort_order' => $i,
                ]);
            }
        }

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'question_added',
            'subject_type' => Assessment::class,
            'subject_id' => $assessment->id,
            'properties' => ['question_body' => $validated['body'], 'type' => $validated['type']],
        ]);

        return back()->with('success', 'Question added.');
    }

    public function take(Assessment $assessment)
    {
        $user = request()->user();
        $attempts = $assessment->submissions()->where('user_id', $user->id)->count();

        if ($attempts >= $assessment->max_attempts) {
            return back()->with('error', 'Maximum attempts reached.');
        }

        $submission = $assessment->submissions()->create([
            'user_id' => $user->id,
            'attempt_number' => $attempts + 1,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        $assessment->load(['questions.options']);

        return Inertia::render('Assessments/Take', [
            'assessment' => $assessment,
            'submission' => $submission,
        ]);
    }

    public function submit(Request $request, Assessment $assessment)
    {
        $validated = $request->validate([
            'submission_id' => 'required|exists:submissions,id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_option_id' => 'nullable|exists:question_options,id',
            'answers.*.text_answer' => 'nullable|string',
        ]);

        $submission = Submission::findOrFail($validated['submission_id']);

        if ($submission->user_id !== $request->user()->id) {
            return back()->with('error', 'This submission does not belong to you.');
        }

        $autoScore = 0;

        foreach ($validated['answers'] as $answerData) {
            $question = Question::find($answerData['question_id']);
            $isCorrect = false;

            if ($question->type === 'mcq' || $question->type === 'true_false') {
                $correctOption = $question->options()->where('is_correct', true)->first();
                $isCorrect = $correctOption && $correctOption->id === ($answerData['selected_option_id'] ?? null);
            }

            $pointsEarned = $isCorrect ? $question->points : 0;
            $autoScore += $pointsEarned;

            $submission->answers()->create([
                'question_id' => $question->id,
                'selected_option_id' => $answerData['selected_option_id'] ?? null,
                'text_answer' => $answerData['text_answer'] ?? null,
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned,
            ]);
        }

        $totalPoints = $assessment->questions()->sum('points');
        $submission->update([
            'auto_score' => $autoScore,
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        $passed = $totalPoints > 0 && ($autoScore / $totalPoints * 100) >= $assessment->passing_score;

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'assessment_submitted',
            'subject_type' => Assessment::class,
            'subject_id' => $assessment->id,
            'properties' => ['score' => $autoScore, 'total' => $totalPoints, 'passed' => $passed],
        ]);

        return Inertia::render('Assessments/Result', [
            'assessment' => $assessment->load('course'),
            'submission' => $submission->load('answers.question.options'),
            'autoScore' => $autoScore,
            'totalPoints' => $totalPoints,
            'passed' => $passed,
        ]);
    }
}
