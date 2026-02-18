import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function csrfHeaders(): Record<string, string> {
    // Prefer meta tag (plain token → X-CSRF-TOKEN header)
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta?.getAttribute('content')) {
        return { 'X-CSRF-TOKEN': meta.getAttribute('content')! };
    }

    // Fallback: XSRF-TOKEN cookie (encrypted → X-XSRF-TOKEN header)
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
        return { 'X-XSRF-TOKEN': decodeURIComponent(match[1]) };
    }

    return {};
}
