import { Link } from '@inertiajs/react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
    return (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-1">
                    {index > 0 && <span>/</span>}
                    {item.href ? (
                        <Link href={item.href} className="hover:text-foreground transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
