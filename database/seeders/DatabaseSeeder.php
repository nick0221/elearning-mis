<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Create default Super Admin
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@elearning.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
        $admin->assignRole('super-admin');

        // Create default Instructor
        $instructor = \App\Models\User::firstOrCreate(
            ['email' => 'instructor@elearning.com'],
            [
                'name' => 'John Instructor',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
        $instructor->assignRole('instructor');

        // Create default Student
        $student = \App\Models\User::firstOrCreate(
            ['email' => 'student@elearning.com'],
            [
                'name' => 'Jane Student',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
        $student->assignRole('student');

        // Seed demo data
        $this->call([
            DemoDataSeeder::class,
        ]);
    }
}
