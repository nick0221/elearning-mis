import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface NavItem {
    label: string;
    href: string;
    routeName: string;
    icon: React.ReactNode;
    visible: () => boolean;
}

export default function AuthenticatedLayout({
    header,
    children,
}: {
    header?: React.ReactNode;
    children: React.ReactNode;
}) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const {
        isSuperAdmin, isInstructor, isStudent,
        canManageUsers, canViewReports, canManageSettings,
        canTakeAssessments, canCreateAssessments, canGradeSubmissions,
    } = usePermission();

    const roleBadge = user?.roles?.[0] ?? 'user';

    const navItems: NavItem[] = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            routeName: 'dashboard',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
            visible: () => true,
        },
        {
            label: 'Course Catalog',
            href: route('courses.index'),
            routeName: 'courses.*',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
            visible: () => true,
        },
        {
            label: 'My Courses',
            href: route('courses.my'),
            routeName: 'courses.my',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
            visible: () => isStudent(),
        },
        {
            label: 'Assessments',
            href: route('assessments.index'),
            routeName: 'assessments.*',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            visible: () => canTakeAssessments() || canCreateAssessments() || canGradeSubmissions(),
        },
        {
            label: 'Discussions',
            href: route('discussions.index'),
            routeName: 'discussions.*',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
            visible: () => true,
        },
        {
            label: 'Announcements',
            href: route('announcements.index'),
            routeName: 'announcements.*',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
            visible: () => true,
        },
        {
            label: 'Users',
            href: route('users.index'),
            routeName: 'users.*',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
            visible: () => canManageUsers(),
        },
        {
            label: 'Reports',
            href: route('reports.index'),
            routeName: 'reports.*',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
            visible: () => canViewReports(),
        },
        {
            label: 'Settings',
            href: route('settings.index'),
            routeName: 'settings.*',
            icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            visible: () => canManageSettings(),
        },
    ].filter((item) => item.visible());

    const isActive = (routeName: string) => {
        if (routeName.endsWith('.*')) {
            const prefix = routeName.slice(0, -2);
            return route().current(prefix + '*');
        }
        return route().current(routeName);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowUserDropdown(false);
                setSidebarOpen(false);
                setShowMobileUserMenu(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
        setShowMobileUserMenu(false);
    }, [usePage().props]);

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center gap-3 border-b border-sidebar-accent/20 px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <ApplicationLogo className="h-8 w-8 fill-current text-sidebar-foreground" />
                        <span className="text-sm font-bold">E-Learning MIS</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const active = isActive(item.routeName);
                            return (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                            active
                                                ? 'bg-sidebar-accent/20 text-sidebar-accent'
                                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground'
                                        }`}
                                    >
                                        <span className={active ? 'text-sidebar-accent' : 'text-sidebar-foreground/50'}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="border-t border-sidebar-accent/20 px-3 py-4">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent/20 text-xs font-bold text-sidebar-accent">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 truncate">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-sidebar-foreground/50 capitalize">{roleBadge}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted lg:hidden"
                        aria-label="Open sidebar"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1" />

                    {/* Desktop user dropdown */}
                    <div className="hidden sm:block" ref={userDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            aria-expanded={showUserDropdown}
                            aria-haspopup="true"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden md:inline">{user?.name}</span>
                            <svg
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`}
                                fill="currentColor" viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {showUserDropdown && (
                            <div className="absolute right-4 z-50 mt-2 w-56 origin-top-right rounded-lg bg-popover shadow-lg ring-1 ring-border focus:outline-none">
                                <div className="border-b border-border px-4 py-3">
                                    <p className="text-sm font-medium text-popover-foreground">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                                        {roleBadge}
                                    </span>
                                </div>
                                <div className="py-1">
                                    <Link
                                        href={route('profile.edit')}
                                        onClick={() => setShowUserDropdown(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Profile
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={() => setShowUserDropdown(false)}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile user menu toggle */}
                    <div className="sm:hidden">
                        <button
                            onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </button>
                    </div>
                </header>

                {/* Mobile user dropdown panel */}
                {showMobileUserMenu && (
                    <div className="border-b border-border bg-card px-4 py-3 sm:hidden">
                        <div className="mb-2">
                            <p className="text-sm font-medium text-foreground">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                            <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                                {roleBadge}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route('profile.edit')}
                                onClick={() => setShowMobileUserMenu(false)}
                                className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80"
                            >
                                Profile
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setShowMobileUserMenu(false)}
                                className="rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                )}

                {/* Page header */}
                {header && (
                    <div className="border-b border-border bg-muted/30">
                        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </div>
                )}

                {/* Page content */}
                <main>{children}</main>
            </div>
        </div>
    );
}
