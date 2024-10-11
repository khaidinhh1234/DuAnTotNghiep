<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\LichSuHoatDong;

class LichSuHoatDongController extends Controller
{
    public function index()
    {
        $data = LichSuHoatDong::query()
            ->select('id', 'ten_bang', 'bang_id', 'loai_thao_tac', 'nguoi_thao_tac', 'mo_ta', 'dia_chi_ip', 'created_at')
            ->with('user.vaiTros')->orderByDesc('id')->get();
        return response()->json($data);
    }

    public function show(string $id)
    {
        $data = LichSuHoatDong::query()
            ->where('id', $id)
            ->first();
        return response()->json($data);
    }
}
