interface ProgressBarProps {
    currentPage: number;
    totalPages?: number;
}

export function ProgressBar({ currentPage, totalPages = 604 }: ProgressBarProps) {
    const percent = (currentPage / totalPages) * 100;

    return (
        <div className="w-full">
            <div className="h-1 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
