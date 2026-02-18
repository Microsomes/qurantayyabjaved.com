import { AvatarProfile } from '@/components/ui/avatar-profile';
import { BadgeGrid } from '@/components/gamification/badge-grid';
import { StreakDisplay } from '@/components/gamification/streak-display';
import { XpBar } from '@/components/gamification/xp-bar';
import type { Badge, GamificationStats } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ALL_BADGES: Badge[] = [
    { slug: 'first_page', name: 'First Step', description: 'Read your first page', icon: 'book-open' },
    { slug: 'pages_10', name: 'Getting Started', description: 'Read 10 pages', icon: 'book-open' },
    { slug: 'pages_50', name: 'Consistent Reader', description: 'Read 50 pages', icon: 'book-open' },
    { slug: 'pages_100', name: 'Century Mark', description: 'Read 100 pages', icon: 'star' },
    { slug: 'pages_200', name: 'Halfway There', description: 'Read 200 pages', icon: 'star' },
    { slug: 'pages_300', name: 'Dedicated Reader', description: 'Read 300 pages', icon: 'star' },
    { slug: 'pages_400', name: 'Scholar', description: 'Read 400 pages', icon: 'award' },
    { slug: 'pages_500', name: 'Almost There', description: 'Read 500 pages', icon: 'award' },
    { slug: 'khatam', name: 'Khatam', description: 'Complete the entire Quran', icon: 'crown' },
    { slug: 'streak_3', name: 'Getting Warm', description: '3-day reading streak', icon: 'flame' },
    { slug: 'streak_7', name: 'Week Warrior', description: '7-day reading streak', icon: 'flame' },
    { slug: 'streak_14', name: 'Two Weeks Strong', description: '14-day reading streak', icon: 'flame' },
    { slug: 'streak_30', name: 'Monthly Master', description: '30-day reading streak', icon: 'flame' },
    { slug: 'streak_60', name: 'Unstoppable', description: '60-day reading streak', icon: 'zap' },
    { slug: 'streak_100', name: 'Century Streak', description: '100-day reading streak', icon: 'zap' },
    { slug: 'streak_365', name: 'Year of Devotion', description: '365-day reading streak', icon: 'trophy' },
    { slug: 'juz_1', name: 'Juz 1 Complete', description: 'Complete Juz Al-Fatihah', icon: 'check-circle' },
    { slug: 'juz_5', name: 'Juz 5 Complete', description: 'Complete Juz 5', icon: 'check-circle' },
    { slug: 'juz_10', name: 'Juz 10 Complete', description: 'Complete Juz 10', icon: 'check-circle' },
    { slug: 'juz_15', name: 'Juz 15 Complete', description: 'Complete Juz 15', icon: 'check-circle' },
    { slug: 'juz_20', name: 'Juz 20 Complete', description: 'Complete Juz 20', icon: 'check-circle' },
    { slug: 'juz_25', name: 'Juz 25 Complete', description: 'Complete Juz 25', icon: 'check-circle' },
    { slug: 'juz_30', name: 'Juz Amma Complete', description: 'Complete Juz Amma', icon: 'check-circle' },
    { slug: 'marathon_reader', name: 'Marathon Reader', description: 'Read 20+ pages in a day', icon: 'rocket' },
    { slug: 'night_owl', name: 'Night Owl', description: '60+ minutes in a session', icon: 'moon' },
    { slug: 'speed_reader', name: 'Speed Reader', description: '50+ pages in a day', icon: 'rocket' },
    { slug: 'deep_focus', name: 'Deep Focus', description: '120+ minutes in a session', icon: 'target' },
    { slug: 'bookworm', name: 'Bookworm', description: '30+ minutes in a session', icon: 'book' },
];

export default function StatsIndex() {
    const { activeProfile } = usePage().props;
    const [stats, setStats] = useState<GamificationStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeProfile?.id) return;
        fetch(`/api/gamification/${activeProfile.id}/stats`, { credentials: 'same-origin' })
            .then((r) => r.json())
            .then(setStats)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [activeProfile?.id]);

    if (loading) {
        return (
            <>
                <Head title="Stats" />
                <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                </div>
            </>
        );
    }

    if (!stats) {
        return (
            <>
                <Head title="Stats" />
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
                    <p className="text-gray-500">Failed to load stats</p>
                    <Link href="/read" className="text-emerald-600 underline">Back to reading</Link>
                </div>
            </>
        );
    }

    const earnedSlugs = new Set(stats.badges.map((b) => b.slug));

    function formatDuration(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    }

    return (
        <>
            <Head title="Stats" />
            <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <div className="mx-auto flex max-w-2xl items-center justify-between">
                        <Link href="/read" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">My Stats</h1>
                        <Link href="/leaderboard" className="text-sm text-emerald-600 dark:text-emerald-400">
                            Leaderboard
                        </Link>
                    </div>
                </header>

                <div className="mx-auto max-w-2xl space-y-6 px-4 pt-6">
                    {/* Profile */}
                    <div className="flex items-center gap-4">
                        <AvatarProfile name={stats.profile.name} size={64} />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{stats.profile.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Level {stats.xp.level}</p>
                        </div>
                    </div>

                    {/* XP */}
                    <XpBar
                        level={stats.xp.level}
                        totalXp={stats.xp.total}
                        xpForCurrentLevel={stats.xp.xp_for_current_level}
                        xpForNextLevel={stats.xp.xp_for_next_level}
                        progressToNext={stats.xp.progress_to_next}
                    />

                    {/* Streak */}
                    <StreakDisplay
                        currentStreak={stats.streak.current}
                        longestStreak={stats.streak.longest}
                        freezeCount={stats.streak.freeze_count}
                    />

                    {/* Reading Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <StatCard label="Pages Read" value={stats.reading.total_pages} />
                        <StatCard label="Completion" value={`${stats.reading.completion}%`} />
                        <StatCard label="Sessions" value={stats.reading.total_sessions} />
                        <StatCard label="Total Time" value={formatDuration(stats.reading.total_duration)} />
                    </div>

                    {/* Reading Heatmap */}
                    {stats.reading_history.length > 0 && (
                        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Recent Activity
                            </h3>
                            <div className="flex flex-wrap gap-1">
                                {stats.reading_history.map((day) => (
                                    <div
                                        key={day.date}
                                        className="h-6 w-6 rounded"
                                        style={{
                                            backgroundColor: getHeatColor(day.pages_count),
                                        }}
                                        title={`${day.date}: ${day.pages_count} pages, ${day.xp_earned} XP`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Badges */}
                    <div>
                        <h3 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-200">
                            Badges ({stats.badges.length}/{ALL_BADGES.length})
                        </h3>
                        <BadgeGrid allBadges={ALL_BADGES} earnedSlugs={earnedSlugs} />
                    </div>
                </div>
            </div>
        </>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    );
}

function getHeatColor(pages: number): string {
    if (pages >= 20) return '#059669';
    if (pages >= 10) return '#34d399';
    if (pages >= 5) return '#6ee7b7';
    if (pages >= 1) return '#a7f3d0';
    return '#e5e7eb';
}
