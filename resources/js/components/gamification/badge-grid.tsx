import { BadgeCard } from '@/components/gamification/badge-card';
import type { Badge } from '@/types';

interface BadgeGridProps {
    allBadges: Badge[];
    earnedSlugs: Set<string>;
}

export function BadgeGrid({ allBadges, earnedSlugs }: BadgeGridProps) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {allBadges.map((badge) => (
                <BadgeCard key={badge.slug} badge={badge} earned={earnedSlugs.has(badge.slug)} />
            ))}
        </div>
    );
}
