import { csrfHeaders } from '@/lib/utils';
import { useCallback, useEffect, useRef } from 'react';

interface AutoSaveOptions {
    profileId: number;
    currentPage: number;
    lastWordIndex: number | null;
    enabled: boolean;
}

export function useAutoSave({ profileId, currentPage, lastWordIndex, enabled }: AutoSaveOptions) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedRef = useRef<string>('');

    const save = useCallback(async () => {
        const key = `${currentPage}-${lastWordIndex}`;
        if (key === lastSavedRef.current) return;

        try {
            await fetch(`/api/progress/${profileId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
                credentials: 'same-origin',
                body: JSON.stringify({ current_page: currentPage, last_word_index: lastWordIndex }),
            });
            lastSavedRef.current = key;
        } catch {
            // Silent fail — will retry on next change
        }
    }, [profileId, currentPage, lastWordIndex]);

    useEffect(() => {
        if (!enabled) return;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(save, 1000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [save, enabled]);

    // Save on page unload
    useEffect(() => {
        if (!enabled) return;

        function handleBeforeUnload() {
            const key = `${currentPage}-${lastWordIndex}`;
            if (key === lastSavedRef.current) return;

            navigator.sendBeacon(
                `/api/progress/${profileId}`,
                new Blob(
                    [JSON.stringify({ current_page: currentPage, last_word_index: lastWordIndex })],
                    { type: 'application/json' },
                ),
            );
        }

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [profileId, currentPage, lastWordIndex, enabled]);

    return { save };
}
