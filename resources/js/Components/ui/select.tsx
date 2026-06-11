interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

function Select({ className = '', children, ref, ...props }: SelectProps) {
    return (
        <select
            className={
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
                className
            }
            ref={ref}
            {...props}
        >
            {children}
        </select>
    );
}

Select.displayName = 'Select';

export { Select };
