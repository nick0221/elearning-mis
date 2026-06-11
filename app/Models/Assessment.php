<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assessment extends Model
{
    protected $fillable = ['course_id', 'lesson_id', 'title', 'type', 'max_attempts', 'time_limit_minutes', 'passing_score', 'is_randomized'];

    protected function casts(): array
    {
        return [
            'max_attempts' => 'integer',
            'time_limit_minutes' => 'integer',
            'passing_score' => 'integer',
            'is_randomized' => 'boolean',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('sort_order');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function getTotalPointsAttribute(): int
    {
        return $this->questions->sum('points');
    }
}
