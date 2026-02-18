import type { Badge } from '@/types';
import { useEffect, useState } from 'react';

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

interface BadgeToastProps {
    badge: Badge | null;
    onClose: () => void;
}

export function BadgeToast({ badge, onClose }: BadgeToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (badge) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [badge, onClose]);

    if (!badge) return null;

    const icon = ICON_MAP[badge.icon] ?? '🏅';

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-lg transition-all duration-300 dark:border-amber-700 dark:bg-amber-950 ${
                visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Badge Earned!</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">{badge.name}</p>
            </div>
        </div>
    );
}
