<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\LichSuHoatDong;
use Illuminate\Support\Facades\Auth;

class LichSuHoatDongController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $query = LichSuHoatDong::query()
            ->select(
                'lich_su_hoat_dongs.id',
                'lich_su_hoat_dongs.ten_bang',
                'lich_su_hoat_dongs.bang_id',
                'lich_su_hoat_dongs.loai_thao_tac',
                'lich_su_hoat_dongs.nguoi_thao_tac',
                'lich_su_hoat_dongs.mo_ta',
                'lich_su_hoat_dongs.dia_chi_ip',
                'lich_su_hoat_dongs.created_at',
                'users.ho',
                'users.ten',
                'users.email',
                'users.anh_nguoi_dung',
                'vai_tros.ten_vai_tro'
            )
            ->join('users', 'lich_su_hoat_dongs.nguoi_thao_tac', '=', 'users.id')
            ->join('vai_tro_tai_khoan', 'users.id', '=', 'vai_tro_tai_khoan.user_id')
            ->join('vai_tros', 'vai_tro_tai_khoan.vai_tro_id', '=', 'vai_tros.id')
            ->where('vai_tros.ten_vai_tro', '!=', 'Khách hàng')
            ->where('vai_tros.ten_vai_tro', '!=', 'Người giao hàng');

        if ($user->vaiTros()->first()->ten_vai_tro == 'Quản trị viên') {
            $data = $query->orderByDesc('lich_su_hoat_dongs.id')->get();
        } elseif ($user->vaiTros()->first()->ten_vai_tro == 'Bán hàng') {
            $data = $query->where('lich_su_hoat_dongs.nguoi_thao_tac', $user->id)
                ->orderByDesc('lich_su_hoat_dongs.id')
                ->get();
        } else {
            return response()->json(['message' => 'Không có quyền truy cập'], 403);
        }

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
