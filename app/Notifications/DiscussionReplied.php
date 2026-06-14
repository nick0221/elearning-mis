<?php

namespace App\Notifications;

use App\Models\Discussion;
use App\Models\DiscussionReply;
use App\Models\User;
use Illuminate\Notifications\Notification;

class DiscussionReplied extends Notification
{
    public function __construct(
        public Discussion $discussion,
        public DiscussionReply $reply,
        public User $replier,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'discussion_replied',
            'discussion_id' => $this->discussion->id,
            'discussion_title' => $this->discussion->title,
            'reply_id' => $this->reply->id,
            'replier_id' => $this->replier->id,
            'replier_name' => $this->replier->name,
            'replier_avatar' => $this->replier->avatar,
            'url' => route('discussions.show', $this->discussion),
            'message' => "{$this->replier->name} replied to your discussion \"{$this->discussion->title}\"",
        ];
    }
}
