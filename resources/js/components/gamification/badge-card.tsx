import { cn } from '@/lib/utils';
import type { Badge } from '@/types';

const ICON_MAP: Record<string, string> = {
    'book-open': '📖',
    'book': '📚',
    'star': '⭐',
    'award': '🏅',
    'crown': '👑',
    'flame': '🔥',
    'zap': '⚡',
    'trophy': '🏆',
    'check-circle': '✅',
    'rocket': '🚀',
    'moon': '🌙',
    'target': '🎯',
};

interface BadgeCardProps {
    badge: Badge;
    earned: boolean;
}

export function BadgeCard({ badge, earned }: BadgeCardProps) {
    const icon = ICON_MAP[badge.icon] ?? '🏅';

    return (
        <div
            className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all',
                earned
                    ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950'
                    : 'border-gray-200 bg-gray-50 opacity-40 grayscale dark:border-gray-700 dark:bg-gray-800',
            )}
        >
            <span className="text-3xl">{icon}</span>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{badge.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
        </div>
    );
}
