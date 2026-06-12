<?php

namespace App\Policies;

use App\Models\Assessment;
use App\Models\User;

class AssessmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Assessment $assessment): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->can('create/edit/delete assessments');
    }

    public function update(User $user, Assessment $assessment): bool
    {
        return $user->can('create/edit/delete assessments');
    }

    public function delete(User $user, Assessment $assessment): bool
    {
        return $user->can('create/edit/delete assessments');
    }

    public function take(User $user, Assessment $assessment): bool
    {
        return $user->can('take/submit assessments');
    }

    public function grade(User $user, Assessment $assessment): bool
    {
        return $user->can('grade submissions');
    }
}
