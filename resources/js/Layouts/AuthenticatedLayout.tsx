import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function AuthenticatedLayout({
    header,
    children,
}: {
    header?: React.ReactNode;
    children: React.ReactNode;
}) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    // Close user dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown on Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowUserDropdown(false);
                setShowingNavigationDropdown(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-sidebar text-sidebar-foreground">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-sidebar-foreground" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <Link
                                    href={route('dashboard')}
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                        route().current('dashboard')
                                            ? 'border-sidebar-accent text-sidebar-accent'
                                            : 'border-transparent text-sidebar-foreground hover:border-sidebar-accent hover:text-sidebar-accent'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* User Dropdown - Desktop */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3" ref={userDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="inline-flex items-center rounded-md border border-transparent bg-secondary px-3 py-2 text-sm font-medium leading-4 text-secondary-foreground transition duration-150 ease-in-out hover:text-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-sidebar"
                                    aria-expanded={showUserDropdown}
                                    aria-haspopup="true"
                                >
                                    {user?.name}

                                    <svg
                                        className={`-me-0.5 ms-2 h-4 w-4 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserDropdown && (
                                    <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-border focus:outline-none">
                                        <div className="border-b border-border px-4 py-3">
                                            <p className="text-sm font-medium text-popover-foreground">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href={route('profile.edit')}
                                                onClick={() => setShowUserDropdown(false)}
                                                className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="block w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                                            >
                                                Log Out
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((previousState) => !previousState)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-sidebar-foreground transition duration-150 ease-in-out hover:bg-secondary hover:text-sidebar-accent focus:bg-secondary focus:text-sidebar-accent focus:outline-none"
                                aria-expanded={showingNavigationDropdown}
                                aria-label="Toggle navigation menu"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            <Link
                                href={route('dashboard')}
                                onClick={() => setShowingNavigationDropdown(false)}
                                className={`block border-l-4 py-2 ps-3 text-base font-medium transition duration-150 ease-in-out ${
                                    route().current('dashboard')
                                        ? 'border-sidebar-accent text-sidebar-accent'
                                        : 'border-transparent text-sidebar-foreground hover:border-sidebar-accent hover:text-sidebar-accent'
                                }`}
                            >
                                Dashboard
                            </Link>
                        </div>

                        <div className="border-t border-border pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-sidebar-foreground">
                                    {user?.name}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    {user?.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <Link
                                    href={route('profile.edit')}
                                    onClick={() => setShowingNavigationDropdown(false)}
                                    className="block px-4 py-2 text-base font-medium text-sidebar-foreground hover:bg-secondary hover:text-sidebar-accent"
                                >
                                    Profile
                                </Link>
                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                    className="block w-full px-4 py-2 text-start text-base font-medium text-sidebar-foreground hover:bg-secondary hover:text-sidebar-accent"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="border-b border-border bg-muted/50">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
