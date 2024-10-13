<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\HangThanhVien;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

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
    public function thongKeTop5KhachHangGanDay()
    {
        $khachHang = User::select('users.*', DB::raw('CAST(SUM(don_hangs.tong_tien_don_hang) AS UNSIGNED) as tong_tien_da_mua'))
            ->join('don_hangs', 'users.id', '=', 'don_hangs.user_id')
            ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereNull('don_hangs.deleted_at')
            ->groupBy('users.id') // Nhóm theo người dùng để tính tổng tiền chi tiêu của từng khách hàng.
            ->orderByDesc(DB::raw('MAX(don_hangs.created_at)'))
            ->take(5)
            ->get();
        return $khachHang;
    }

    public function soSanhKhachHangRegister(Request $request)
    {
        try {
            DB::beginTransaction();

            $now = Carbon::now();

            // Đếm số lượng khách hàng đăng ký trong tháng hiện tại
            $registerHienTai = DB::table('users')
                ->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year)
                ->count();  // Đếm số lượt đăng ký

            // Lùi về tháng trước
            $thangTruoc = $now->subMonth();

            // Đếm số lượng khách hàng đăng ký trong tháng trước
            $registerTruoc = DB::table('users')
                ->whereMonth('created_at', $thangTruoc->month)
                ->whereYear('created_at', $thangTruoc->year)
                ->count();  // Đếm số lượt đăng ký

            // Tính sự chênh lệch về số lượng đăng ký và phần trăm
            $chenhLechSo = $registerHienTai - $registerTruoc;
            $chenhLechPhanTram = ($registerTruoc > 0)
                ? ($chenhLechSo / $registerTruoc) * 100
                : 100;  // Nếu tháng trước không có lượt đăng ký, mặc định tăng 100%

            DB::commit();

            // Trả về kết quả so sánh
            return response()->json([
                'register_hien_tai' => $registerHienTai,
                'register_truoc' => $registerTruoc,
                'chenh_lech_so' => $chenhLechSo,
                'chenh_lech_phan_tram' => $chenhLechPhanTram
            ]);
        } catch (Exception $e) {
            // Rollback nếu có lỗi xảy ra
            DB::rollBack();

            // Trả về lỗi kèm theo mã lỗi
            return response()->json(['error' => 'Có lỗi xảy ra trong quá trình xử lý', 'message' => $e->getMessage()], 500);
        }
    }

    public function soSanhKhachHangBlock(Request $request)
    {
        try {
            DB::beginTransaction();

            $now = Carbon::now();


            $activityHienTai = DB::table('users')
                ->whereNull('deleted_at')
                ->count();  // Đếm số lượt đăng ký

            // // Lùi về tháng trước
            // $thangTruoc = $now->subMonth();


            // $blockTruoc = DB::table('users')
            //     ->whereNotNull('deleted_at')
            //     ->whereMonth('created_at', $thangTruoc->month)
            //     ->whereYear('created_at', $thangTruoc->year)
            //     ->count();  // Đếm số lượt block

            // // Tính sự chênh lệch về số lượng đăng ký và phần trăm
            // $chenhLechSo = $blockHienTai - $blockTruoc;
            // $chenhLechPhanTram = ($blockTruoc > 0)
            //     ? ($chenhLechSo / $blockTruoc) * 100
            //     : 100;

            DB::commit();

            // Trả về kết quả so sánh
            return response()->json([
                'activity_hien_tai' => $activityHienTai,
                // 'block_truoc' => $blockTruoc,
                // 'chenh_lech_so' => $chenhLechSo,
                // 'chenh_lech_phan_tram' => $chenhLechPhanTram
            ]);
        } catch (Exception $e) {
            // Rollback nếu có lỗi xảy ra
            DB::rollBack();

            // Trả về lỗi kèm theo mã lỗi
            return response()->json(['error' => 'Có lỗi xảy ra trong quá trình xử lý', 'message' => $e->getMessage()], 500);
        }
    }
    public function timKiemThanhVienTheoHang(Request $request)
{
    $validatedData = $request->validate([
        'ten_hang_thanh_vien' => 'required|string|max:255',
    ]);

    try {

        $hangThanhVien = HangThanhVien::where('ten_hang_thanh_vien', $validatedData['ten_hang_thanh_vien'])->first();

        if (!$hangThanhVien) {
            return response()->json(['error' => 'Không tìm thấy hạng thành viên'], 404);
        }

        // Lấy danh sách thành viên có hạng thành viên đó
        $thanhVienTheoHang = User::where('hang_thanh_vien_id', $hangThanhVien->id)
            ->select('ho', 'ten', 'email', 'so_dien_thoai', 'dia_chi', 'ngay_sinh', 'gioi_tinh', 'anh_nguoi_dung')
            ->get();

        if ($thanhVienTheoHang->isEmpty()) {
            return response()->json(['message' => 'Không có thành viên nào thuộc hạng này'], 404);
        }

        return response()->json(['thanh_vien_theo_hang' => $thanhVienTheoHang], 200);
    } catch (Exception $e) {
        return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
    }
}

}
