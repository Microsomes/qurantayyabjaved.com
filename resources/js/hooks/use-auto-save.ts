import { csrfHeaders } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveOptions {
    profileId: number;
    currentPage: number;
    lastWordIndex: number | null;
    enabled: boolean;
}

export function useAutoSave({ profileId, currentPage, lastWordIndex, enabled }: AutoSaveOptions) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedRef = useRef<string>('');
    const latestRef = useRef({ profileId, currentPage, lastWordIndex });
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

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

    // Manual save — always fires, returns success/failure via status
    const saveManually = useCallback(async () => {
        setSaveStatus('saving');
        if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);

        try {
            const res = await fetch(`/api/progress/${profileId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
                credentials: 'same-origin',
                body: JSON.stringify({ current_page: currentPage, last_word_index: lastWordIndex }),
            });
            if (!res.ok) throw new Error();
            lastSavedRef.current = `${currentPage}-${lastWordIndex}`;
            setSaveStatus('saved');
        } catch {
            setSaveStatus('error');
        }

        statusTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
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

    // Cleanup status timeout on unmount
    useEffect(() => {
        return () => {
            if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
        };
    }, []);

    return { save, saveManually, saveStatus };
}
