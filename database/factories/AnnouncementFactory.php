<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'course_id' => null,
            'title' => fake()->sentence(),
            'body' => fake()->paragraphs(3, true),
            'is_pinned' => false,
            'published_at' => now(),
        ];
    }

    public function pinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_pinned' => true,
        ]);
    }

    public function unpinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_pinned' => false,
        ]);
    }
}
