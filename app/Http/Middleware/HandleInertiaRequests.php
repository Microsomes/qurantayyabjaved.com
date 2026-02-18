<?php

namespace App\Http\Middleware;

use App\Models\Profile;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $activeProfile = null;
        $profileId = $request->session()->get('active_profile_id');

        if ($profileId) {
            $profile = Profile::with('xp', 'streak', 'readingProgress')->find($profileId);
            if ($profile) {
                $activeProfile = [
                    'id' => $profile->id,
                    'name' => $profile->name,
                    'current_page' => $profile->readingProgress?->current_page ?? 1,
                    'level' => $profile->xp?->level ?? 1,
                    'total_xp' => $profile->xp?->total_xp ?? 0,
                    'current_streak' => $profile->streak?->current_streak ?? 0,
                ];
            } else {
                $request->session()->forget('active_profile_id');
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'activeProfile' => $activeProfile,
        ];
    }
}
