import { Bismillah } from '@/components/quran/bismillah';
import { PageFrame } from '@/components/quran/page-frame';
import { SurahHeader } from '@/components/quran/surah-header';
import { cn } from '@/lib/utils';
import type { QuranPageData } from '@/types';
import { useCallback, useRef } from 'react';

interface QuranPageProps {
    data: QuranPageData;
    selectedWordIndex: number | null;
    onWordClick: (wordIndex: number) => void;
}

export function QuranPage({ data, selectedWordIndex, onWordClick }: QuranPageProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playingIndexRef = useRef<number | null>(null);

    const playWordAudio = useCallback((audioUrl: string | null, wordIndex: number) => {
        if (!audioUrl) return;

        // Stop current audio if playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        playingIndexRef.current = wordIndex;
        audio.play().catch(() => {});
        audio.onended = () => {
            if (playingIndexRef.current === wordIndex) {
                playingIndexRef.current = null;
            }
        };
    }, []);

    let globalWordIndex = 0;
    let lastSurahNumber: number | null = null;

    const elements: React.ReactNode[] = [];

    for (const ayah of data.ayahs) {
        // Show surah header if new surah starts
        if (ayah.surahNumber !== lastSurahNumber) {
            const surah = data.surahs.find((s) => s.number === ayah.surahNumber);
            if (surah && ayah.numberInSurah === 1) {
                elements.push(<SurahHeader key={`surah-${surah.number}`} surah={surah} />);
                elements.push(<Bismillah key={`bismillah-${surah.number}`} surahNumber={surah.number} />);
            }
            lastSurahNumber = ayah.surahNumber;
        }

        // Use word objects if available (with audio), otherwise fall back to text split
        const wordObjects = ayah.words?.filter((w) => w.char_type === 'word');

        if (wordObjects && wordObjects.length > 0) {
            for (const word of wordObjects) {
                const idx = globalWordIndex++;
                elements.push(
                    <span
                        key={`word-${idx}`}
                        data-word-index={idx}
                        onClick={() => {
                            onWordClick(idx);
                            playWordAudio(word.audio_url, idx);
                        }}
                        className={cn(
                            'inline cursor-pointer rounded px-0.5 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40',
                            selectedWordIndex === idx &&
                                'bg-[var(--color-word-highlight)] dark:bg-[var(--color-word-highlight-dark)]',
                        )}
                    >
                        {word.text}{' '}
                    </span>,
                );
            }
        } else {
            // Fallback: split ayah text into words
            const words = ayah.text.split(/\s+/).filter(Boolean);
            for (const word of words) {
                const idx = globalWordIndex++;
                elements.push(
                    <span
                        key={`word-${idx}`}
                        data-word-index={idx}
                        onClick={() => onWordClick(idx)}
                        className={cn(
                            'inline cursor-pointer rounded px-0.5 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40',
                            selectedWordIndex === idx &&
                                'bg-[var(--color-word-highlight)] dark:bg-[var(--color-word-highlight-dark)]',
                        )}
                    >
                        {word}{' '}
                    </span>,
                );
            }
        }

        // Ayah end marker
        elements.push(
            <span key={`marker-${ayah.number}`} className="mx-1 inline text-[var(--color-ayah-marker)]">
                ﴿{toArabicNumeral(ayah.numberInSurah)}﴾
            </span>,
        );
    }

    return (
        <PageFrame>
            <div
                dir="rtl"
                className="font-quran text-right text-4xl leading-[2.5] text-gray-900 sm:text-5xl sm:leading-[2.8] md:text-6xl md:leading-[3] dark:text-gray-100"
                style={{ textAlignLast: 'center' }}
            >
                {elements}
            </div>
        </PageFrame>
    );
}

function toArabicNumeral(n: number): string {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(n)
        .split('')
        .map((d) => arabicDigits[parseInt(d)])
        .join('');
}
