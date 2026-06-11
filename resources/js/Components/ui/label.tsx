import { useRef } from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function Label({ className = '', ref, ...props }: LabelProps) {
    const localRef = useRef<HTMLLabelElement>(null);

    const setRef = (el: HTMLLabelElement | null) => {
        localRef.current = el;
        if (typeof ref === 'function') {
            ref(el);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLLabelElement | null>).current = el;
        }
    };

    return (
        <label
            ref={setRef}
            className={
                'text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ' +
                className
            }
            {...props}
        />
    );
}

Label.displayName = 'Label';

export { Label };
