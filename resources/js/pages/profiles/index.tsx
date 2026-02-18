import { AvatarProfile } from '@/components/ui/avatar-profile';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PinInput } from '@/components/ui/pin-input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { setStoredProfileId } from '@/lib/profile-store';
import { csrfHeaders } from '@/lib/utils';
import type { Profile } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

interface ProfileCardData {
    id: number;
    name: string;
    current_page: number;
    level: number;
    total_xp: number;
    current_streak: number;
}

export default function ProfilesIndex() {
    const [profiles, setProfiles] = useState<ProfileCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState<ProfileCardData | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // Create form state
    const [newName, setNewName] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [createStep, setCreateStep] = useState<'name' | 'pin' | 'confirm'>('name');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    const fetchProfiles = useCallback(async () => {
        try {
            const res = await fetch('/api/profiles');
            const data = await res.json();
            setProfiles(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    async function handleVerify(pinValue: string) {
        if (!selectedProfile) return;
        setVerifying(true);
        setPinError(false);

        try {
            const res = await fetch(`/api/profiles/${selectedProfile.id}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...csrfHeaders(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ pin: pinValue }),
            });

            if (res.ok) {
                setStoredProfileId(selectedProfile.id);
                router.visit('/read');
            } else if (res.status === 419) {
                // CSRF token mismatch — reload page to get fresh token
                window.location.reload();
            } else {
                setPinError(true);
                setPin('');
            }
        } finally {
            setVerifying(false);
        }
    }

    async function handleCreate(confirmedPin?: string) {
        const pinToCheck = confirmedPin ?? confirmPin;
        if (newPin !== pinToCheck) {
            setCreateError('PINs do not match');
            return;
        }
        setCreating(true);
        setCreateError('');

        try {
            const res = await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...csrfHeaders(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ name: newName, pin: newPin }),
            });

            if (res.ok) {
                const data = await res.json();
                setStoredProfileId(data.id);
                router.visit('/read');
            } else {
                const err = await res.json();
                setCreateError(err.message || 'Failed to create profile');
            }
        } finally {
            setCreating(false);
        }
    }

    function closeVerifyModal() {
        setSelectedProfile(null);
        setPin('');
        setPinError(false);
    }

    function closeCreateModal() {
        setShowCreate(false);
        setNewName('');
        setNewPin('');
        setConfirmPin('');
        setCreateStep('name');
        setCreateError('');
    }

    async function handleDelete(id: number) {
        const res = await fetch(`/api/profiles/${id}`, {
            method: 'DELETE',
            headers: { ...csrfHeaders() },
            credentials: 'same-origin',
        });
        if (res.ok) {
            fetchProfiles();
            closeVerifyModal();
        }
    }

    return (
        <>
            <Head title="Select Profile" />
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4 dark:from-gray-950 dark:to-gray-900">
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-400">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Select your profile to begin reading</p>
                </div>

                {loading ? (
                    <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
                        ))}
                    </div>
                ) : (
                    <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
                        {profiles.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedProfile(p)}
                                className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:border-emerald-300 hover:shadow-md active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-600"
                            >
                                <AvatarProfile name={p.name} size={64} />
                                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{p.name}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Page {p.current_page} &middot; Level {p.level}
                                </span>
                            </button>
                        ))}

                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-emerald-400 hover:bg-emerald-50 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:bg-emerald-950"
                        >
                            <span className="text-3xl text-gray-400 dark:text-gray-500">+</span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">New Profile</span>
                        </button>
                    </div>
                )}

                {/* Verify PIN Modal */}
                <Modal open={!!selectedProfile} onClose={closeVerifyModal}>
                    {selectedProfile && (
                        <div className="flex flex-col items-center gap-4">
                            <AvatarProfile name={selectedProfile.name} size={80} />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{selectedProfile.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your 5-digit PIN</p>
                            <PinInput
                                value={pin}
                                onChange={(v) => {
                                    setPin(v);
                                    setPinError(false);
                                }}
                                onComplete={handleVerify}
                                error={pinError}
                                disabled={verifying}
                            />
                            {pinError && <p className="text-sm text-red-500">Incorrect PIN. Try again.</p>}
                            <div className="mt-2 flex gap-3">
                                <Button variant="ghost" size="sm" onClick={closeVerifyModal}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        if (confirm('Delete this profile? This cannot be undone.')) {
                                            handleDelete(selectedProfile.id);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Create Profile Modal */}
                <Modal open={showCreate} onClose={closeCreateModal}>
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Create Profile</h2>

                        {createStep === 'name' && (
                            <>
                                <AvatarProfile name={newName || 'New'} size={80} />
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    maxLength={100}
                                    className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-center text-lg focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    autoFocus
                                />
                                <Button
                                    onClick={() => setCreateStep('pin')}
                                    disabled={!newName.trim()}
                                    className="w-full"
                                >
                                    Next
                                </Button>
                            </>
                        )}

                        {createStep === 'pin' && (
                            <>
                                <AvatarProfile name={newName} size={80} />
                                <p className="text-sm text-gray-500 dark:text-gray-400">Choose a 5-digit PIN</p>
                                <PinInput
                                    value={newPin}
                                    onChange={setNewPin}
                                    onComplete={() => setCreateStep('confirm')}
                                />
                                <Button variant="ghost" size="sm" onClick={() => setCreateStep('name')}>
                                    Back
                                </Button>
                            </>
                        )}

                        {createStep === 'confirm' && (
                            <>
                                <AvatarProfile name={newName} size={80} />
                                <p className="text-sm text-gray-500 dark:text-gray-400">Confirm your PIN</p>
                                <PinInput
                                    value={confirmPin}
                                    onChange={(v) => {
                                        setConfirmPin(v);
                                        setCreateError('');
                                    }}
                                    onComplete={(pin) => handleCreate(pin)}
                                    error={!!createError}
                                    disabled={creating}
                                />
                                {createError && <p className="text-sm text-red-500">{createError}</p>}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setConfirmPin('');
                                        setCreateStep('pin');
                                    }}
                                >
                                    Back
                                </Button>
                            </>
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
}

