import type { QuranPageData } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

const pageCache = new Map<number, QuranPageData>();

export function useQuranPage(pageNumber: number) {
    const [data, setData] = useState<QuranPageData | null>(pageCache.get(pageNumber) ?? null);
    const [loading, setLoading] = useState(!pageCache.has(pageNumber));
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const fetchPage = useCallback(async (page: number, signal?: AbortSignal): Promise<QuranPageData | null> => {
        if (pageCache.has(page)) return pageCache.get(page)!;

        try {
            const res = await fetch(`/api/quran/page/${page}`, { signal });
            if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
            const json = await res.json();
            pageCache.set(page, json);
            return json;
        } catch (e) {
            if (e instanceof DOMException && e.name === 'AbortError') return null;
            throw e;
        }
    }, []);

    useEffect(() => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        if (pageCache.has(pageNumber)) {
            setData(pageCache.get(pageNumber)!);
            setLoading(false);
            setError(null);
        } else {
            setLoading(true);
            setError(null);
            fetchPage(pageNumber, controller.signal)
                .then((result) => {
                    if (result) {
                        setData(result);
                        setLoading(false);
                    }
                })
                .catch((e) => {
                    setError(e.message);
                    setLoading(false);
                });
        }

        // Prefetch adjacent pages
        const prefetchPages = [pageNumber - 1, pageNumber + 1].filter((p) => p >= 1 && p <= 604);
        prefetchPages.forEach((p) => {
            if (!pageCache.has(p)) {
                fetchPage(p).catch(() => {});
            }
        });

        return () => controller.abort();
    }, [pageNumber, fetchPage]);

    return { data, loading, error, retry: () => fetchPage(pageNumber) };
}
