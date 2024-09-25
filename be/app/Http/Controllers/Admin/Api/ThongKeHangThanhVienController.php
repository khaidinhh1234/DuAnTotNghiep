<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\HangThanhVien;
use Illuminate\Http\Request;

class ThongKeHangThanhVienController extends Controller
{
    public function thongKeKhachHangTheoHangThanhVien()
    {
        // Lấy danh sách hạng thành viên và số lượng khách hàng trong từng hạng
        $thongKe = HangThanhVien::withCount('users')
            ->get(['ten_hang_thanh_vien', 'chi_tieu_toi_thieu', 'chi_tieu_toi_da', 'ngay_bat_dau', 'ngay_ket_thuc'])
            ->map(function ($hang) {
                return [
                    'ten_hang_thanh_vien' => $hang->ten_hang_thanh_vien,
                    'chi_tieu_toi_thieu' => $hang->chi_tieu_toi_thieu,
                    'chi_tieu_toi_da' => $hang->chi_tieu_toi_da,
                    'ngay_bat_dau' => $hang->ngay_bat_dau,
                    'ngay_ket_thuc' => $hang->ngay_ket_thuc,
                    'so_luong_khach_hang' => $hang->users_count,
                ];
            });

        return response()->json($thongKe);
    }
}
