import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

export default function Create({ roles }: { roles: Role[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-foreground">Create User</h2>}
        >
            <Head title="Create User" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-card shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground">Name</label>
                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
                                    {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Email</label>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
                                    {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Password</label>
                                    <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass} />
                                    {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Confirm Password</label>
                                    <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClass} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground">Role</label>
                                    <select value={data.role} onChange={(e) => setData('role', e.target.value)} className={inputClass}>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>{role.name}</option>
                                        ))}
                                    </select>
                                    {errors.role && <p className="mt-1 text-sm text-destructive">{errors.role}</p>}
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-border text-accent focus:ring-ring" />
                                    <label className="ms-2 text-sm text-foreground">Active</label>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <Link href={route('users.index')} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                    Cancel
                                </Link>
                                <button type="submit" disabled={processing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
