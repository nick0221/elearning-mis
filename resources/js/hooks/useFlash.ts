import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface FlashMessages {
    success: string | null;
    error: string | null;
}

export function useFlash() {
    const { flash } = usePage<{ flash: FlashMessages }>().props;

    useEffect(() => {
        if (flash.success) {
            // Toast notification would go here
            console.log('Success:', flash.success);
        }
        if (flash.error) {
            console.error('Error:', flash.error);
        }
    }, [flash]);

    return flash;
}
