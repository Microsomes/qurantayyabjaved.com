<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\ProfileXp;
use App\Models\ReadingSession;

class XpService
{
    const XP_PER_PAGE = 10;
    const XP_NEW_SURAH = 25;
    const XP_SURAH_COMPLETE = 50;
    const XP_JUZ_COMPLETE = 100;
    const XP_DAILY_LOGIN = 15;

    public static function xpForLevel(int $level): int
    {
        if ($level <= 1) {
            return 0;
        }

        return ($level - 1) ** 2 * 100;
    }

    public static function levelFromXp(int $totalXp): int
    {
        $level = 1;
        while (self::xpForLevel($level + 1) <= $totalXp) {
            $level++;
        }

        return $level;
    }

    public static function streakMultiplier(int $currentStreak): float
    {
        if ($currentStreak >= 30) {
            return 2.0;
        }
        if ($currentStreak >= 7) {
            return 1.5;
        }

        return 1.0;
    }

    public static function streakBonus(int $currentStreak): int
    {
        return min($currentStreak * 2, 60);
    }

    public function awardPageXp(Profile $profile, int $page): array
    {
        $profileXp = $profile->xp ?? ProfileXp::create(['profile_id' => $profile->id]);
        $streak = $profile->streak;
        $currentStreak = $streak ? $streak->current_streak : 0;

        $baseXp = self::XP_PER_PAGE;
        $multiplier = self::streakMultiplier($currentStreak);
        $bonus = self::streakBonus($currentStreak);
        $totalPageXp = (int) round($baseXp * $multiplier) + $bonus;

        $oldLevel = $profileXp->level;
        $profileXp->total_xp += $totalPageXp;
        $profileXp->level = self::levelFromXp($profileXp->total_xp);
        $profileXp->save();

        $session = ReadingSession::firstOrCreate(
            ['profile_id' => $profile->id, 'date' => today()],
            ['pages_read' => [], 'xp_earned' => 0, 'duration_seconds' => 0],
        );

        $pagesRead = $session->pages_read ?? [];
        if (! in_array($page, $pagesRead)) {
            $pagesRead[] = $page;
            $session->pages_read = $pagesRead;
        }
        $session->xp_earned += $totalPageXp;
        $session->save();

        return [
            'xp_earned' => $totalPageXp,
            'total_xp' => $profileXp->total_xp,
            'level' => $profileXp->level,
            'leveled_up' => $profileXp->level > $oldLevel,
        ];
    }

    public function awardDailyLoginXp(Profile $profile): int
    {
        $profileXp = $profile->xp ?? ProfileXp::create(['profile_id' => $profile->id]);

        $session = ReadingSession::firstOrCreate(
            ['profile_id' => $profile->id, 'date' => today()],
            ['pages_read' => [], 'xp_earned' => 0, 'duration_seconds' => 0],
        );

        if (! $session->wasRecentlyCreated) {
            return 0;
        }

        $profileXp->total_xp += self::XP_DAILY_LOGIN;
        $profileXp->level = self::levelFromXp($profileXp->total_xp);
        $profileXp->save();

        $session->xp_earned = self::XP_DAILY_LOGIN;
        $session->save();

        return self::XP_DAILY_LOGIN;
    }
}
