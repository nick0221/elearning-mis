<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $query = User::with('roles');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->role($role);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        $roles = $this->getAllowedRoles();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $user->assignRole($validated['role']);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'user_created',
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'properties' => ['email' => $user->email, 'role' => $validated['role']],
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);

        $user->load('roles', 'activityLogs');

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        $user->load('roles');
        $roles = $this->getAllowedRoles();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_active' => $validated['is_active'] ?? $user->is_active,
            'bio' => $validated['bio'] ?? $user->bio,
            'timezone' => $validated['timezone'] ?? $user->timezone,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $oldRole = $user->getRoleNames()->first();
        $user->update($data);
        $user->syncRoles([$validated['role']]);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'user_updated',
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'properties' => [
                'changes' => array_diff($data, $user->getOriginal()),
                'old_role' => $oldRole,
                'new_role' => $validated['role'],
            ],
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        ActivityLog::create([
            'user_id' => $this->userId(),
            'action' => 'user_deleted',
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'properties' => ['email' => $user->email, 'name' => $user->name],
        ]);

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    protected function getAllowedRoles()
    {
        $user = $this->user();

        if ($user->hasRole('super-admin')) {
            return Role::all();
        }

        // System-Admin can only assign Student and Member roles
        return Role::whereIn('name', ['student', 'member'])->get();
    }
}
