import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: Array<{ name: string }>;
    created_at: string;
}

interface PaginatedData {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function Index({ users, filters }: { users: PaginatedData; filters: { search?: string; role?: string } }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('users.index'), { search }, { preserveState: true });
    };

    const handleRoleFilter = (role: string) => {
        router.get(route('users.index'), { search, role }, { preserveState: true });
    };

    const roleColors: Record<string, string> = {
        'super-admin': 'bg-destructive/10 text-destructive',
        'system-admin': 'bg-info/10 text-info',
        'instructor': 'bg-accent/10 text-accent-foreground',
        'student': 'bg-success/10 text-success',
        'member': 'bg-muted text-muted-foreground',
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Search
                            </button>
                        </form>

                        <Link
                            href={route('users.create')}
                            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                        >
                            Create User
                        </Link>
                    </div>

                    <div className="mb-4 flex gap-2">
                        {['super-admin', 'system-admin', 'instructor', 'student', 'member'].map((role) => (
                            <button
                                key={role}
                                onClick={() => handleRoleFilter(role)}
                                className={`rounded-full px-3 py-1 text-xs font-medium ${roleColors[role] || 'bg-muted text-muted-foreground'} ${
                                    filters.role === role ? 'ring-2 ring-ring' : ''
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/50">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-foreground">{user.name}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${roleColors[user.roles?.[0]?.name] || 'bg-muted text-muted-foreground'}`}>
                                                {user.roles?.[0]?.name || 'No role'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.is_active ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <Link href={route('users.edit', user.id)} className="text-accent hover:text-accent/80 mr-3">Edit</Link>
                                            <Link href={route('users.show', user.id)} className="text-info hover:text-info/80">View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.last_page > 1 && (
                        <div className="mt-4 flex justify-center gap-1">
                            {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={route('users.index', { page, search, role: filters.role })}
                                    className={`rounded-md px-3 py-2 text-sm ${page === users.current_page ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
