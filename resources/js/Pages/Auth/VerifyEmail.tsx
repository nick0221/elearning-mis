import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify email" />

            <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
                    <svg className="h-6 w-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-foreground">Verify your email</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Thanks for signing up! Before you get started, please verify your email address by clicking the link we sent you.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mt-4 rounded-md bg-success/10 p-3 text-sm font-medium text-success">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
                <PrimaryButton className="w-full justify-center gap-2" disabled={processing}>
                    {processing ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending...
                        </>
                    ) : (
                        'Resend verification email'
                    )}
                </PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="block w-full text-center text-sm text-muted-foreground underline hover:text-foreground"
                >
                    Log out
                </Link>
            </form>
        </GuestLayout>
    );
}
