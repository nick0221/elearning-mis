<?php

namespace App\Enums;

enum QuestionType: string
{
    case MCQ = 'mcq';
    case TrueFalse = 'true_false';
    case FillBlank = 'fill_blank';
    case Matching = 'matching';

    public function label(): string
    {
        return match ($this) {
            self::MCQ => 'Multiple Choice',
            self::TrueFalse => 'True/False',
            self::FillBlank => 'Fill in the Blank',
            self::Matching => 'Matching',
        };
    }
}
