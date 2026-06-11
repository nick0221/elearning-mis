export default function Dropdown({
    align = 'right',
    width = '48',
    contentClasses = 'py-1',
    children,
}) {
    return (
        <div className="relative inline-block text-left">
            {children}
        </div>
    );
}

Dropdown.Trigger = function DropdownTrigger({ children }) {
    return <>{children}</>;
};

Dropdown.Content = function DropdownContent({ align = 'right', width = '48', contentClasses = 'py-1', children }) {
    let widthClasses = 'w-48';
    if (width === '48') widthClasses = 'w-48';
    if (width === '64') widthClasses = 'w-64';
    if (width === '72') widthClasses = 'w-72';

    return (
        <div
            className={
                `absolute z-50 mt-2 ${widthClasses} origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-border focus:outline-none ` +
                (align === 'right' ? 'right-0' : 'left-0') +
                ' ' + contentClasses
            }
        >
            {children}
        </div>
    );
};

Dropdown.Link = function DropdownLink({ href, method = 'get', as = 'a', children, className = '', ...props }) {
    const Tag = as === 'button' ? 'button' : Link;

    return (
        <Tag
            {...(as === 'button' ? { method, ...props } : { href, ...props })}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-popover-foreground transition duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ' +
                className
            }
        >
            {children}
        </Tag>
    );
};
