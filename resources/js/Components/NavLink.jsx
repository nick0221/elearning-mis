import { Link, usePage } from '@inertiajs/react';

export default function NavLink({
    active = false,
    current = false,
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active || current
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:border-accent hover:text-accent')
            }
        >
            {children}
        </Link>
    );
}
