<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->only('id', 'name', 'email', 'avatar'),
                    'roles' => $this->getUserRoles($request->user()),
                    'permissions' => $this->getUserPermissions($request->user()),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    protected function getUserRoles($user): array
    {
        $cacheKey = "user_roles_{$user->id}";
        $cacheDuration = 60 * 5;

        return Cache::remember($cacheKey, $cacheDuration, function () use ($user) {
            return $user->getRoleNames()->toArray();
        });
    }

    protected function getUserPermissions($user): array
    {
        $cacheKey = "user_permissions_{$user->id}";
        $cacheDuration = 60 * 5;

        return Cache::remember($cacheKey, $cacheDuration, function () use ($user) {
            return $user->getAllPermissions()->pluck('name')->toArray();
        });
    }
}
