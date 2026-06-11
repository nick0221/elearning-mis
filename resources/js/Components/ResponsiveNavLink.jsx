import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    as,
    method,
    children,
    ...props
}) {
    const Tag = as === 'button' ? 'button' : Link;

    return (
        <Tag
            {...(as === 'button' ? { method, ...props } : props)}
            className={
                'block w-full border-l-4 py-2 ps-3 text-start text-base font-medium transition duration-150 ease-in-out ' +
                (active
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-transparent text-muted-foreground hover:border-accent hover:bg-accent/10 hover:text-accent')
            }
        >
            {children}
        </Tag>
    );
}
