import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface LevelUpModalProps {
    open: boolean;
    level: number;
    onClose: () => void;
}

export function LevelUpModal({ open, level, onClose }: LevelUpModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Level Up!</h2>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-3xl font-bold text-white shadow-lg">
                    {level}
                </div>
                <p className="text-center text-gray-600 dark:text-gray-400">
                    You&apos;ve reached Level {level}. Keep reading!
                </p>
                <Button onClick={onClose} className="mt-2">
                    Continue Reading
                </Button>
            </div>
        </Modal>
    );
}
