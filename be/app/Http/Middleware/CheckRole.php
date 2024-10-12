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
        $mangQuyen = [];
        foreach ($request->user()->vaiTros as $vaiTro) {
            array_push($mangQuyen, $vaiTro->quyens->pluck('ten_quyen')->toArray());
        }
        $mangQuyen = array_merge(...$mangQuyen);
        if (!in_array($tenRoute, $mangQuyen)) {
            return response()->json([
                'status' => false,
                'status_code' => 401,
                'message' => 'Không có quyền',
            ], 401);
        }
        return $next($request);
    }
}
