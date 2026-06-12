import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bg = type === 'success' ? 'bg-success' : 'bg-destructive';
    const icon = type === 'success' ? '✓' : '✕';

    return (
        <div
            className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ${bg} ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">{icon}</span>
            {message}
            <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-2 text-white/70 hover:text-white">&times;</button>
        </div>
    );
}
