<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Course;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnouncementTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Course $course;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()->create();
        $this->user->assignRole('student');

        $this->course = Course::create([
            'title' => 'Test Course',
            'slug' => 'test-course',
            'difficulty' => 'beginner',
            'status' => 'published',
        ]);
    }

    public function test_authenticated_user_can_view_announcements(): void
    {
        Announcement::factory()->count(3)->create(['course_id' => $this->course->id]);

        $response = $this->actingAs($this->user)->get('/announcements');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Announcements/Index'));
    }

    public function test_announcements_can_be_filtered_by_course(): void
    {
        $otherCourse = Course::create([
            'title' => 'Other Course',
            'slug' => 'other-course',
            'difficulty' => 'intermediate',
            'status' => 'published',
        ]);

        Announcement::factory()->create(['course_id' => $this->course->id, 'title' => 'Course Announcement']);
        Announcement::factory()->create(['course_id' => $otherCourse->id, 'title' => 'Other Announcement']);

        $response = $this->actingAs($this->user)->get('/announcements?course_id='.$this->course->id);
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('announcements.data', 1)
            ->where('filters.course_id', (string) $this->course->id)
        );
    }

    public function test_announcements_can_be_searched_by_title(): void
    {
        Announcement::factory()->create(['course_id' => $this->course->id, 'title' => 'Unique Title Announcement']);
        Announcement::factory()->create(['course_id' => $this->course->id, 'title' => 'Something Else']);

        $response = $this->actingAs($this->user)->get('/announcements?search=Unique');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('announcements.data', 1)
            ->where('filters.search', 'Unique')
        );
    }

    public function test_user_can_create_announcement(): void
    {
        $response = $this->actingAs($this->user)->post('/announcements', [
            'course_id' => $this->course->id,
            'title' => 'New Announcement',
            'body' => 'Announcement body content.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('announcements', ['title' => 'New Announcement']);
    }

    public function test_user_can_delete_own_announcement(): void
    {
        $announcement = Announcement::factory()->create([
            'user_id' => $this->user->id,
            'course_id' => $this->course->id,
        ]);

        $response = $this->actingAs($this->user)->delete("/announcements/{$announcement->id}");
        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
    }

    public function test_create_announcement_requires_title(): void
    {
        $response = $this->actingAs($this->user)->post('/announcements', [
            'course_id' => $this->course->id,
            'body' => 'Body without title.',
        ]);

        $response->assertSessionHasErrors('title');
    }

    public function test_create_announcement_requires_body(): void
    {
        $response = $this->actingAs($this->user)->post('/announcements', [
            'course_id' => $this->course->id,
            'title' => 'Title without body.',
        ]);

        $response->assertSessionHasErrors('body');
    }
}
