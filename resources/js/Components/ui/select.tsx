import { useRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

function Select({ className = '', children, ref, ...props }: SelectProps) {
    const localRef = useRef<HTMLSelectElement>(null);

    const setRef = (el: HTMLSelectElement | null) => {
        localRef.current = el;
        if (typeof ref === 'function') {
            ref(el);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLSelectElement | null>).current = el;
        }
    };

    return (
        <select
            className={
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
                className
            }
            ref={setRef}
            {...props}
        >
            {children}
        </select>
    );
}

Select.displayName = 'Select';

export { Select };
