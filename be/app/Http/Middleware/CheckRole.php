<?php

namespace App\Http\Middleware;

use App\Models\VaiTro;
use Closure;
use Illuminate\Http\Request;
// use Illuminate\Routing\Route;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenRoute = $request->route()->getName();
        $users = $request->user()->vaiTros;
        foreach ($users as $user) {
            $vaiTro = VaiTro::query()->where('ten_vai_tro', $user->ten_vai_tro)->with('quyens')->first();
            $tenQuyen = $vaiTro->quyens->pluck('ten_quyen');
        }
        if (!in_array($tenRoute, $tenQuyen->toArray())) {
            return response()->json([
                'status' => false,
                'status_code' => 401,
                'message' => 'Không có quyền'
            ], 401);
        }
        return $next($request);
    }
}
