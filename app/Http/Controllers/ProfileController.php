<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\ProfileXp;
use App\Models\ReadingProgress;
use App\Models\Streak;
use App\Services\XpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function index(): JsonResponse
    {
        $profiles = Profile::with('readingProgress', 'xp', 'streak')
            ->get()
            ->map(fn (Profile $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'current_page' => $p->readingProgress?->current_page ?? 1,
                'level' => $p->xp?->level ?? 1,
                'total_xp' => $p->xp?->total_xp ?? 0,
                'current_streak' => $p->streak?->current_streak ?? 0,
                'created_at' => $p->created_at,
            ]);

        return response()->json($profiles);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'pin' => 'required|string|size:5',
        ]);

        $profile = Profile::create([
            'name' => $validated['name'],
            'pin_hash' => Hash::make($validated['pin']),
        ]);

        ReadingProgress::create(['profile_id' => $profile->id]);
        ProfileXp::create(['profile_id' => $profile->id]);
        Streak::create(['profile_id' => $profile->id]);

        $request->session()->put('active_profile_id', $profile->id);

        return response()->json([
            'id' => $profile->id,
            'name' => $profile->name,
        ], 201);
    }

    public function verify(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'pin' => 'required|string|size:5',
        ]);

        $profile = Profile::findOrFail($id);

        if (! Hash::check($validated['pin'], $profile->pin_hash)) {
            return response()->json(['message' => 'Invalid PIN'], 401);
        }

        $request->session()->put('active_profile_id', $profile->id);

        $xpService = new XpService;
        $xpService->awardDailyLoginXp($profile);

        return response()->json([
            'id' => $profile->id,
            'name' => $profile->name,
            'current_page' => $profile->readingProgress?->current_page ?? 1,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $profile = Profile::findOrFail($id);
        $profile->delete();

        if ($request->session()->get('active_profile_id') == $id) {
            $request->session()->forget('active_profile_id');
        }

        return response()->json(['message' => 'Profile deleted']);
    }
}
