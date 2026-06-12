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
}
