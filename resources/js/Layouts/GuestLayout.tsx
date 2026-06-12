import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/50 to-background">
            {/* Header */}
            <div className="flex items-center justify-center pt-8">
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo className="h-10 w-10 fill-current text-primary" />
                    <div className="text-left">
                        <h1 className="text-lg font-bold text-foreground">E-Learning MIS</h1>
                        <p className="text-xs text-muted-foreground -mt-0.5">Management Information System</p>
                    </div>
                </Link>
            </div>

            {/* Card */}
            <div className="mt-6 flex-1 flex items-start justify-center px-4 pb-8 sm:pt-4">
                <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-primary/5">
                    <div className="px-6 py-6 sm:px-8 sm:py-8">
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pb-6 text-center">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} E-Learning MIS. All rights reserved.
                </p>
            </div>
        </div>
    );
}
