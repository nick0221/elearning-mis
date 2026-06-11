<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnrollmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $student;
    protected Course $course;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
        $this->student = User::factory()->create();
        $this->student->assignRole('student');
        $this->course = Course::create([
            'title' => 'Enrollment Test Course',
            'slug' => 'enrollment-test-course',
            'difficulty' => 'beginner',
            'status' => 'published',
        ]);
    }

    public function test_student_can_enroll_in_course(): void
    {
        $response = $this->actingAs($this->student)->post("/courses/{$this->course->id}/enroll");
        $response->assertRedirect();
        $this->assertDatabaseHas('enrollments', [
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'status' => 'enrolled',
        ]);
    }

    public function test_student_cannot_enroll_twice(): void
    {
        Enrollment::create([
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        $response = $this->actingAs($this->student)->post("/courses/{$this->course->id}/enroll");
        $response->assertSessionHas('error');
    }

    public function test_student_can_unenroll(): void
    {
        Enrollment::create([
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        $response = $this->actingAs($this->student)->delete("/courses/{$this->course->id}/unenroll");
        $response->assertRedirect();
        $this->assertDatabaseMissing('enrollments', [
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
        ]);
    }

    public function test_student_can_view_my_courses(): void
    {
        Enrollment::create([
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        $response = $this->actingAs($this->student)->get('/my-courses');
        $response->assertStatus(200);
    }
}
