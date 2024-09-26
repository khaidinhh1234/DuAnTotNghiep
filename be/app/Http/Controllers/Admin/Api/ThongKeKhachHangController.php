<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\HangThanhVien;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThongKeKhachHangController extends Controller
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

    public function thongKeKhachHangMoiTheoHangThanhVien(Request $request)
    {
        // Lấy tháng từ request, mặc định là tháng hiện tại
        $thang = $request->input('thang', Carbon::now()->month);

        // Lấy khách hàng mới được tạo trong tháng và có hạng thành viên
        $khachHangMoi = User::with('hangThanhVien')
            ->whereMonth('created_at', $thang) // Lọc theo tháng tạo tài khoản
            ->get();

        // Gom nhóm theo hạng thành viên
        $thongKe = $khachHangMoi->groupBy('hang_thanh_vien_id')
            ->map(function ($users, $hang_thanh_vien_id) {
                $hang = HangThanhVien::find($hang_thanh_vien_id);
                return [
                    'ten_hang_thanh_vien' => $hang->ten_hang_thanh_vien,
                    'so_luong_khach_hang' => $users->count(),
                    'khach_hang' => $users->map(function ($user) {
                        return [
                            'ho' => $user->ho,
                            'ten' => $user->ten,
                            'email' => $user->email,
                            'so_dien_thoai' => $user->so_dien_thoai,
                            'dia_chi' => $user->dia_chi,
                            'ngay_sinh' => $user->ngay_sinh,
                            'gioi_tinh' => $user->gioi_tinh,
                            'ngay_tao' => $user->created_at,
                        ];
                    })
                ];
            });

        return response()->json($thongKe);
    }

    public function thongKeKhachHangMoi(Request $request)
    {
        // Lấy tất cả khách hàng, nhóm theo tháng đăng ký
        $khachHangMoi = User::with('hangThanhVien')
            ->selectRaw('YEAR(created_at) as nam, MONTH(created_at) as thang, COUNT(*) as so_luong')
            ->groupBy('nam', 'thang')
            ->orderBy('nam', 'desc')
            ->orderBy('thang', 'desc')
            ->get();

        // Thêm chi tiết khách hàng vào từng tháng
        $thongKeChiTiet = $khachHangMoi->map(function ($item) {
            $khachHangThangNay = User::whereYear('created_at', $item->nam)
                ->whereMonth('created_at', $item->thang)
                ->get(['ho', 'ten', 'email', 'so_dien_thoai', 'dia_chi', 'ngay_sinh', 'gioi_tinh', 'created_at']);

            return [
                'nam' => $item->nam,
                'thang' => $item->thang,
                'so_luong' => $item->so_luong,
                'chi_tiet_khach_hang' => $khachHangThangNay
            ];
        });

        return response()->json($thongKeChiTiet);
    }
    public function thongKeKhachHangQuayLaiTheoThang()
    {
        // Lấy danh sách các khách hàng quay lại theo từng tháng (nhóm theo tháng và user_id)
        $khachHangQuayLaiTheoThang = DB::table('don_hangs')
            ->select(
                'user_id',
                DB::raw('YEAR(created_at) as nam'),
                DB::raw('MONTH(created_at) as thang'),
                DB::raw('count(id) as so_luong_don_hang')
            )
            ->groupBy('user_id', 'nam', 'thang')
            ->having('so_luong_don_hang', '>', 1)
            ->get();

        // Lấy thông tin chi tiết của các khách hàng quay lại trong từng tháng
        $thongTinKhachHangTheoThang = [];
        foreach ($khachHangQuayLaiTheoThang as $khachHang) {
            $thongTin = DB::table('users')
                ->where('id', $khachHang->user_id)
                ->first(['ho', 'ten', 'email', 'so_dien_thoai', 'dia_chi', 'ngay_sinh', 'gioi_tinh']);

            $thongTinKhachHangTheoThang[] = [
                'nam' => $khachHang->nam,
                'thang' => $khachHang->thang,
                'so_luong_don_hang' => $khachHang->so_luong_don_hang,
                'thong_tin_khach_hang' => $thongTin,
            ];
        }

        return response()->json([
            'khach_hang_quay_lai_theo_thang' => $thongTinKhachHangTheoThang
        ]);
    }
}
