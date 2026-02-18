import { useEffect, useRef } from 'react';

interface SwipeHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
}

export function useSwipe(ref: React.RefObject<HTMLElement | null>, handlers: SwipeHandlers) {
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        function handleTouchStart(e: TouchEvent) {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }

        function handleTouchEnd(e: TouchEvent) {
            if (!touchStart.current) return;

            const dx = e.changedTouches[0].clientX - touchStart.current.x;
            const dy = e.changedTouches[0].clientY - touchStart.current.y;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (absDx > 50 && absDx > absDy * 1.5) {
                if (dx > 0) {
                    handlers.onSwipeRight?.();
                } else {
                    handlers.onSwipeLeft?.();
                }
            }

            touchStart.current = null;
        }

        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [ref, handlers]);
}
