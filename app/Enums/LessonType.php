<?php

namespace App\Enums;

enum LessonType: string
{
    case Text = 'text';
    case Video = 'video';
    case Audio = 'audio';

    public function label(): string
    {
        return match ($this) {
            self::Text => 'Text',
            self::Video => 'Video',
            self::Audio => 'Audio',
        };
    }
}
