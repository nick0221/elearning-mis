import { forwardRef } from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={
                    'text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ' +
                    className
                }
                {...props}
            />
        );
    }
);

Label.displayName = 'Label';

export { Label };
