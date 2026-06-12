<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    protected User $student;

    protected User $otherStudent;

    protected Course $course;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->student = User::factory()->create();
        $this->student->assignRole('student');

        $this->otherStudent = User::factory()->create();
        $this->otherStudent->assignRole('student');

        $this->course = Course::create([
            'title' => 'Test Course',
            'slug' => 'test-course',
            'difficulty' => 'beginner',
            'status' => 'published',
        ]);
    }

    public function test_student_can_submit_review(): void
    {
        $response = $this->actingAs($this->student)->post("/courses/{$this->course->id}/reviews", [
            'rating' => 5,
            'body' => 'Great course!',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('course_reviews', [
            'course_id' => $this->course->id,
            'user_id' => $this->student->id,
            'rating' => 5,
            'body' => 'Great course!',
        ]);
    }

    public function test_student_can_only_submit_one_review_per_course(): void
    {
        $this->actingAs($this->student)->post("/courses/{$this->course->id}/reviews", [
            'rating' => 4,
            'body' => 'Good course',
        ]);

        $response = $this->actingAs($this->student)->post("/courses/{$this->course->id}/reviews", [
            'rating' => 3,
            'body' => 'Updated review',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('course_reviews', 1);
        $this->assertDatabaseHas('course_reviews', [
            'course_id' => $this->course->id,
            'user_id' => $this->student->id,
            'rating' => 3,
            'body' => 'Updated review',
        ]);
    }

    public function test_student_can_delete_own_review(): void
    {
        $this->actingAs($this->student)->post("/courses/{$this->course->id}/reviews", [
            'rating' => 4,
            'body' => 'Nice',
        ]);

        $response = $this->actingAs($this->student)->delete("/courses/{$this->course->id}/reviews");

        $response->assertRedirect();
        $this->assertDatabaseCount('course_reviews', 0);
    }

    public function test_student_cannot_delete_others_review(): void
    {
        $this->actingAs($this->student)->post("/courses/{$this->course->id}/reviews", [
            'rating' => 4,
            'body' => 'Nice',
        ]);

        $response = $this->actingAs($this->otherStudent)->delete("/courses/{$this->course->id}/reviews");

        $response->assertStatus(403);
        $this->assertDatabaseCount('course_reviews', 1);
    }

    public function test_review_rating_must_be_between_1_and_5(): void
    {
        $response = $this->actingAs($this->student)->post("/courses/{$this->course->id}/reviews", [
            'rating' => 6,
            'body' => 'Invalid',
        ]);

        $response->assertSessionHasErrors('rating');
    }
}
