<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\ProfileXp;
use App\Models\ReadingSession;
use App\Services\XpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GamificationController extends Controller
{
    public function stats(int $id): JsonResponse
    {
        $profile = Profile::with('xp', 'streak', 'badges', 'readingSessions')->findOrFail($id);

        $allPages = [];
        foreach ($profile->readingSessions as $session) {
            $allPages = array_merge($allPages, $session->pages_read ?? []);
        }
        $uniquePages = array_unique($allPages);

        $xp = $profile->xp;
        $currentLevel = $xp?->level ?? 1;
        $totalXp = $xp?->total_xp ?? 0;
        $xpForCurrentLevel = XpService::xpForLevel($currentLevel);
        $xpForNextLevel = XpService::xpForLevel($currentLevel + 1);

        return response()->json([
            'profile' => [
                'id' => $profile->id,
                'name' => $profile->name,
            ],
            'xp' => [
                'total' => $totalXp,
                'level' => $currentLevel,
                'xp_for_current_level' => $xpForCurrentLevel,
                'xp_for_next_level' => $xpForNextLevel,
                'progress_to_next' => $xpForNextLevel > $xpForCurrentLevel
                    ? ($totalXp - $xpForCurrentLevel) / ($xpForNextLevel - $xpForCurrentLevel)
                    : 0,
            ],
            'streak' => [
                'current' => $profile->streak?->current_streak ?? 0,
                'longest' => $profile->streak?->longest_streak ?? 0,
                'freeze_count' => $profile->streak?->freeze_count ?? 0,
                'last_read_date' => $profile->streak?->last_read_date?->toDateString(),
            ],
            'reading' => [
                'total_pages' => count($uniquePages),
                'completion' => round(count($uniquePages) / 604 * 100, 1),
                'total_sessions' => $profile->readingSessions->count(),
                'total_duration' => $profile->readingSessions->sum('duration_seconds'),
            ],
            'badges' => $profile->badges->map(fn ($b) => [
                'slug' => $b->slug,
                'name' => $b->name,
                'description' => $b->description,
                'icon' => $b->icon,
                'earned_at' => $b->pivot->earned_at,
            ]),
            'reading_history' => $profile->readingSessions()
                ->orderByDesc('date')
                ->limit(30)
                ->get()
                ->map(fn ($s) => [
                    'date' => $s->date->toDateString(),
                    'pages_count' => count($s->pages_read ?? []),
                    'xp_earned' => $s->xp_earned,
                    'duration' => $s->duration_seconds,
                ]),
        ]);
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $period = $request->query('period', 'all');

        $query = ReadingSession::query()
            ->selectRaw('profile_id, SUM(xp_earned) as period_xp, COUNT(DISTINCT date) as days_active');

        if ($period === 'daily') {
            $query->where('date', now()->toDateString());
        } elseif ($period === 'weekly') {
            $query->where('date', '>=', now()->startOfWeek()->toDateString());
        }

        $rankings = $query->groupBy('profile_id')
            ->orderByDesc('period_xp')
            ->limit(50)
            ->get();

        $profileIds = $rankings->pluck('profile_id');
        $profiles = Profile::with('xp', 'streak')
            ->whereIn('id', $profileIds)
            ->get()
            ->keyBy('id');

        $leaderboard = $rankings->values()->map(function ($r, $index) use ($profiles) {
            $profile = $profiles[$r->profile_id] ?? null;

            return [
                'rank' => $index + 1,
                'profile_id' => $r->profile_id,
                'name' => $profile?->name ?? 'Unknown',
                'period_xp' => (int) $r->period_xp,
                'total_xp' => $profile?->xp?->total_xp ?? 0,
                'level' => $profile?->xp?->level ?? 1,
                'current_streak' => $profile?->streak?->current_streak ?? 0,
                'days_active' => (int) $r->days_active,
            ];
        });

        return response()->json($leaderboard);
    }
}
