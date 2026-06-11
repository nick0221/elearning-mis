<?php

namespace App\Enums;

enum SubmissionStatus: string
{
    case InProgress = 'in_progress';
    case Submitted = 'submitted';
    case Graded = 'graded';

    public function label(): string
    {
        return match ($this) {
            self::InProgress => 'In Progress',
            self::Submitted => 'Submitted',
            self::Graded => 'Graded',
        };
    }
}
