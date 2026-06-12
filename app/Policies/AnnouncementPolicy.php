<?php

namespace App\Policies;

use App\Models\Announcement;
use App\Models\User;

class AnnouncementPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Announcement $announcement): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->can('broadcast system-wide notifications')
            || $user->can('send course announcements');
    }

    public function update(User $user, Announcement $announcement): bool
    {
        return $user->id === $announcement->user_id
            || $user->can('manage users');
    }

    public function delete(User $user, Announcement $announcement): bool
    {
        return $user->id === $announcement->user_id
            || $user->can('manage users');
    }

    public function pin(User $user, Announcement $announcement): bool
    {
        return $user->can('broadcast system-wide notifications')
            || $user->can('send course announcements');
    }
}
