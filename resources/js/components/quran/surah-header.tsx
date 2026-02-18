import type { QuranSurah } from '@/types';

interface SurahHeaderProps {
    surah: QuranSurah;
}

export function SurahHeader({ surah }: SurahHeaderProps) {
    return (
        <div className="my-6 flex flex-col items-center">
            <div className="relative flex w-full max-w-md items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-300 dark:border-amber-700" />
                </div>
                <div className="relative rounded-xl border-2 border-amber-400 bg-amber-50 px-6 py-3 text-center dark:border-amber-600 dark:bg-amber-950">
                    <p className="font-quran text-2xl leading-relaxed text-amber-900 dark:text-amber-200">{surah.name}</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        {surah.englishName} &middot; {surah.englishNameTranslation}
                    </p>
                </div>
            </div>
        </div>
    );
}
