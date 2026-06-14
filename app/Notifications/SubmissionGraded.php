<?php

namespace App\Notifications;

use App\Models\Assessment;
use App\Models\Grade;
use Illuminate\Notifications\Notification;

class SubmissionGraded extends Notification
{
    public function __construct(
        public Assessment $assessment,
        public Grade $grade,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'submission_graded',
            'assessment_id' => $this->assessment->id,
            'assessment_title' => $this->assessment->title,
            'score' => $this->grade->score,
            'max_score' => $this->grade->max_score,
            'url' => route('assessments.show', $this->assessment),
            'message' => "Your submission for \"{$this->assessment->title}\" has been graded ({$this->grade->score}/{$this->grade->max_score})",
        ];
    }
}
