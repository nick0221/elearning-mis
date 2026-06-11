<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    protected $fillable = ['submission_id', 'graded_by', 'score', 'max_score', 'feedback', 'graded_at'];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'max_score' => 'integer',
            'graded_at' => 'datetime',
        ];
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function grader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by');
    }
}
