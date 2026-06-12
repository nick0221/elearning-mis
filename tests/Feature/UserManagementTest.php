<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->admin = User::factory()->create();
        $this->admin->assignRole('super-admin');
    }

    public function test_super_admin_can_view_user_list(): void
    {
        $response = $this->actingAs($this->admin)->get('/users');
        $response->assertStatus(200);
    }

    public function test_super_admin_can_create_user(): void
    {
        $response = $this->actingAs($this->admin)->post('/users', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'student',
            'is_active' => true,
        ]);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', ['email' => 'new@example.com']);
    }

    public function test_student_cannot_access_user_management(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        $response = $this->actingAs($student)->get('/users');
        $response->assertForbidden();
    }

    public function test_super_admin_can_edit_user(): void
    {
        $user = User::factory()->create(['name' => 'Original Name']);

        $response = $this->actingAs($this->admin)->put("/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => $user->email,
            'role' => 'student',
            'is_active' => true,
        ]);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated Name']);
    }

    public function test_super_admin_can_delete_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->admin)->delete("/users/{$user->id}");
        $response->assertRedirect('/users');
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
