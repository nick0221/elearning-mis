import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
    permissions: string[];
}

interface PageProps {
    auth: {
        user: AuthUser | null;
    };
}

export function usePermission() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const can = useMemo(() => (permission: string): boolean => {
        return user?.permissions?.includes(permission) ?? false;
    }, [user]);

    const hasRole = useMemo(() => (role: string): boolean => {
        return user?.roles?.includes(role) ?? false;
    }, [user]);

    const hasAnyRole = useMemo(() => (...roles: string[]): boolean => {
        return roles.some((role) => hasRole(role));
    }, [hasRole]);

    const isSuperAdmin = useMemo(() => (): boolean => hasRole('super-admin'), [hasRole]);
    const isInstructor = useMemo(() => (): boolean => hasRole('instructor'), [hasRole]);
    const isStudent = useMemo(() => (): boolean => hasRole('student'), [hasRole]);

    return { user, can, hasRole, hasAnyRole, isSuperAdmin, isInstructor, isStudent };
}
