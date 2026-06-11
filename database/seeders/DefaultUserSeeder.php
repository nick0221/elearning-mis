<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@elearning.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
        $admin->assignRole('super-admin');

        // Instructor
        $instructor = User::firstOrCreate(
            ['email' => 'instructor@elearning.com'],
            [
                'name' => 'John Instructor',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
        $instructor->assignRole('instructor');

        // Student
        $student = User::firstOrCreate(
            ['email' => 'student@elearning.com'],
            [
                'name' => 'Jane Student',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
        $student->assignRole('student');

        $this->command->info('Default accounts created:');
        $this->command->info('  admin@elearning.com / password (Super-Admin)');
        $this->command->info('  instructor@elearning.com / password (Instructor)');
        $this->command->info('  student@elearning.com / password (Student)');
    }
}
