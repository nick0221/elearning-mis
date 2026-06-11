import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <GuestLayout>
            <Head title="Welcome" />

            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-foreground">E-Learning MIS</h1>
                <p className="mt-2 text-muted-foreground">Management Information System</p>

                <div className="mt-6 flex justify-center gap-4">
                    <Link
                        href={route('login')}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Log in
                    </Link>
                    <Link
                        href={route('register')}
                        className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
