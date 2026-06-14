<?php

namespace App\Notifications;

use App\Models\Course;
use Illuminate\Notifications\Notification;

class CourseCompleted extends Notification
{
    public function __construct(
        public Course $course,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'course_completed',
            'course_id' => $this->course->id,
            'course_title' => $this->course->title,
            'url' => route('courses.learn', $this->course),
            'message' => "Congratulations! You completed \"{$this->course->title}\"",
        ];
    }
}
