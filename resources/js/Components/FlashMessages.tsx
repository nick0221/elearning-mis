import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Toast from './Toast';

interface Flash {
    success?: string;
    error?: string;
}

export default function FlashMessages() {
    const { flash } = usePage<{ flash: Flash }>().props;
    const [queue, setQueue] = useState<Array<{ id: number; message: string; type: 'success' | 'error' }>>([]);

    useEffect(() => {
        const id = Date.now();
        if (flash.success) {
            setQueue((q) => [...q, { id, message: flash.success, type: 'success' }]);
        } else if (flash.error) {
            setQueue((q) => [...q, { id, message: flash.error, type: 'error' }]);
        }
    }, [flash]);

    const remove = (id: number) => setQueue((q) => q.filter((t) => t.id !== id));

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {queue.map((t) => (
                <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
            ))}
        </div>
    );
}
