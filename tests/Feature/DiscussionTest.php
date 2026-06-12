<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Discussion;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiscussionTest extends TestCase
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

    public function test_authenticated_user_can_view_discussions(): void
    {
        $response = $this->actingAs($this->user)->get('/discussions');
        $response->assertStatus(200);
    }

    public function test_user_can_create_discussion(): void
    {
        $response = $this->actingAs($this->user)->post('/discussions', [
            'course_id' => $this->course->id,
            'title' => 'Test Discussion',
            'body' => 'This is a test discussion body.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('discussions', ['title' => 'Test Discussion']);
    }

    public function test_user_can_reply_to_discussion(): void
    {
        $discussion = Discussion::create([
            'course_id' => $this->course->id,
            'user_id' => $this->user->id,
            'title' => 'Test Discussion',
            'body' => 'Test body',
        ]);

        $response = $this->actingAs($this->user)->post("/discussions/{$discussion->id}/reply", [
            'body' => 'This is a reply.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('discussion_replies', ['body' => 'This is a reply.']);
    }
}
