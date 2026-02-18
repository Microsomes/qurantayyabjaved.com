<?php

namespace App\Services;

use App\Models\BadgeDefinition;
use App\Models\Profile;

class BadgeService
{
    public function checkAndAward(Profile $profile): array
    {
        $earned = [];
        $existingBadgeSlugs = $profile->badges()->pluck('slug')->toArray();
        $badges = BadgeDefinition::all();

        foreach ($badges as $badge) {
            if (in_array($badge->slug, $existingBadgeSlugs)) {
                continue;
            }

            if ($this->meetsCriteria($profile, $badge)) {
                $profile->badges()->attach($badge->id, ['earned_at' => now()]);
                $earned[] = [
                    'slug' => $badge->slug,
                    'name' => $badge->name,
                    'description' => $badge->description,
                    'icon' => $badge->icon,
                    'xp_reward' => $badge->xp_reward,
                ];

                if ($badge->xp_reward > 0) {
                    $xp = $profile->xp;
                    if ($xp) {
                        $xp->total_xp += $badge->xp_reward;
                        $xp->level = XpService::levelFromXp($xp->total_xp);
                        $xp->save();
                    }
                }
            }
        }

        return $earned;
    }

    private function meetsCriteria(Profile $profile, BadgeDefinition $badge): bool
    {
        return match ($badge->criteria_type) {
            'pages_read' => $this->getTotalPagesRead($profile) >= $badge->criteria_value,
            'streak' => ($profile->streak?->current_streak ?? 0) >= $badge->criteria_value,
            'juz_complete' => $this->isJuzComplete($profile, $badge->criteria_value),
            'session_duration' => $this->getLongestSession($profile) >= $badge->criteria_value,
            'daily_pages' => $this->getMaxDailyPages($profile) >= $badge->criteria_value,
            default => false,
        };
    }

    private function getTotalPagesRead(Profile $profile): int
    {
        $allPages = [];
        foreach ($profile->readingSessions as $session) {
            $allPages = array_merge($allPages, $session->pages_read ?? []);
        }

        return count(array_unique($allPages));
    }

    private function isJuzComplete(Profile $profile, int $juzNumber): bool
    {
        $juzPages = $this->getJuzPageRange($juzNumber);
        $allPages = [];
        foreach ($profile->readingSessions as $session) {
            $allPages = array_merge($allPages, $session->pages_read ?? []);
        }
        $uniquePages = array_unique($allPages);

        foreach ($juzPages as $page) {
            if (! in_array($page, $uniquePages)) {
                return false;
            }
        }

        return true;
    }

    private function getJuzPageRange(int $juz): array
    {
        $juzStartPages = [
            1 => 1, 2 => 22, 3 => 42, 4 => 62, 5 => 82, 6 => 102,
            7 => 121, 8 => 142, 9 => 162, 10 => 182, 11 => 201, 12 => 222,
            13 => 242, 14 => 262, 15 => 282, 16 => 302, 17 => 322, 18 => 342,
            19 => 362, 20 => 382, 21 => 402, 22 => 422, 23 => 442, 24 => 462,
            25 => 482, 26 => 502, 27 => 522, 28 => 542, 29 => 562, 30 => 582,
        ];

        $start = $juzStartPages[$juz];
        $end = $juz < 30 ? $juzStartPages[$juz + 1] - 1 : 604;

        return range($start, $end);
    }

    private function getLongestSession(Profile $profile): int
    {
        return $profile->readingSessions()->max('duration_seconds') ?? 0;
    }

    private function getMaxDailyPages(Profile $profile): int
    {
        $max = 0;
        foreach ($profile->readingSessions as $session) {
            $count = count($session->pages_read ?? []);
            $max = max($max, $count);
        }

        return $max;
    }
}
