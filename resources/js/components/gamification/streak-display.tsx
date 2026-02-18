interface StreakDisplayProps {
    currentStreak: number;
    longestStreak: number;
    freezeCount: number;
}

export function StreakDisplay({ currentStreak, longestStreak, freezeCount }: StreakDisplayProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl dark:bg-orange-900">
                    {currentStreak > 0 ? '🔥' : '❄️'}
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {currentStreak} <span className="text-base font-normal text-gray-500">day{currentStreak !== 1 ? 's' : ''}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current streak</p>
                </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Best: {longestStreak} days</span>
                <span className="flex items-center gap-1">
                    {Array.from({ length: 2 }, (_, i) => (
                        <span key={i} className={i < freezeCount ? 'text-blue-400' : 'text-gray-300 dark:text-gray-600'}>
                            🛡️
                        </span>
                    ))}
                    {freezeCount}/2 freezes
                </span>
            </div>
        </div>
    );
}
