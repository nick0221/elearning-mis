<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    protected $fillable = ['module_id', 'title', 'content', 'type', 'video_url', 'sort_order', 'duration_minutes'];

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
        ];
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(LessonAttachment::class);
    }
}
