import { cn } from '@/lib/utils';
import { type KeyboardEvent, useEffect, useRef } from 'react';

interface PinInputProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: (pin: string) => void;
    length?: number;
    error?: boolean;
    disabled?: boolean;
}

export function PinInput({ value, onChange, onComplete, length = 5, error = false, disabled = false }: PinInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Auto-focus first input on mount
    useEffect(() => {
        const timer = setTimeout(() => inputRefs.current[0]?.focus(), 50);
        return () => clearTimeout(timer);
    }, []);

    function handleInput(index: number, digit: string) {
        if (!/^\d*$/.test(digit)) return;

        const chars = value.split('');
        chars[index] = digit.slice(-1);
        const newValue = chars.join('').slice(0, length);
        onChange(newValue);

        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newValue.length === length && onComplete) {
            onComplete(newValue);
        }
    }

    function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const chars = value.split('');
            chars[index - 1] = '';
            onChange(chars.join(''));
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        onChange(pasted);
        if (pasted.length === length && onComplete) {
            onComplete(pasted);
        }
        const focusIndex = Math.min(pasted.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
    }

    return (
        <div className="flex justify-center gap-3" dir="ltr">
            {Array.from({ length }, (_, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ''}
                    onChange={(e) => handleInput(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    disabled={disabled}
                    className={cn(
                        'h-14 w-12 rounded-xl border-2 text-center text-2xl font-bold transition-colors focus:outline-none',
                        error
                            ? 'border-red-400 bg-red-50 text-red-600 dark:border-red-500 dark:bg-red-950 dark:text-red-400'
                            : 'border-gray-300 bg-white text-gray-900 focus:border-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-400',
                        disabled && 'opacity-50',
                    )}
                />
            ))}
        </div>
    );
}
