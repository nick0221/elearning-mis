import { Link } from '@inertiajs/react';

interface PageHeaderProps {
    title: string;
    description?: string;
    section?: string;
    icon?: React.ReactNode;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    actions?: React.ReactNode;
}

export default function PageHeader({ title, description, section, icon, breadcrumbs, actions }: PageHeaderProps) {
    return (
        <div>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    {breadcrumbs.map((item, index) => (
                        <span key={index} className="flex items-center gap-1.5">
                            {index > 0 && (
                                <svg className="h-3.5 w-3.5 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            {item.href ? (
                                <Link href={item.href} className="transition-colors hover:text-foreground">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-foreground">{item.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    {icon && (
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            {icon}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
                            {section && (
                                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    {section}
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                </div>
                {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}
