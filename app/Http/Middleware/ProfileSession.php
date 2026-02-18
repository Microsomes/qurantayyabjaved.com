<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProfileSession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->has('active_profile_id')) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'No active profile'], 401);
            }

            return redirect('/');
        }

        return $next($request);
    }
}
