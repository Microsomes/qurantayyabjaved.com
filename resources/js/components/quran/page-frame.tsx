import type { ReactNode } from 'react';

interface PageFrameProps {
    children: ReactNode;
}

export function PageFrame({ children }: PageFrameProps) {
    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="rounded-2xl border border-amber-200/60 bg-[var(--color-quran-bg)] p-6 shadow-sm sm:p-8 md:p-10 dark:border-amber-900/40 dark:bg-[var(--color-quran-bg-dark)]">
                {children}
            </div>
        </div>
    );
}
