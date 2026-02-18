<?php

use App\Http\Controllers\GamificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\QuranController;
use App\Http\Middleware\ProfileSession;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Pages
Route::get('/', fn () => Inertia::render('profiles/index'))->name('home');

Route::middleware(ProfileSession::class)->group(function () {
    Route::get('/read/{page?}', fn (int $page = 1) => Inertia::render('reader/index', ['initialPage' => $page]))->name('reader');
    Route::get('/stats', fn () => Inertia::render('stats/index'))->name('stats');
    Route::get('/leaderboard', fn () => Inertia::render('leaderboard/index'))->name('leaderboard');
});

// API
Route::prefix('api')->group(function () {
    Route::get('/profiles', [ProfileController::class, 'index']);
    Route::post('/profiles', [ProfileController::class, 'store']);
    Route::post('/profiles/{id}/verify', [ProfileController::class, 'verify']);
    Route::delete('/profiles/{id}', [ProfileController::class, 'destroy']);

    Route::get('/quran/page/{n}', [QuranController::class, 'page']);
    Route::post('/quran/prefetch', [QuranController::class, 'prefetch']);

    Route::middleware(ProfileSession::class)->group(function () {
        Route::get('/progress/{id}', [ProgressController::class, 'show']);
        Route::post('/progress/{id}', [ProgressController::class, 'update']);
        Route::post('/progress/{id}/heartbeat', [ProgressController::class, 'heartbeat']);

        Route::get('/gamification/{id}/stats', [GamificationController::class, 'stats']);
        Route::get('/gamification/leaderboard', [GamificationController::class, 'leaderboard']);
    });
});
