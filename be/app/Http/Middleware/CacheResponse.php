<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;

class CacheResponse
{
    public function handle($request, Closure $next)
    {
        $key = 'api_cache:' . $request->fullUrl();

        if (Cache::has($key)) {
            return response()->json(json_decode(Cache::get($key)), 200);
        }

        $response = $next($request);

        if ($response->isSuccessful()) {
            Cache::put($key, $response->getContent(), now()->addMinutes(10));
        }

        return $response;
    }
}
