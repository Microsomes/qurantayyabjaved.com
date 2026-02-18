import { csrfHeaders } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export function useReadingSession(profileId: number, enabled: boolean) {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!enabled) return;

        function sendHeartbeat() {
            if (document.hidden) return;

            fetch(`/api/progress/${profileId}/heartbeat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
                credentials: 'same-origin',
            }).catch(() => {});
        }

        intervalRef.current = setInterval(sendHeartbeat, 30000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [profileId, enabled]);
}
