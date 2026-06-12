<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    protected User $instructor;

    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->instructor = User::factory()->create();
        $this->instructor->assignRole('instructor');
        $this->student = User::factory()->create();
        $this->student->assignRole('student');
    }

    public function test_authenticated_user_can_view_courses(): void
    {
        $response = $this->actingAs($this->student)->get('/courses');
        $response->assertStatus(200);
    }

    public function test_instructor_can_create_course(): void
    {
        $response = $this->actingAs($this->instructor)->post('/courses', [
            'title' => 'Test Course',
            'description' => 'A test course',
            'difficulty' => 'beginner',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('courses', ['title' => 'Test Course']);
    }

    public function test_student_cannot_create_course(): void
    {
        $response = $this->actingAs($this->student)->post('/courses', [
            'title' => 'Test Course',
            'difficulty' => 'beginner',
        ]);

        // Student lacks permission — policy denies access
        $response->assertStatus(403);
    }

    public function test_course_owner_can_edit_course(): void
    {
        $course = Course::create([
            'title' => 'My Course',
            'slug' => 'my-course',
            'difficulty' => 'beginner',
            'status' => 'draft',
        ]);
        $course->instructors()->attach($this->instructor->id, ['is_primary' => true]);

        $response = $this->actingAs($this->instructor)->put("/courses/{$course->id}", [
            'title' => 'Updated Course',
            'description' => 'Updated',
            'difficulty' => 'intermediate',
            'status' => 'published',
        ]);

        $response->assertRedirect('/courses');
        $this->assertDatabaseHas('courses', ['id' => $course->id, 'title' => 'Updated Course']);
    }
}
