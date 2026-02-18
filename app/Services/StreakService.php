<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\Streak;

class StreakService
{
    const MAX_FREEZES = 2;

    public function recordReading(Profile $profile): array
    {
        $streak = $profile->streak ?? Streak::create([
            'profile_id' => $profile->id,
            'current_streak' => 0,
            'longest_streak' => 0,
        ]);

        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        if ($streak->last_read_date?->toDateString() === $today) {
            return $this->formatResponse($streak);
        }

        if ($streak->last_read_date?->toDateString() === $yesterday) {
            $streak->current_streak++;
        } elseif ($streak->last_read_date === null) {
            $streak->current_streak = 1;
        } else {
            $daysMissed = now()->diffInDays($streak->last_read_date);

            if ($daysMissed <= $streak->freeze_count + 1) {
                $freezesUsed = $daysMissed - 1;
                $streak->freeze_count = max(0, $streak->freeze_count - $freezesUsed);
                $streak->current_streak++;
            } else {
                $streak->current_streak = 1;
            }
        }

        $streak->longest_streak = max($streak->longest_streak, $streak->current_streak);
        $streak->last_read_date = $today;
        $streak->freeze_used_today = false;
        $streak->save();

        return $this->formatResponse($streak);
    }

    public function useFreeze(Profile $profile): bool
    {
        $streak = $profile->streak;

        if (! $streak || $streak->freeze_count >= self::MAX_FREEZES) {
            return false;
        }

        if ($streak->freeze_used_today) {
            return false;
        }

        $streak->freeze_count++;
        $streak->freeze_used_today = true;
        $streak->save();

        return true;
    }

    private function formatResponse(Streak $streak): array
    {
        return [
            'current_streak' => $streak->current_streak,
            'longest_streak' => $streak->longest_streak,
            'freeze_count' => $streak->freeze_count,
            'last_read_date' => $streak->last_read_date?->toDateString(),
        ];
    }
}
