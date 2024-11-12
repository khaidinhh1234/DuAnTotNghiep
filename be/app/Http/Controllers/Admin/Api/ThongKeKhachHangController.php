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
    public function thongKeDoTuoi(Request $request)
    {
        // Thống kê giới tính
        $gioiTinhLabels = ['nam', 'nu', 'khac', 'conlai'];
        $gioiTinhCounts = [
            'nam' => User::where('gioi_tinh', User::TYPE_NAM)->count(),
            'nu' => User::where('gioi_tinh', User::TYPE_NU)->count(),
            'khac' => User::where('gioi_tinh', User::TYPE_KHAC)->count(),
            'conlai' => User::whereNull('gioi_tinh')->orWhere('gioi_tinh', '=', null)->count()
        ];

        $gioiTinhValues = array_values($gioiTinhCounts); // Mảng số lượng giới tính
        $tongSoNguoiDung = array_sum($gioiTinhCounts); // Tổng số người dùng

        // Tính tỉ lệ phần trăm giới tính
        $gioiTinhPhanTram = [
            'nam' => $tongSoNguoiDung > 0 ? round(($gioiTinhCounts['nam'] / $tongSoNguoiDung) * 100, 2) : 0,
            'nu' => $tongSoNguoiDung > 0 ? round(($gioiTinhCounts['nu'] / $tongSoNguoiDung) * 100, 2) : 0,
            'khac' => $tongSoNguoiDung > 0 ? round(($gioiTinhCounts['khac'] / $tongSoNguoiDung) * 100, 2) : 0,
            'conlai' => $tongSoNguoiDung > 0 ? round(($gioiTinhCounts['conlai'] / $tongSoNguoiDung) * 100, 2) : 0,
        ];

        // Khởi tạo mảng tuổi và số lượng
        $tuoiLabels = ['duoi_18', '18_24', '25_34', '35_44', '45_54', 'tren_55'];
        $doTuoiCounts = array_fill_keys($tuoiLabels, 0);

        // Lấy danh sách tất cả khách hàng và tính toán tuổi
        $users = User::select('ngay_sinh')->get();

        //Thống kế số lượng người không nhập ngày sinh
        $ngaySinhUser = User::select('ngay_sinh')->get();

        $khongCoNgaysinh = $ngaySinhUser->whereNull('ngay_sinh')->count();
        $coNgaySinh = $ngaySinhUser->whereNotNull('ngay_sinh')->count();

        $phanTramKhongCoNgaySinh = $khongCoNgaysinh > 0 ? round(($khongCoNgaysinh / $ngaySinhUser->count()) * 100, 2) : 0;
        $phanTramCoNgaySinh = $coNgaySinh > 0 ? round(($coNgaySinh / $ngaySinhUser->count()) * 100, 2) : 0;
        foreach ($users as $user) {
            $tuoi = Carbon::parse($user->ngay_sinh)->age;

            if ($tuoi < 18) {
                $doTuoiCounts['duoi_18']++;
            } elseif ($tuoi >= 18 && $tuoi <= 24) {
                $doTuoiCounts['18_24']++;
            } elseif ($tuoi >= 25 && $tuoi <= 34) {
                $doTuoiCounts['25_34']++;
            } elseif ($tuoi >= 35 && $tuoi <= 44) {
                $doTuoiCounts['35_44']++;
            } elseif ($tuoi >= 45 && $tuoi <= 54) {
                $doTuoiCounts['45_54']++;
            } else {
                $doTuoiCounts['tren_55']++;
            }
        }

        // Tách riêng mảng tuổi và mảng số lượng
        $tuoiGroups = array_keys($doTuoiCounts);
        $soLuongGroups = array_values($doTuoiCounts);

        // Trả về kết hợp thống kê giới tính, tỷ lệ giới tính và độ tuổi
        return response()->json([
            'khong_co_ngay_sinh' => $khongCoNgaysinh,
            'co_ngay_sinh' => $coNgaySinh,
            'phan_tram_khong_co_ngay_sinh' => $phanTramKhongCoNgaySinh,
            'phan_tram_co_ngay_sinh' => $phanTramCoNgaySinh,
            'gioi_tinh_labels' => $gioiTinhLabels,
            'gioi_tinh_counts' => $gioiTinhValues,
            'gioi_tinh_percents' => $gioiTinhPhanTram,
            'tuoi' => $tuoiGroups,
            'so_luong' => $soLuongGroups,
        ]);
    }

    function rankVaChiTieu()
    {
        $hangs = HangThanhVien::with('users.donHangs')->get();

        $tenHangThanhVien = [];
        $soLuongThanhVien = [];
        $tongChiTieu = [];

        foreach ($hangs as $hang) {
            $tenHangThanhVien[] = $hang->ten_hang_thanh_vien;
            $soLuongThanhVien[] = $hang->users->count();

            $tongTienChiTieu = 0;
            foreach ($hang->users as $user) {
                $tongTienChiTieu += $user->donHangs
                    ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                    ->sum('tong_tien_don_hang');
            }
            $tongChiTieu[] = $tongTienChiTieu;
        }
        return [
            'ten_hang_thanh_vien' => $tenHangThanhVien,
            'so_luong_thanh_vien' => $soLuongThanhVien,
            'tong_chi_tieu' => $tongChiTieu,
        ];
    }
    public function thongKeKhachHangAll()
    {
        // Khởi tạo các mảng kết quả
        $soLuongKhachHangMoi = [];
        $soLuongKhachHangCu = [];
        $tongSoLuongKhachHang = [];
        $mocTime = [];

        // Lấy thời gian hiện tại
        $now = Carbon::now();
        $startDate = $now->copy()->subMonth(); // Ngày bắt đầu là 1 tháng trước

        // Tổng khách hàng cộng dồn
        $tongKhachHangCongDon = 0;

        // Tạo các mốc thời gian cho từng ngày từ 1 tháng trước đến hiện tại
        for ($date = $startDate; $date->lessThanOrEqualTo($now); $date->addDay()) {
            // Tính mốc thời gian hiện tại (cuối ngày)
            $mocThoiGianHienTai = $date->copy()->endOfDay(); // Mốc thời gian hiện tại (cuối ngày)
            $mocThoiGianTruoc = $date->copy()->startOfDay(); // Mốc thời gian trước đó (đầu ngày)

            // Tính khách hàng mới (đăng ký trong ngày hiện tại)
            $khachHangMoi = User::whereBetween('created_at', [$mocThoiGianTruoc, $mocThoiGianHienTai])->count();

            // Cập nhật số lượng khách hàng cũ
            $khachHangCu = User::where('created_at', '<', $now->copy()->subMonth())->count(); // Khách hàng cũ (đăng ký trước 1 tháng)

            // $khachHangCu =User::where('created_at', '<', $startDate->copy()->subMonth())->where('created_at', '>=', $startDate)->count();

            // Cộng dồn tổng số khách hàng mới
            $tongKhachHangCongDon += $khachHangMoi;

            // Lưu dữ liệu vào mảng cho mỗi ngày
            if ($date->day % 2 == 1) { // Chỉ lưu dữ liệu cho các ngày lẻ (1, 3, 5, ...)
                $mocTime[] = $date->format('Y-m-d'); // Thêm mốc thời gian vào mảng
                $soLuongKhachHangMoi[] = $tongKhachHangCongDon; // Tổng khách hàng mới cộng dồn
                $soLuongKhachHangCu[] = $khachHangCu; // Khách hàng cũ (đăng ký trước 1 tháng)
                $tongSoLuongKhachHang[] = $tongKhachHangCongDon + $khachHangCu; // Tổng số khách hàng
            }
        }

        // Trả về kết quả dưới dạng JSON
        return response()->json([
            'so_luong_khach_hang_moi' => $soLuongKhachHangMoi,  // Tổng khách hàng mới cộng dồn
            'so_luong_khach_hang_cu' => $soLuongKhachHangCu,    // Khách hàng cũ (đăng ký trước 1 tháng)
            'tong_so_luong_khach_hang' => $tongSoLuongKhachHang,  // Tổng số khách hàng
            'moc_time' => $mocTime  // Mốc thời gian (ngày)
        ]);

    }
    function top10KhachHangTieuBieu()
    {
        // Lấy thời gian 1 tháng trước
        $now = Carbon::now();
        $motThangTruoc = $now->copy()->subMonth();

        // Truy vấn để lấy thông tin các khách hàng và tính toán các thông số
        $topKhachHang = User::select('users.id', 'users.anh_nguoi_dung', 'users.ho', 'users.ten', 'users.so_dien_thoai', 'hang_thanh_viens.ten_hang_thanh_vien', 'hang_thanh_viens.anh_hang_thanh_vien')
            ->join('hang_thanh_viens', 'users.hang_thanh_vien_id', '=', 'hang_thanh_viens.id') // Tham gia với bảng hạng thành viên
            ->withCount([
                'donHangs as tong_so_don' => function ($query) use ($motThangTruoc) {
                    $query->where('created_at', '>=', $motThangTruoc);
                },
                'donHangs as so_don_thanh_cong' => function ($query) use ($motThangTruoc) {
                    $query->where('created_at', '>=', $motThangTruoc)
                        ->where('trang_thai_don_hang', DonHang::TTDH_HTDH); // Trạng thái hoàn tất đơn hàng
                },
                'donHangs as so_don_huy' => function ($query) use ($motThangTruoc) {
                    $query->where('created_at', '>=', $motThangTruoc)
                        ->where('trang_thai_don_hang', DonHang::TTDH_DH); // Trạng thái hủy
                }
            ])
            ->withSum([
                'donHangs as tong_tien_mua_hang' => function ($query) use ($motThangTruoc) {
                    $query->where('created_at', '>=', $motThangTruoc)
                        ->where('trang_thai_don_hang', DonHang::TTDH_HTDH); // Chỉ tính tiền cho các đơn hàng thành công
                },
            ], 'tong_tien_don_hang')
            ->orderByDesc('tong_tien_mua_hang') // Sắp xếp theo tổng chi tiêu
            ->orderBy('so_don_huy') // Ưu tiên khách có ít đơn hủy
            ->limit(10) // Giới hạn top 10 khách hàng
            ->get();

        // Định dạng kết quả
        $result = $topKhachHang->map(function ($khachHang) {
            return [
                'ten_khach_hang' => $khachHang->ho . ' ' . $khachHang->ten,
                'so_dien_thoai' => $khachHang->so_dien_thoai,
                'anh_nguoi_dung' => $khachHang->anh_nguoi_dung,
                'ten_hang_thanh_vien' => $khachHang->ten_hang_thanh_vien,
                'anh_hang_thanh_vien' => $khachHang->anh_hang_thanh_vien,
                'tong_so_don' => $khachHang->tong_so_don,
                'so_don_thanh_cong' => $khachHang->so_don_thanh_cong,
                'so_don_huy' => $khachHang->so_don_huy,
                'tong_tien_mua_hang' => (int) $khachHang->tong_tien_mua_hang,
            ];
        });

        // Trả về kết quả dưới dạng JSON
        return response()->json($result);
    }
}
