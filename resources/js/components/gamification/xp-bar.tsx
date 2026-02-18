interface XpBarProps {
    level: number;
    totalXp: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    progressToNext: number;
}

export function XpBar({ level, totalXp, xpForCurrentLevel, xpForNextLevel, progressToNext }: XpBarProps) {
    const currentLevelXp = totalXp - xpForCurrentLevel;
    const levelRange = xpForNextLevel - xpForCurrentLevel;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        {level}
                    </span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Level {level}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{totalXp.toLocaleString()} XP</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                    style={{ width: `${Math.min(progressToNext * 100, 100)}%` }}
                />
            </div>
            <p className="mt-1 text-right text-xs text-gray-400 dark:text-gray-500">
                {currentLevelXp} / {levelRange} XP to Level {level + 1}
            </p>
        </div>
    );
}
