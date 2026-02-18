interface BismillahProps {
    surahNumber: number;
}

export function Bismillah({ surahNumber }: BismillahProps) {
    // Skip Bismillah for Surah At-Tawbah (9) and Al-Fatihah (1, already part of text)
    if (surahNumber === 9 || surahNumber === 1) return null;

    return (
        <div className="my-4 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-amber-300 dark:bg-amber-700" />
            <p className="font-quran text-2xl text-amber-800 dark:text-amber-300">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
            <div className="h-px w-12 bg-amber-300 dark:bg-amber-700" />
        </div>
    );
}
