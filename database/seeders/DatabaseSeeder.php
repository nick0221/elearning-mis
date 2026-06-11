<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create roles and permissions
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // 2. Create default accounts
        $this->call([
            DefaultUserSeeder::class,
        ]);

        // 3. Create demo data
        $this->call([
            DemoDataSeeder::class,
        ]);
    }
}
