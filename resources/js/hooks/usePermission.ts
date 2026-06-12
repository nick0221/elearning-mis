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
    const isSystemAdmin = useMemo(() => (): boolean => hasRole('system-admin'), [hasRole]);
    const isMember = useMemo(() => (): boolean => hasRole('member'), [hasRole]);

    // Permission checks for specific actions
    const canManageUsers = useMemo(() => (): boolean => can('manage users'), [can]);
    const canViewUserDirectory = useMemo(() => (): boolean => can('view user directory'), [can]);
    const canCreateCourses = useMemo(() => (): boolean => can('create/edit own courses'), [can]);
    const canEditAnyCourse = useMemo(() => (): boolean => can('edit/delete any course'), [can]);
    const canCreateAssessments = useMemo(() => (): boolean => can('create/edit/delete assessments'), [can]);
    const canTakeAssessments = useMemo(() => (): boolean => can('take/submit assessments'), [can]);
    const canGradeSubmissions = useMemo(() => (): boolean => can('grade submissions'), [can]);
    const canManageSettings = useMemo(() => (): boolean => can('manage system settings'), [can]);
    const canViewReports = useMemo(() => (): boolean => can('view system analytics') || can('view course analytics'), [can]);
    const canSendAnnouncements = useMemo(() => (): boolean => can('send course announcements') || can('broadcast system-wide notifications'), [can]);

    return {
        user,
        can,
        hasRole,
        hasAnyRole,
        isSuperAdmin,
        isInstructor,
        isStudent,
        isSystemAdmin,
        isMember,
        canManageUsers,
        canViewUserDirectory,
        canCreateCourses,
        canEditAnyCourse,
        canCreateAssessments,
        canTakeAssessments,
        canGradeSubmissions,
        canManageSettings,
        canViewReports,
        canSendAnnouncements,
    };
}
