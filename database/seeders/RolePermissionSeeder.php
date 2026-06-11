<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Users
            'manage users',
            'view user directory',
            'view own profile',
            'edit own profile',

            // Roles
            'manage roles & permissions',

            // Courses
            'create/edit own courses',
            'edit/delete any course',
            'view/browse courses',
            'enroll in courses',

            // Content
            'upload/manage content',
            'view/download content',

            // Assessments
            'create/edit/delete assessments',
            'take/submit assessments',

            // Grades
            'grade submissions',
            'view all grades',
            'view own grades',

            // Reports
            'view system analytics',
            'view course analytics',
            'view own progress',

            // Settings
            'manage system settings',

            // Notifications
            'broadcast system-wide notifications',
            'send course announcements',

            // Calendar
            'manage calendar events',
            'view calendar events',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles and assign permissions
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions($permissions);

        $systemAdmin = Role::firstOrCreate(['name' => 'system-admin', 'guard_name' => 'web']);
        $systemAdmin->syncPermissions([
            'manage users',
            'view user directory',
            'view own profile',
            'edit own profile',
            'create/edit own courses',
            'edit/delete any course',
            'view/browse courses',
            'enroll in courses',
            'upload/manage content',
            'view/download content',
            'create/edit/delete assessments',
            'take/submit assessments',
            'grade submissions',
            'view all grades',
            'view own grades',
            'view system analytics',
            'view course analytics',
            'view own progress',
            'broadcast system-wide notifications',
            'send course announcements',
            'manage calendar events',
            'view calendar events',
        ]);

        $instructor = Role::firstOrCreate(['name' => 'instructor', 'guard_name' => 'web']);
        $instructor->syncPermissions([
            'view user directory',
            'view own profile',
            'edit own profile',
            'create/edit own courses',
            'view/browse courses',
            'upload/manage content',
            'view/download content',
            'create/edit/delete assessments',
            'grade submissions',
            'view all grades',
            'view own grades',
            'view course analytics',
            'view own progress',
            'send course announcements',
            'manage calendar events',
            'view calendar events',
        ]);

        $student = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $student->syncPermissions([
            'view own profile',
            'edit own profile',
            'view/browse courses',
            'enroll in courses',
            'view/download content',
            'take/submit assessments',
            'view own grades',
            'view own progress',
            'view calendar events',
        ]);

        $member = Role::firstOrCreate(['name' => 'member', 'guard_name' => 'web']);
        $member->syncPermissions([
            'view own profile',
            'edit own profile',
            'view/browse courses',
            'view calendar events',
        ]);
    }
}
