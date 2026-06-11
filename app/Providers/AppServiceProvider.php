<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Super-Admin bypass — only for non-sensitive abilities
        Gate::before(function (User $user, string $ability) {
            $bypassableAbilities = [
                'viewAny',
                'view',
                'create',
                'update',
            ];

            if ($user->hasRole('super-admin') && in_array($ability, $bypassableAbilities)) {
                return true;
            }

            return null;
        });

        // Rate limiting
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('login', function () {
            return Limit::perMinute(5)->by('login');
        });

        RateLimiter::for('register', function () {
            return Limit::perMinute(3)->by('register');
        });
    }
}
