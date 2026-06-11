import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

interface Setting {
    key: string;
    value: string | null;
    group: string;
    type: string;
}

export default function Index({ settings }: { settings: Record<string, Setting> }) {
    const { data, setData, put, processing } = useForm({
        settings: [
            { key: 'app_name', value: settings.app_name?.value || 'E-Learning MIS', group: 'general', type: 'text' },
            { key: 'app_tagline', value: settings.app_tagline?.value || '', group: 'general', type: 'text' },
            { key: 'default_role', value: settings.default_role?.value || 'student', group: 'general', type: 'select' },
            { key: 'allow_registration', value: settings.allow_registration?.value || 'true', group: 'general', type: 'toggle' },
            { key: 'max_upload_size', value: settings.max_upload_size?.value || '50', group: 'storage', type: 'number' },
            { key: 'smtp_host', value: settings.smtp_host?.value || '', group: 'email', type: 'text' },
            { key: 'smtp_port', value: settings.smtp_port?.value || '587', group: 'email', type: 'number' },
        ],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('settings.update'));
    };

    const updateSetting = (key: string, value: string) => {
        setData('settings', data.settings.map((s) => s.key === key ? { ...s, value } : s));
    };

    const groups = {
        general: data.settings.filter((s) => s.group === 'general'),
        storage: data.settings.filter((s) => s.group === 'storage'),
        email: data.settings.filter((s) => s.group === 'email'),
    };

    const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">System Settings</h2>}>
            <Head title="Settings" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {Object.entries(groups).map(([group, items]) => (
                            <div key={group} className="rounded-lg border border-border bg-card p-6">
                                <h3 className="mb-4 text-lg font-medium text-foreground capitalize">{group} Settings</h3>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.key}>
                                            <label className="block text-sm font-medium text-foreground">{item.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</label>
                                            {item.type === 'toggle' ? (
                                                <label className="mt-1 flex items-center gap-2">
                                                    <input type="checkbox" checked={item.value === 'true'} onChange={(e) => updateSetting(item.key, e.target.checked ? 'true' : 'false')} className="h-4 w-4 rounded border-border text-accent focus:ring-ring" />
                                                    <span className="text-sm text-muted-foreground">{item.value === 'true' ? 'Enabled' : 'Disabled'}</span>
                                                </label>
                                            ) : item.type === 'select' ? (
                                                <select value={item.value || ''} onChange={(e) => updateSetting(item.key, e.target.value)} className={inputClass}>
                                                    <option value="student">Student</option>
                                                    <option value="member">Member</option>
                                                </select>
                                            ) : (
                                                <input type={item.type} value={item.value || ''} onChange={(e) => updateSetting(item.key, e.target.value)} className={inputClass} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <button type="submit" disabled={processing} className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
