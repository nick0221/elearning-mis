<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Course $course): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->can('create/edit own courses');
    }

    public function update(User $user, Course $course): bool
    {
        return $user->can('edit/delete any course')
            || $course->instructors()->where('user_id', $user->id)->exists();
    }

    public function delete(User $user, Course $course): bool
    {
        return $user->can('edit/delete any course');
    }
}
