import { AvatarProfile } from '@/components/ui/avatar-profile';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    currentProfileId: number | null;
}

export function LeaderboardTable({ entries, currentProfileId }: LeaderboardTableProps) {
    if (entries.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                No reading activity yet. Start reading to appear on the leaderboard!
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 text-left text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        <th className="px-4 py-3 font-medium">#</th>
                        <th className="px-4 py-3 font-medium">Reader</th>
                        <th className="px-4 py-3 text-right font-medium">XP</th>
                        <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">Level</th>
                        <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">Streak</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {entries.map((entry) => (
                        <tr
                            key={entry.profile_id}
                            className={cn(
                                'transition-colors',
                                entry.profile_id === currentProfileId
                                    ? 'bg-emerald-50 dark:bg-emerald-950'
                                    : 'bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800',
                            )}
                        >
                            <td className="px-4 py-3">
                                <span
                                    className={cn(
                                        'text-sm font-bold',
                                        entry.rank === 1 && 'text-amber-500',
                                        entry.rank === 2 && 'text-gray-400',
                                        entry.rank === 3 && 'text-amber-700',
                                        entry.rank > 3 && 'text-gray-500 dark:text-gray-400',
                                    )}
                                >
                                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <AvatarProfile name={entry.name} size={32} />
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{entry.name}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                {entry.period_xp.toLocaleString()}
                            </td>
                            <td className="hidden px-4 py-3 text-right text-sm text-gray-600 sm:table-cell dark:text-gray-400">
                                {entry.level}
                            </td>
                            <td className="hidden px-4 py-3 text-right text-sm sm:table-cell">
                                {entry.current_streak > 0 && (
                                    <span className="text-orange-500">🔥 {entry.current_streak}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
