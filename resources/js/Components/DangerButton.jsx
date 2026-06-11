export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md bg-destructive px-4 py-2 text-xs font-semibold uppercase tracking-widest text-destructive-foreground transition duration-150 ease-in-out hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:bg-destructive/80 disabled:opacity-25 ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
