<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\Course;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssessmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $instructor;

    protected User $student;

    protected Course $course;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->instructor = User::factory()->create();
        $this->instructor->assignRole('instructor');

        $this->student = User::factory()->create();
        $this->student->assignRole('student');

        $this->course = Course::create([
            'title' => 'Test Course',
            'slug' => 'test-course',
            'difficulty' => 'beginner',
            'status' => 'published',
        ]);
        $this->course->instructors()->attach($this->instructor->id, ['is_primary' => true]);
    }

    public function test_instructor_can_create_assessment(): void
    {
        $response = $this->actingAs($this->instructor)->post('/assessments', [
            'course_id' => $this->course->id,
            'title' => 'Test Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('assessments', ['title' => 'Test Quiz']);
    }

    public function test_student_cannot_create_assessment(): void
    {
        $response = $this->actingAs($this->student)->post('/assessments', [
            'course_id' => $this->course->id,
            'title' => 'Test Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $response->assertStatus(403);
    }

    public function test_student_can_take_assessment(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Test Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $response = $this->actingAs($this->student)->get("/assessments/{$assessment->id}/take");
        $response->assertStatus(200);
    }

    public function test_instructor_can_view_grade_form(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Test Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $question = $assessment->questions()->create([
            'body' => 'Sample question?',
            'type' => 'mcq',
            'points' => 10,
            'sort_order' => 0,
        ]);

        $option = $question->options()->create([
            'body' => 'Correct Answer',
            'is_correct' => true,
            'sort_order' => 0,
        ]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($this->instructor)
            ->get("/assessments/{$assessment->id}/submissions/{$submission->id}/grade");

        $response->assertStatus(200);
    }

    public function test_instructor_can_grade_submission(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Test Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $question = $assessment->questions()->create([
            'body' => 'Sample question?',
            'type' => 'mcq',
            'points' => 10,
            'sort_order' => 0,
        ]);

        $question->options()->create([
            'body' => 'Correct Answer',
            'is_correct' => true,
            'sort_order' => 0,
        ]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($this->instructor)
            ->post("/assessments/{$assessment->id}/submissions/{$submission->id}/grade", [
                'score' => 8,
                'feedback' => 'Good work, but check the first question.',
            ]);

        $response->assertRedirect(route('assessments.show', $assessment));
        $this->assertDatabaseHas('grades', [
            'submission_id' => $submission->id,
            'graded_by' => $this->instructor->id,
            'score' => 8,
            'feedback' => 'Good work, but check the first question.',
        ]);

        $submission->refresh();
        $this->assertEquals('graded', $submission->status);
    }

    public function test_student_cannot_view_grade_form(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Test Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($this->student)
            ->get("/assessments/{$assessment->id}/submissions/{$submission->id}/grade");

        $response->assertStatus(403);
    }

    public function test_student_cannot_grade_submission(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Test Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($this->student)
            ->post("/assessments/{$assessment->id}/submissions/{$submission->id}/grade", [
                'score' => 8,
            ]);

        $response->assertStatus(403);
    }

    public function test_cannot_grade_already_graded_submission(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Test Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'submitted_at' => now(),
            'status' => 'submitted',
        ]);

        $this->actingAs($this->instructor)
            ->post("/assessments/{$assessment->id}/submissions/{$submission->id}/grade", [
                'score' => 5,
            ]);

        $response = $this->actingAs($this->instructor)
            ->post("/assessments/{$assessment->id}/submissions/{$submission->id}/grade", [
                'score' => 8,
            ]);

        $response->assertSessionHas('error', 'This submission has already been graded.');

        $this->assertDatabaseHas('grades', [
            'submission_id' => $submission->id,
            'score' => 5,
        ]);

        $this->assertDatabaseMissing('grades', [
            'submission_id' => $submission->id,
            'score' => 8,
        ]);
    }

    public function test_instructor_can_update_assessment(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Original Title',
            'type' => 'quiz',
            'max_attempts' => 2,
            'passing_score' => 60,
        ]);

        $response = $this->actingAs($this->instructor)
            ->from("/assessments/{$assessment->id}/edit")
            ->put("/assessments/{$assessment->id}", [
                'title' => 'Updated Title',
                'type' => 'assignment',
                'max_attempts' => 5,
                'passing_score' => 70,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Assessment updated.');

        $this->assertDatabaseHas('assessments', [
            'id' => $assessment->id,
            'title' => 'Updated Title',
            'type' => 'assignment',
            'max_attempts' => 5,
            'passing_score' => 70,
        ]);
    }

    public function test_student_cannot_update_assessment(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Original Title',
            'type' => 'quiz',
            'max_attempts' => 2,
            'passing_score' => 60,
        ]);

        $response = $this->actingAs($this->student)
            ->put("/assessments/{$assessment->id}", [
                'title' => 'Hacked Title',
                'type' => 'quiz',
                'max_attempts' => 2,
                'passing_score' => 60,
            ]);

        $response->assertStatus(403);
    }

    public function test_instructor_can_delete_assessment(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'To Delete',
            'type' => 'quiz',
            'max_attempts' => 1,
            'passing_score' => 60,
        ]);

        $response = $this->actingAs($this->instructor)
            ->delete("/assessments/{$assessment->id}");

        $response->assertRedirect(route('assessments.index'));
        $response->assertSessionHas('success', 'Assessment deleted.');

        $this->assertDatabaseMissing('assessments', ['id' => $assessment->id]);
    }

    public function test_student_cannot_delete_assessment(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'To Delete',
            'type' => 'quiz',
            'max_attempts' => 1,
            'passing_score' => 60,
        ]);

        $response = $this->actingAs($this->student)
            ->delete("/assessments/{$assessment->id}");

        $response->assertStatus(403);
    }

    public function test_instructor_can_add_question_to_assessment(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Quiz with Questions',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $response = $this->actingAs($this->instructor)
            ->from("/assessments/{$assessment->id}/edit")
            ->post("/assessments/{$assessment->id}/add-question", [
                'body' => 'What is 2+2?',
                'type' => 'mcq',
                'points' => 10,
                'explanation' => 'Basic math.',
                'options' => [
                    ['body' => '3', 'is_correct' => false],
                    ['body' => '4', 'is_correct' => true],
                    ['body' => '5', 'is_correct' => false],
                ],
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Question added.');

        $this->assertDatabaseHas('questions', [
            'assessment_id' => $assessment->id,
            'body' => 'What is 2+2?',
            'type' => 'mcq',
            'points' => 10,
        ]);

        $this->assertDatabaseHas('question_options', [
            'body' => '4',
            'is_correct' => true,
        ]);

        $this->assertDatabaseCount('question_options', 3);
    }

    public function test_add_question_requires_options_for_mcq(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $response = $this->actingAs($this->instructor)
            ->post("/assessments/{$assessment->id}/add-question", [
                'body' => 'MCQ without options?',
                'type' => 'mcq',
                'points' => 10,
            ]);

        $response->assertSessionHasErrors('options');
    }

    public function test_instructor_can_add_true_false_question(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $response = $this->actingAs($this->instructor)
            ->from("/assessments/{$assessment->id}/edit")
            ->post("/assessments/{$assessment->id}/add-question", [
                'body' => 'The sky is blue.',
                'type' => 'true_false',
                'points' => 5,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('questions', [
            'assessment_id' => $assessment->id,
            'type' => 'true_false',
        ]);
    }

    public function test_max_attempts_enforced(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'One Attempt Only',
            'type' => 'quiz',
            'max_attempts' => 1,
            'passing_score' => 60,
        ]);

        $this->actingAs($this->student)->get("/assessments/{$assessment->id}/take");

        $response = $this->actingAs($this->student)
            ->get("/assessments/{$assessment->id}/take");

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Maximum attempts reached.');
    }

    public function test_student_can_submit_mcq_with_correct_answers(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Auto-Graded Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 50,
        ]);

        $question = $assessment->questions()->create([
            'body' => 'What is 2+2?',
            'type' => 'mcq',
            'points' => 10,
            'sort_order' => 0,
        ]);

        $correctOption = $question->options()->create(['body' => '4', 'is_correct' => true, 'sort_order' => 0]);
        $question->options()->create(['body' => '3', 'is_correct' => false, 'sort_order' => 1]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        $response = $this->actingAs($this->student)
            ->post("/assessments/{$assessment->id}/submit", [
                'submission_id' => $submission->id,
                'answers' => [
                    ['question_id' => $question->id, 'selected_option_id' => $correctOption->id],
                ],
            ]);

        $response->assertStatus(200);

        $submission->refresh();
        $this->assertEquals(10, $submission->auto_score);
        $this->assertEquals('submitted', $submission->status);

        $this->assertDatabaseHas('answers', [
            'submission_id' => $submission->id,
            'question_id' => $question->id,
            'is_correct' => true,
            'points_earned' => 10,
        ]);
    }

    public function test_student_can_submit_mcq_with_incorrect_answers(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Auto-Graded Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 50,
        ]);

        $question = $assessment->questions()->create([
            'body' => 'What is 2+2?',
            'type' => 'mcq',
            'points' => 10,
            'sort_order' => 0,
        ]);

        $question->options()->create(['body' => '4', 'is_correct' => true, 'sort_order' => 0]);
        $wrongOption = $question->options()->create(['body' => '3', 'is_correct' => false, 'sort_order' => 1]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        $this->actingAs($this->student)
            ->post("/assessments/{$assessment->id}/submit", [
                'submission_id' => $submission->id,
                'answers' => [
                    ['question_id' => $question->id, 'selected_option_id' => $wrongOption->id],
                ],
            ]);

        $submission->refresh();
        $this->assertEquals(0, $submission->auto_score);

        $this->assertDatabaseHas('answers', [
            'submission_id' => $submission->id,
            'is_correct' => false,
            'points_earned' => 0,
        ]);
    }

    public function test_student_can_submit_true_false_question(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'TF Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 50,
        ]);

        $question = $assessment->questions()->create([
            'body' => 'The sky is blue.',
            'type' => 'true_false',
            'points' => 10,
            'sort_order' => 0,
        ]);

        $correctOption = $question->options()->create(['body' => 'True', 'is_correct' => true, 'sort_order' => 0]);
        $question->options()->create(['body' => 'False', 'is_correct' => false, 'sort_order' => 1]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        $this->actingAs($this->student)
            ->post("/assessments/{$assessment->id}/submit", [
                'submission_id' => $submission->id,
                'answers' => [
                    ['question_id' => $question->id, 'selected_option_id' => $correctOption->id],
                ],
            ]);

        $submission->refresh();
        $this->assertEquals(10, $submission->auto_score);
    }

    public function test_student_cannot_submit_others_submission(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Quiz',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $otherStudent = User::factory()->create();
        $otherStudent->assignRole('student');

        $submission = $assessment->submissions()->create([
            'user_id' => $otherStudent->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        $question = $assessment->questions()->create([
            'body' => 'Sample?',
            'type' => 'mcq',
            'points' => 10,
            'sort_order' => 0,
        ]);
        $option = $question->options()->create(['body' => 'A', 'is_correct' => true, 'sort_order' => 0]);

        $this->actingAs($this->student)
            ->from("/assessments/{$assessment->id}/take")
            ->post("/assessments/{$assessment->id}/submit", [
                'submission_id' => $submission->id,
                'answers' => [
                    ['question_id' => $question->id, 'selected_option_id' => $option->id],
                ],
            ])
            ->assertRedirect()
            ->assertSessionHas('error', 'This submission does not belong to you.');
    }

    public function test_student_can_submit_own_assessment_without_answers(): void
    {
        $assessment = Assessment::create([
            'course_id' => $this->course->id,
            'title' => 'Submit Test',
            'type' => 'quiz',
            'max_attempts' => 3,
            'passing_score' => 60,
        ]);

        $question = $assessment->questions()->create([
            'body' => 'Sample?',
            'type' => 'mcq',
            'points' => 10,
            'sort_order' => 0,
        ]);
        $question->options()->create(['body' => 'A', 'is_correct' => true, 'sort_order' => 0]);
        $question->options()->create(['body' => 'B', 'is_correct' => false, 'sort_order' => 1]);

        $submission = $assessment->submissions()->create([
            'user_id' => $this->student->id,
            'attempt_number' => 1,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        $response = $this->actingAs($this->student)
            ->post("/assessments/{$assessment->id}/submit", [
                'submission_id' => $submission->id,
                'answers' => [
                    ['question_id' => $question->id, 'selected_option_id' => $question->options()->first()->id],
                ],
            ]);

        $response->assertOk();

        $submission->refresh();
        $this->assertEquals('submitted', $submission->status);
    }
}
