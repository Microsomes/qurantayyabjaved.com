import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PageNavigationProps {
    currentPage: number;
    juz: number | null;
    onPageChange: (page: number) => void;
}

const JUZ_NAMES: Record<number, string> = {
    1: 'Alif Lam Mim',
    2: 'Sayaqool',
    3: 'Tilkal Rusul',
    4: 'Lan Tanaloo',
    5: 'Wal Mohsanat',
    6: 'La Yuhibbullah',
    7: 'Wa Iza Samiu',
    8: 'Wa Lau Annana',
    9: 'Qalal Malau',
    10: "Wa A'lamu",
    11: 'Yatazeroon',
    12: 'Wa Mamin Daabbah',
    13: 'Wa Ma Ubarrio',
    14: 'Rubama',
    15: 'Subhanallazi',
    16: 'Qal Alam',
    17: 'Iqtaraba',
    18: 'Qad Aflaha',
    19: 'Wa Qalallazina',
    20: 'Amman Khalaq',
    21: 'Utlu Ma Uhiya',
    22: 'Wa Manyaqnut',
    23: 'Wa Mali',
    24: 'Faman Azlamu',
    25: 'Ilaihi Yuraddu',
    26: 'Ha Mim',
    27: 'Qala Fama Khatbukum',
    28: 'Qad Sami Allahu',
    29: 'Tabarakallazi',
    30: 'Amma',
};

export function PageNavigation({ currentPage, juz, onPageChange }: PageNavigationProps) {
    const [inputValue, setInputValue] = useState('');
    const [showInput, setShowInput] = useState(false);

    function handleGoToPage() {
        const page = parseInt(inputValue);
        if (page >= 1 && page <= 604) {
            onPageChange(page);
            setShowInput(false);
            setInputValue('');
        }
    }

    return (
        <div className="flex items-center justify-between px-4 py-3">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(Math.min(604, currentPage + 1))}
                disabled={currentPage >= 604}
                aria-label="Previous page (RTL)"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </Button>

            <div className="flex flex-col items-center gap-1">
                {showInput ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleGoToPage();
                        }}
                        className="flex items-center gap-2"
                    >
                        <input
                            type="number"
                            min={1}
                            max={604}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            autoFocus
                            onBlur={() => !inputValue && setShowInput(false)}
                        />
                        <Button variant="primary" size="sm" type="submit">
                            Go
                        </Button>
                    </form>
                ) : (
                    <button onClick={() => setShowInput(true)} className="text-center">
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{currentPage}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400"> / 604</span>
                    </button>
                )}
                {juz && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Juz {juz}: {JUZ_NAMES[juz] ?? ''}
                    </span>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                aria-label="Next page (RTL)"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </Button>
        </div>
    );
}
