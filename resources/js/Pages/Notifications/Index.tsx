import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import { Bell } from '@/Components/Icons';
import { Head, router, usePage } from '@inertiajs/react';
import { cn, formatRelativeTime } from '@/lib/utils';

interface NotificationData {
    id: string;
    type: string;
    data: {
        type: string;
        message: string;
        url: string;
        [key: string]: unknown;
    };
    read_at: string | null;
    created_at: string;
}

interface PaginatedData {
    data: NotificationData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

function NotificationIcon({ type }: { type: string }) {
    const iconMap: Record<string, string> = {
        discussion_replied: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        submission_graded: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        course_completed: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        new_announcement: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
    };

    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconMap[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
        </svg>
    );
}

function colorForType(type: string): string {
    switch (type) {
        case 'discussion_replied': return 'text-blue-500 bg-blue-500/10';
        case 'submission_graded': return 'text-emerald-500 bg-emerald-500/10';
        case 'course_completed': return 'text-amber-500 bg-amber-500/10';
        case 'new_announcement': return 'text-purple-500 bg-purple-500/10';
        default: return 'text-muted-foreground bg-muted';
    }
}

export default function Index({ notifications, unreadCount }: {
    notifications: PaginatedData;
    unreadCount: number;
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="Notifications"
                        description="Stay updated with your course activity"
                        section="Main"
                        actions={
                            unreadCount > 0 && (
                                <button
                                    onClick={() => router.put(route('notifications.read-all'))}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Mark all as read
                                </button>
                            )
                        }
                    />

                    <div className="text-sm text-muted-foreground">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                            : 'No unread notifications'}
                    </div>

                    {notifications.data.length === 0 ? (
                        <EmptyState
                            title="No notifications yet"
                            description="Notifications will appear here when someone replies to your discussions, your submissions are graded, or you complete a course."
                            icon={<Bell className="h-12 w-12" />}
                        />
                    ) : (
                        <div className="space-y-3">
                            {notifications.data.map((notification) => {
                                const isUnread = !notification.read_at;
                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            'group relative flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md',
                                            isUnread ? 'border-accent/20' : 'border-border'
                                        )}
                                    >
                                        {isUnread && (
                                            <span className="absolute -left-0.5 top-3 h-4 w-1 rounded-full bg-accent" />
                                        )}
                                        <div className={cn(
                                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                                            colorForType(notification.data.type)
                                        )}>
                                            <NotificationIcon type={notification.data.type} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={cn(
                                                'text-sm leading-relaxed',
                                                isUnread ? 'font-medium text-foreground' : 'text-muted-foreground'
                                            )}>
                                                {notification.data.message}
                                            </p>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>{formatRelativeTime(notification.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <a
                                                href={notification.data.url}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (isUnread) {
                                                        router.put(route('notifications.read', notification.id), {}, {
                                                            onSuccess: () => router.visit(notification.data.url),
                                                        });
                                                    } else {
                                                        router.visit(notification.data.url);
                                                    }
                                                }}
                                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
                                            >
                                                View
                                            </a>
                                            <button
                                                onClick={() => router.delete(route('notifications.destroy', notification.id))}
                                                className="rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                                                title="Dismiss"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <Pagination links={notifications.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
