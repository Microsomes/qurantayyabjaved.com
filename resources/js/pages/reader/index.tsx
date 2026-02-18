import { PageNavigation } from '@/components/quran/page-navigation';
import { PageSkeleton } from '@/components/quran/page-skeleton';
import { QuranPage } from '@/components/quran/quran-page';
import { ProgressBar } from '@/components/reader/progress-bar';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useQuranPage } from '@/hooks/use-quran-page';
import { useReadingSession } from '@/hooks/use-reading-session';
import { useSwipe } from '@/hooks/use-swipe';
import { Head, Link, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ReaderIndex() {
    const { activeProfile, initialPage } = usePage<{ initialPage?: number }>().props;
    const profileId = activeProfile?.id;

    const [currentPage, setCurrentPage] = useState(initialPage || activeProfile?.current_page || 1);
    const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, loading, error } = useQuranPage(currentPage);

    // Load saved progress on mount
    useEffect(() => {
        if (!profileId) return;
        fetch(`/api/progress/${profileId}`, { credentials: 'same-origin' })
            .then((r) => r.json())
            .then((p) => {
                if (!initialPage && p.current_page) {
                    setCurrentPage(p.current_page);
                }
                if (p.last_word_index !== null) {
                    setSelectedWordIndex(p.last_word_index);
                }
            })
            .catch(() => {});
    }, [profileId, initialPage]);

    // Auto-save
    useAutoSave({
        profileId: profileId!,
        currentPage,
        lastWordIndex: selectedWordIndex,
        enabled: !!profileId,
    });

    // Reading session heartbeat
    useReadingSession(profileId!, !!profileId);

    // Page navigation
    const goToPage = useCallback(
        (page: number) => {
            if (page < 1 || page > 604) return;
            setCurrentPage(page);
            setSelectedWordIndex(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.replaceState({}, '', `/read/${page}`);
        },
        [],
    );

    // Keyboard navigation
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.target instanceof HTMLInputElement) return;
            // RTL: ArrowRight = previous page (lower number), ArrowLeft = next page (higher number)
            if (e.key === 'ArrowRight') goToPage(currentPage - 1);
            if (e.key === 'ArrowLeft') goToPage(currentPage + 1);
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [currentPage, goToPage]);

    // Swipe navigation (RTL: swipe right = prev, swipe left = next)
    useSwipe(containerRef, {
        onSwipeRight: () => goToPage(currentPage - 1),
        onSwipeLeft: () => goToPage(currentPage + 1),
    });

    // Scroll to selected word after page loads
    useEffect(() => {
        if (selectedWordIndex === null || loading) return;
        const el = document.querySelector(`[data-word-index="${selectedWordIndex}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedWordIndex, loading, currentPage]);

    const surahName = data?.surahs?.[0]?.englishName ?? '';

    return (
        <>
            <Head title={`Page ${currentPage}${surahName ? ` - ${surahName}` : ''}`} />

            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
                {/* Top bar */}
                <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
                    <ProgressBar currentPage={currentPage} />
                    <div className="flex items-center justify-between px-4 py-2">
                        <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div className="text-center">
                            {data?.surahs?.map((s) => (
                                <span key={s.number} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {s.englishName}
                                    {data.surahs.length > 1 ? ' ' : ''}
                                </span>
                            ))}
                        </div>
                        <Link href="/stats" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main ref={containerRef} className="flex-1 px-4 py-6">
                    {loading && <PageSkeleton />}

                    {error && (
                        <div className="flex flex-col items-center gap-4 py-20">
                            <p className="text-red-500">Failed to load page</p>
                            <button onClick={() => window.location.reload()} className="text-emerald-600 underline">
                                Retry
                            </button>
                        </div>
                    )}

                    {data && !loading && (
                        <QuranPage data={data} selectedWordIndex={selectedWordIndex} onWordClick={setSelectedWordIndex} />
                    )}
                </main>

                {/* Bottom navigation */}
                <nav className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
                    <PageNavigation currentPage={currentPage} juz={data?.juz ?? null} onPageChange={goToPage} />
                </nav>
            </div>
        </>
    );
}
