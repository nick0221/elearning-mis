interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function Label({ className = '', ref, ...props }: LabelProps) {
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

Label.displayName = 'Label';

export { Label };
