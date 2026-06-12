<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\Course;
use App\Models\User;
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
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);

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
}
