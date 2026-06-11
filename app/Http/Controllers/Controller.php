<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Get the authenticated user's ID for scoping queries.
     */
    protected function userId(): int
    {
        return auth()->id();
    }

    /**
     * Check if the authenticated user has a specific permission.
     */
    protected function userCan(string $permission): bool
    {
        return auth()->user()->can($permission);
    }

    /**
     * Check if the authenticated user has any of the given roles.
     */
    protected function userHasRole(string ...$roles): bool
    {
        return auth()->user()->hasAnyRole($roles);
    }
}
