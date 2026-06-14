<?php

namespace App\Notifications;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Notifications\Notification;

class NewAnnouncement extends Notification
{
    public function __construct(
        public Announcement $announcement,
        public User $author,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_announcement',
            'announcement_id' => $this->announcement->id,
            'announcement_title' => $this->announcement->title,
            'announcement_body' => str($this->announcement->body)->limit(200),
            'author_name' => $this->author->name,
            'course_id' => $this->announcement->course_id,
            'url' => route('announcements.index'),
            'message' => "{$this->author->name} posted \"{$this->announcement->title}\"",
        ];
    }
}
