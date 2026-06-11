<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Course extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'thumbnail', 'category_id',
        'difficulty', 'status', 'max_students', 'estimated_duration_minutes',
    ];

    protected static function booted(): void
    {
        static::creating(function (Course $course) {
            if (empty($course->slug)) {
                $course->slug = Str::slug($course->title);
            }
        });
    }

    protected function casts(): array
    {
        return [
            'max_students' => 'integer',
            'estimated_duration_minutes' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function instructors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_instructors', 'course_id', 'user_id')
            ->withPivot('is_primary');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class, 'course_id', 'id')->orderBy('sort_order');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'draft' => 'Draft',
            'published' => 'Published',
            'archived' => 'Archived',
            default => $this->status,
        };
    }

    public function getDifficultyLabelAttribute(): string
    {
        return ucfirst($this->difficulty);
    }
}
