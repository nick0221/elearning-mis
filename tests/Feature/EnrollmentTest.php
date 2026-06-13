<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
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
        $this->seed(RolePermissionSeeder::class);
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

    public function test_student_can_complete_lesson(): void
    {
        $module = CourseModule::create([
            'course_id' => $this->course->id,
            'title' => 'Module 1',
            'sort_order' => 0,
        ]);

        $lesson = Lesson::create([
            'module_id' => $module->id,
            'title' => 'Lesson 1',
            'type' => 'text',
            'sort_order' => 0,
        ]);

        Enrollment::create([
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        $response = $this->actingAs($this->student)
            ->from("/courses/{$this->course->id}/learn")
            ->post("/lessons/{$lesson->id}/complete");

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Lesson marked as complete!');

        $this->assertDatabaseHas('lesson_completions', [
            'user_id' => $this->student->id,
            'lesson_id' => $lesson->id,
        ]);
    }

    public function test_course_auto_completes_when_all_lessons_done(): void
    {
        $module = CourseModule::create([
            'course_id' => $this->course->id,
            'title' => 'Module 1',
            'sort_order' => 0,
        ]);

        $lesson1 = Lesson::create([
            'module_id' => $module->id,
            'title' => 'Lesson 1',
            'type' => 'text',
            'sort_order' => 0,
        ]);

        $lesson2 = Lesson::create([
            'module_id' => $module->id,
            'title' => 'Lesson 2',
            'type' => 'text',
            'sort_order' => 1,
        ]);

        $enrollment = Enrollment::create([
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        // Complete first lesson
        $this->actingAs($this->student)
            ->from("/courses/{$this->course->id}/learn")
            ->post("/lessons/{$lesson1->id}/complete");

        $enrollment->refresh();
        $this->assertEquals('enrolled', $enrollment->status, 'Should not complete after only 1 of 2 lessons');

        // Complete second lesson
        $this->actingAs($this->student)
            ->from("/courses/{$this->course->id}/learn")
            ->post("/lessons/{$lesson2->id}/complete");

        $enrollment->refresh();
        $this->assertEquals('completed', $enrollment->status, 'Should auto-complete after all lessons done');
        $this->assertNotNull($enrollment->completed_at);
    }

    public function test_course_does_not_auto_complete_when_lessons_remain(): void
    {
        $module = CourseModule::create([
            'course_id' => $this->course->id,
            'title' => 'Module 1',
            'sort_order' => 0,
        ]);

        $lesson1 = Lesson::create([
            'module_id' => $module->id,
            'title' => 'Lesson 1',
            'type' => 'text',
            'sort_order' => 0,
        ]);

        Lesson::create([
            'module_id' => $module->id,
            'title' => 'Lesson 2',
            'type' => 'text',
            'sort_order' => 1,
        ]);

        $enrollment = Enrollment::create([
            'user_id' => $this->student->id,
            'course_id' => $this->course->id,
            'status' => 'enrolled',
            'enrolled_at' => now(),
        ]);

        $this->actingAs($this->student)
            ->from("/courses/{$this->course->id}/learn")
            ->post("/lessons/{$lesson1->id}/complete");

        $enrollment->refresh();
        $this->assertEquals('enrolled', $enrollment->status);
        $this->assertNull($enrollment->completed_at);
    }
}
