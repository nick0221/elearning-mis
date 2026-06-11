import { Link } from '@inertiajs/react';
import BreadcrumbNav from './BreadcrumbNav';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    actions?: React.ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
    return (
        <div className="mb-6">
            {breadcrumbs && <BreadcrumbNav items={breadcrumbs} />}
            <div className="mt-2 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}
