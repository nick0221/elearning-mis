export default function Checkbox({
    name,
    value,
    checked,
    className,
    ...props
}) {
    return (
        <input
            {...props}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            className={
                'rounded border-input text-accent focus:ring-ring focus:ring-offset-2 ' +
                className
            }
        />
    );
}
