<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class AuthSanctum
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authorizationHeader = $request->header('Authorization');
        if (!$authorizationHeader || !str_contains($authorizationHeader, 'Bearer ')) {
            return response()->json([
                'status' => false,
                'status_code' => 401,
                'message' => 'Không được phép',
                'data' => $request->header()
            ], 401);
        }

        $token = substr($authorizationHeader, 7);

        $personalAccessToken = PersonalAccessToken::findToken($token);

        if (!$personalAccessToken || !$personalAccessToken->tokenable) {
            return response()->json(['message' => 'Mã token không hợp lệ hoặc không tìm thấy người dùng'], Response::HTTP_UNAUTHORIZED);
        }

        // Xác thực người dùng dựa trên token
        $request->setUserResolver(function () use ($personalAccessToken): mixed {
            return $personalAccessToken->tokenable;
        });

        return $next($request);
    }
}
