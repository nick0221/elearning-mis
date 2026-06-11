<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$request->user()->id}",
            'avatar' => 'nullable|image|max:2048',
            'bio' => 'nullable|string|max:500',
            'timezone' => 'nullable|string|max:50',
        ]);

        $user = $request->user();
        $oldData = $user->only('name', 'email', 'bio', 'timezone');

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Log the activity
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'profile_updated',
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'properties' => [
                'changes' => array_diff_assoc($user->only('name', 'email', 'bio', 'timezone'), $oldData),
                'avatar_updated' => $request->hasFile('avatar'),
            ],
        ]);

        return Redirect::route('profile.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'profile_deleted',
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'properties' => ['email' => $user->email],
        ]);

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
