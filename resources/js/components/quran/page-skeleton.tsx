export function PageSkeleton() {
    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="animate-pulse rounded-2xl border border-amber-200/60 bg-[var(--color-quran-bg)] p-6 sm:p-8 md:p-10 dark:border-amber-900/40 dark:bg-[var(--color-quran-bg-dark)]">
                <div dir="rtl" className="space-y-6">
                    {/* Surah header skeleton */}
                    <div className="flex justify-center">
                        <div className="h-16 w-64 rounded-xl bg-amber-100 dark:bg-amber-900/30" />
                    </div>

                    {/* Text line skeletons */}
                    {Array.from({ length: 12 }, (_, i) => (
                        <div key={i} className="flex justify-end gap-2">
                            <div
                                className="h-8 rounded bg-gray-200 dark:bg-gray-700"
                                style={{ width: `${65 + Math.random() * 30}%` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
