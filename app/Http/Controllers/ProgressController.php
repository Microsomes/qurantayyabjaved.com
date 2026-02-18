<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\ReadingProgress;
use App\Models\ReadingSession;
use App\Services\BadgeService;
use App\Services\StreakService;
use App\Services\XpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function show(int $id): JsonResponse
    {
        $profile = Profile::findOrFail($id);
        $progress = $profile->readingProgress ?? ReadingProgress::create(['profile_id' => $id]);

        return response()->json([
            'current_page' => $progress->current_page,
            'last_word_index' => $progress->last_word_index,
            'last_read_at' => $progress->last_read_at?->toISOString(),
        ])->header('Cache-Control', 'no-store');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'current_page' => 'required|integer|min:1|max:604',
            'last_word_index' => 'nullable|integer|min:0',
        ]);

        $profile = Profile::findOrFail($id);
        $progress = $profile->readingProgress ?? ReadingProgress::create(['profile_id' => $id]);

        $previousPage = $progress->current_page;
        $progress->current_page = $validated['current_page'];
        $progress->last_word_index = $validated['last_word_index'];
        $progress->last_read_at = now();
        $progress->save();

        $xpResult = null;
        $streakResult = null;
        $newBadges = [];

        if ($validated['current_page'] !== $previousPage) {
            $xpService = new XpService;
            $xpResult = $xpService->awardPageXp($profile, $validated['current_page']);

            $streakService = new StreakService;
            $streakResult = $streakService->recordReading($profile);

            $profile->load('readingSessions', 'badges', 'streak', 'xp');
            $badgeService = new BadgeService;
            $newBadges = $badgeService->checkAndAward($profile);
        }

        return response()->json([
            'progress' => [
                'current_page' => $progress->current_page,
                'last_word_index' => $progress->last_word_index,
            ],
            'xp' => $xpResult,
            'streak' => $streakResult,
            'new_badges' => $newBadges,
        ]);
    }

    public function heartbeat(Request $request, int $id): JsonResponse
    {
        $profile = Profile::findOrFail($id);

        $session = ReadingSession::firstOrCreate(
            ['profile_id' => $profile->id, 'date' => today()],
            ['pages_read' => [], 'xp_earned' => 0, 'duration_seconds' => 0],
        );

        $session->duration_seconds += 30;
        $session->save();

        return response()->json(['duration_seconds' => $session->duration_seconds]);
    }
}
