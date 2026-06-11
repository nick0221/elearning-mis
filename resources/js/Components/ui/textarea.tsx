import { useRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea({ className = '', ref, ...props }: TextareaProps) {
    const localRef = useRef<HTMLTextAreaElement>(null);

    const setRef = (el: HTMLTextAreaElement | null) => {
        localRef.current = el;
        if (typeof ref === 'function') {
            ref(el);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
        }
    };

    return (
        <textarea
            className={
                'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
                className
            }
            ref={setRef}
            {...props}
        />
    );
}

Textarea.displayName = 'Textarea';

export { Textarea };
