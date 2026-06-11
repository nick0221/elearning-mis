<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage users') || $user->can('view user directory');
    }

    public function view(User $user, User $model): bool
    {
        return $user->can('manage users')
            || $user->can('view user directory')
            || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    public function update(User $user, User $model): bool
    {
        return $user->can('manage users') || $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        return $user->can('manage users') && $user->id !== $model->id;
    }

    public function assignRole(User $user): bool
    {
        return $user->can('manage roles & permissions');
    }
}
