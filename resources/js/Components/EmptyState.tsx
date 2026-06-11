interface EmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && (
                <div className="mb-4 text-muted-foreground/50">{icon}</div>
            )}
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
