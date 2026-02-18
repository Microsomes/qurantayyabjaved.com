import { LeaderboardTable } from '@/components/gamification/leaderboard-table';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

type Period = 'daily' | 'weekly' | 'all';

export default function LeaderboardIndex() {
    const { activeProfile } = usePage().props;
    const [period, setPeriod] = useState<Period>('all');
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = useCallback(async (p: Period) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/gamification/leaderboard?period=${p}`, { credentials: 'same-origin' });
            const data = await res.json();
            setEntries(data);
        } catch {
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard(period);
    }, [period, fetchLeaderboard]);

    const tabs: { key: Period; label: string }[] = [
        { key: 'daily', label: 'Today' },
        { key: 'weekly', label: 'This Week' },
        { key: 'all', label: 'All Time' },
    ];

    return (
        <>
            <Head title="Leaderboard" />
            <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
                <header className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <div className="mx-auto flex max-w-2xl items-center justify-between">
                        <Link href="/read" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">Leaderboard</h1>
                        <Link href="/stats" className="text-sm text-emerald-600 dark:text-emerald-400">
                            My Stats
                        </Link>
                    </div>
                </header>

                <div className="mx-auto max-w-2xl px-4 pt-6">
                    {/* Period Tabs */}
                    <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setPeriod(tab.key)}
                                className={cn(
                                    'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    period === tab.key
                                        ? 'bg-white text-gray-800 shadow dark:bg-gray-700 dark:text-gray-200'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400',
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                        </div>
                    ) : (
                        <LeaderboardTable entries={entries} currentProfileId={activeProfile?.id ?? null} />
                    )}
                </div>
            </div>
        </>
    );
}
