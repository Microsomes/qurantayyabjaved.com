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
    const latestRef = useRef({ profileId, currentPage, lastWordIndex });

    // Keep latest values in ref so cleanup/beacon can access them
    latestRef.current = { profileId, currentPage, lastWordIndex };

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

    // Flush unsaved progress on unmount (SPA navigation) and page unload
    useEffect(() => {
        if (!enabled) return;

        function flushProgress() {
            const { profileId: pid, currentPage: page, lastWordIndex: word } = latestRef.current;
            const key = `${page}-${word}`;
            if (key === lastSavedRef.current) return;

            // Use fetch with keepalive so it survives page unload and includes CSRF headers
            fetch(`/api/progress/${pid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
                credentials: 'same-origin',
                keepalive: true,
                body: JSON.stringify({ current_page: page, last_word_index: word }),
            }).catch(() => {});
        }

        window.addEventListener('beforeunload', flushProgress);

        return () => {
            window.removeEventListener('beforeunload', flushProgress);
            // Component unmounting (SPA navigation) — flush now
            flushProgress();
        };
    }, [enabled]);

    return { save };
}
