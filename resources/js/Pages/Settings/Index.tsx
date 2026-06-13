import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/PageHeader';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Transition } from '@headlessui/react';

interface Setting {
    key: string;
    value: string | null;
    group: string;
    type: string;
}

const groupIcons: Record<string, React.ReactNode> = {
    general: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    storage: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    email: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
};

export default function Index({ settings }: { settings: Record<string, Setting> }) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        settings: [
            { key: 'app_name', value: settings.app_name?.value || 'E-Learning MIS', group: 'general', type: 'text' },
            { key: 'app_tagline', value: settings.app_tagline?.value || 'Management Information System', group: 'general', type: 'text' },
            { key: 'default_role', value: settings.default_role?.value || 'student', group: 'general', type: 'select' },
            { key: 'allow_registration', value: settings.allow_registration?.value || 'true', group: 'general', type: 'toggle' },
            { key: 'maintenance_mode', value: settings.maintenance_mode?.value || 'false', group: 'general', type: 'toggle' },
            { key: 'maintenance_message', value: settings.maintenance_message?.value || 'We are currently performing maintenance. Please check back later.', group: 'general', type: 'textarea' },
            { key: 'max_upload_size', value: settings.max_upload_size?.value || '50', group: 'storage', type: 'number' },
            { key: 'allowed_file_types', value: settings.allowed_file_types?.value || 'pdf,docx,pptx,jpg,png,mp4,mp3', group: 'storage', type: 'text' },
            { key: 'smtp_host', value: settings.smtp_host?.value || '', group: 'email', type: 'text' },
            { key: 'smtp_port', value: settings.smtp_port?.value || '587', group: 'email', type: 'number' },
            { key: 'smtp_username', value: settings.smtp_username?.value || '', group: 'email', type: 'text' },
            { key: 'smtp_from_address', value: settings.smtp_from_address?.value || '', group: 'email', type: 'email' },
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
        general: { label: 'General', description: 'Basic application settings', items: data.settings.filter((s) => s.group === 'general') },
        storage: { label: 'Storage', description: 'File upload and storage settings', items: data.settings.filter((s) => s.group === 'storage') },
        email: { label: 'Email', description: 'SMTP and notification settings', items: data.settings.filter((s) => s.group === 'email') },
    };

    return (
        <AuthenticatedLayout >
            <Head title="Settings" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8 space-y-6">
                    <PageHeader
                        title="System Settings"
                    />
                    <form onSubmit={submit} className="space-y-6">
                        {Object.entries(groups).map(([group, { label, description, items }]) => (
                            <div key={group} className="rounded-lg border border-border bg-card p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        {groupIcons[group]}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-foreground">{label}</h3>
                                        <p className="text-sm text-muted-foreground">{description}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.key} className="space-y-2">
                                            <Label htmlFor={item.key}>
                                                {item.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </Label>
                                            {item.type === 'toggle' ? (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateSetting(item.key, item.value === 'true' ? 'false' : 'true')}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                            item.value === 'true' ? 'bg-accent' : 'bg-muted'
                                                        }`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            item.value === 'true' ? 'translate-x-6' : 'translate-x-1'
                                                        }`} />
                                                    </button>
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.value === 'true' ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </div>
                                            ) : item.type === 'select' ? (
                                                <Select id={item.key} value={item.value || ''} onChange={(e) => updateSetting(item.key, e.target.value)}>
                                                    <option value="student">Student</option>
                                                    <option value="member">Member</option>
                                                </Select>
                                            ) : item.type === 'textarea' ? (
                                                <Textarea
                                                    id={item.key}
                                                    value={item.value || ''}
                                                    onChange={(e) => updateSetting(item.key, e.target.value)}
                                                    rows={3}
                                                />
                                            ) : (
                                                <Input
                                                    id={item.key}
                                                    type={item.type}
                                                    value={item.value || ''}
                                                    onChange={(e) => updateSetting(item.key, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-end gap-3">
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-success">Saved.</p>
                            </Transition>
                            <button type="submit" disabled={processing} className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
