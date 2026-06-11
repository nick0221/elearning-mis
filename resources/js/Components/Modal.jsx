import { useEffect, useRef } from 'react';

export default function Modal({
    show = false,
    closeable = true,
    onClose = () => {},
    children,
}) {
    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && closeable) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [closeOnEscape]);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0">
            <div
                className="fixed inset-0 transform transition-all"
                onClick={closeable ? onClose : undefined}
            >
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="relative mb-6 transform overflow-hidden rounded-lg bg-background shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-lg">
                {children}
            </div>
        </div>
    );
}
