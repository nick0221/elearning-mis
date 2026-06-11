import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps {
        auth: {
            user: App.User | null;
        };
        flash: {
            success: string | null;
            error: string | null;
        };
    }
}
