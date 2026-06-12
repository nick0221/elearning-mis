<?php

namespace App\Policies;

use App\Models\Discussion;
use App\Models\User;

class DiscussionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Discussion $discussion): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Discussion $discussion): bool
    {
        return $user->id === $discussion->user_id
            || $user->can('manage users');
    }

    public function delete(User $user, Discussion $discussion): bool
    {
        return $user->id === $discussion->user_id
            || $user->can('manage users');
    }

    public function reply(User $user, Discussion $discussion): bool
    {
        return ! $discussion->is_locked;
    }

    public function pin(User $user, Discussion $discussion): bool
    {
        return $user->can('send course announcements');
    }

    public function lock(User $user, Discussion $discussion): bool
    {
        return $user->can('send course announcements');
    }
}
