const STORAGE_KEY = 'activeProfileId';

export function getStoredProfileId(): number | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : null;
}

export function setStoredProfileId(id: number): void {
    localStorage.setItem(STORAGE_KEY, String(id));
}

export function clearStoredProfileId(): void {
    localStorage.removeItem(STORAGE_KEY);
}
