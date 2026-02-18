import { useCallback, useEffect, useState } from 'react';

type Appearance = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(appearance: Appearance) {
    const resolved = appearance === 'system' ? getSystemTheme() : appearance;
    document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function useAppearance() {
    const [appearance, setAppearanceState] = useState<Appearance>(() => {
        return (localStorage.getItem('appearance') as Appearance) || 'system';
    });

    useEffect(() => {
        applyTheme(appearance);
    }, [appearance]);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        function handler() {
            if (appearance === 'system') applyTheme('system');
        }
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [appearance]);

    const setAppearance = useCallback((value: Appearance) => {
        setAppearanceState(value);
        localStorage.setItem('appearance', value);
        applyTheme(value);
    }, []);

    const cycle = useCallback(() => {
        const order: Appearance[] = ['light', 'dark', 'system'];
        const next = order[(order.indexOf(appearance) + 1) % order.length];
        setAppearance(next);
    }, [appearance, setAppearance]);

    return { appearance, setAppearance, cycle };
}
