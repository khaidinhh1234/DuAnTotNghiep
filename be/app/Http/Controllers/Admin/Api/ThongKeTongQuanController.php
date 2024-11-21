<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
// use App\Http\Requests\Request;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\SanPham;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThongKeTongQuanController extends Controller
{

    // public function thongKeTongQuan(Request $request)
    // {
    //     // Gọi hàm thống kê doanh thu theo khoảng
    //     $doanhThuTheoKhoang = $this->doanhThuTheoKhoang($request);

    //     // Gọi hàm so sánh trạng thái đơn hàng trong khoảng
    //     $trangThaiKhoangDonSoSanh = $this->trangThaiKhoangDonSoSanh($request);

    //     // Gọi hàm thống kê đơn hàng chốt
    //     $thongKeDonHangChot = $this->thongKeDonHangChot($request);

    //     // Gọi hàm thống kê hoàn hàng
    //     $thongKeHoanHang = $this->thongKeHoanHang($request);

    //     // Gọi hàm thống kê sản phẩm tồn kho
    //     $thongKeSanPhamTonKho = $this->thongKeSanPhamTonKho($request);

    //     // Gọi hàm thống kê doanh thu tổng
    //     $thongKeDoanhThuTong = $this->thongKeDoanhThuTong($request);

    //     // Gọi hàm thống kê lợi nhuận
    //     $thongKeLoiNhuan = $this->thongKeLoiNhuan($request);

    //     // Gọi hàm thống kê thanh toán online
    //     $thongKeThanhToanOnline = $this->thongKeThanhToanOnline($request);

    //     // Gọi hàm thống kê thanh toán offline
    //     $thongKeThanhToanOff = $this->thongKeThanhToanOff($request);

    //     // Gọi hàm thống kê doanh số sản phẩm
    //     $thongKeDoanhSoSanPham = $this->thongKeDoanhSoSanPham($request);

    //     // Gọi hàm thống kê doanh thu trung bình
    //     $thongKeDoanhThuTB = $this->thongKeDoanhThuTB($request);

    //     // Tổng hợp kết quả từ các hàm thống kê
    //     return response()->json([
    //         'doanh_thu_theo_khoang' => $doanhThuTheoKhoang->original,
    //         'trang_thai_don_hang_so_sanh' => $trangThaiKhoangDonSoSanh->original,
    //         'thong_ke_don_hang_chot' => $thongKeDonHangChot->original,
    //         'thong_ke_hoan_hang' => $thongKeHoanHang->original,
    //         'thong_ke_san_pham_ton_kho' => $thongKeSanPhamTonKho->original,
    //         'thong_ke_doanh_thu' => $thongKeDoanhThuTong->original,
    //         'thong_ke_loi_nhuan' => $thongKeLoiNhuan->original,
    //         'thong_ke_thanh_toan_online' => $thongKeThanhToanOnline->original,
    //         'thong_ke_thanh_toan_off' => $thongKeThanhToanOff->original,
    //         'thong_ke_doanh_so_san_pham' => $thongKeDoanhSoSanPham->original,
    //         'thong_ke_doanh_thu_tb' => $thongKeDoanhThuTB->original,
    //     ]);
    // }

    // public function thongKeDonHangChot(Request $request)
    // {
    //     $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
    //     $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();
    //     $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

    //     $trangThai = [
    //         DonHang::TTDH_CXH,
    //         // DonHang::TTDH_DXH,
    //         // DonHang::TTDH_DXL,
    //         // DonHang::TTDH_DGH,
    //         // DonHang::TTDH_HTDH,
    //         // DonHang::TTDH_CKHCN,
    //     ];

    //     // Cache key for current period
    //     $cacheKeyCurrent = "thong_ke_don_hang_chot_{$ngayBatDau}_{$ngayKetThuc}";

    //     $donHangChot = Cache::remember($cacheKeyCurrent, 60, function () use ($ngayBatDau, $ngayKetThuc, $trangThai) {
    //         return DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
    //             ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
    //             ->whereIn('trang_thai_don_hang', $trangThai)
    //             ->get();
    //     });

    //     $tongTien = $donHangChot->sum('tong_tien_don_hang');
    //     $tongSoLuongDonHang = $donHangChot->count();

    //     // Calculate previous period dates
    //     $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
    //     $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

    //     // Cache key for previous period
    //     $cacheKeyPrevious = "thong_ke_don_hang_chot_truoc_{$ngayBatDauTruoc}_{$ngayKetThucTruoc}";

    //     $donHangChotTruoc = Cache::remember($cacheKeyPrevious, 60, function () use ($ngayBatDauTruoc, $ngayKetThucTruoc, $trangThai) {
    //         return DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
    //             ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
    //             ->whereIn('trang_thai_don_hang', $trangThai)
    //             ->get();
    //     });

    //     $tongTienTruoc = $donHangChotTruoc->sum('tong_tien_don_hang');
    //     $tongSoLuongDonHangTruoc = $donHangChotTruoc->count();

    //     // Calculate percentage change
    //     $tiLeTangGiamDonHang = $tongSoLuongDonHangTruoc > 0
    //         ? (($tongSoLuongDonHang - $tongSoLuongDonHangTruoc) / $tongSoLuongDonHangTruoc) * 100
    //         : ($tongSoLuongDonHang > 0 ? 100 : 0);

    //     $tiLeTangGiamTien = $tongTienTruoc > 0
    //         ? (($tongTien - $tongTienTruoc) / $tongTienTruoc) * 100
    //         : ($tongTien > 0 ? 100 : 0);

    //     return response()->json([
    //         'tong_so_luong_don_hang' => $tongSoLuongDonHang,
    //         'tong_tien' => $tongTien,
    //         'tong_so_luong_don_hang_truoc' => $tongSoLuongDonHangTruoc,
    //         'tong_tien_truoc' => $tongTienTruoc,
    //         'ti_le_tang_giam_don_hang' => round($tiLeTangGiamDonHang, 2),
    //         'ti_le_tang_giam_tien' => round($tiLeTangGiamTien, 2),
    //     ]);
    // }

    // public function thongKeHoanHang(Request $request)
    // {
    //     // Lấy ngày bắt đầu và kết thúc từ request (hoặc mặc định là 10 ngày gần nhất)
    //     $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9))->startOfDay();
    //     $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

    //     // Tạo một cache key duy nhất dựa trên ngày bắt đầu và ngày kết thúc
    //     $cacheKey = "thong_ke_hoan_hang_{$ngayBatDau->format('Ymd')}_{$ngayKetThuc->format('Ymd')}";

    //     // Sử dụng cache để lưu kết quả trong 10 phút (600 giây)
    //     return Cache::remember($cacheKey, 600, function () use ($ngayBatDau, $ngayKetThuc) {
    //         // Tính khoảng thời gian để so sánh trước đó
    //         $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

    //         // Lấy các đơn hàng hoàn trả trong khoảng thời gian hiện tại
    //         $donHangHoan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)
    //             ->whereBetween('ngay_hoan', [$ngayBatDau, $ngayKetThuc])
    //             ->get();

    //         // Tính tổng số lượng đơn hàng hoàn và tổng tiền hoàn
    //         $tongTienHoan = $donHangHoan->sum('tong_tien_don_hang');
    //         $tongSoLuongDonHangHoan = $donHangHoan->count();

    //         // Lấy khoảng thời gian trước đó để so sánh
    //         $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
    //         $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

    //         // Lấy các đơn hàng hoàn trả trong khoảng thời gian trước đó
    //         $donHangHoanTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)
    //             ->whereBetween('ngay_hoan', [$ngayBatDauTruoc, $ngayKetThucTruoc])
    //             ->get();

    //         // Tính tổng số lượng đơn hàng hoàn trước đó và tổng tiền hoàn trước đó
    //         $tongTienHoanTruoc = $donHangHoanTruoc->sum('tong_tien_don_hang');
    //         $tongSoLuongDonHangHoanTruoc = $donHangHoanTruoc->count();

    //         // Tính tỷ lệ tăng giảm số lượng đơn hàng hoàn
    //         $tiLeTangGiamDonHangHoan = $tongSoLuongDonHangHoanTruoc > 0
    //             ? (($tongSoLuongDonHangHoan - $tongSoLuongDonHangHoanTruoc) / $tongSoLuongDonHangHoanTruoc) * 100
    //             : ($tongSoLuongDonHangHoan > 0 ? 100 : 0);

    //         // Tính tỷ lệ tăng giảm tổng tiền hoàn
    //         $tiLeTangGiamTienHoan = $tongTienHoanTruoc > 0
    //             ? (($tongTienHoan - $tongTienHoanTruoc) / $tongTienHoanTruoc) * 100
    //             : ($tongTienHoan > 0 ? 100 : 0);

    //         // Kết quả thống kê
    //         return [
    //             'tong_so_luong_don_hang_hoan' => $tongSoLuongDonHangHoan,
    //             'tong_tien_hoan' => $tongTienHoan,
    //             'tong_so_luong_don_hang_hoan_truoc' => $tongSoLuongDonHangHoanTruoc,
    //             'tong_tien_hoan_truoc' => $tongTienHoanTruoc,
    //             'ti_le_tang_giam_don_hang_hoan' => $tiLeTangGiamDonHangHoan,
    //             'ti_le_tang_giam_tien_hoan' => $tiLeTangGiamTienHoan,
    //         ];
    //     });
    // }
    // public function thongKeTongSanPham(Request $request)
    // {
    //     // Xác định khoảng thời gian
    //     $ngayBatDau = $request->has('ngay_bat_dau')
    //         ? Carbon::parse($request->input('ngay_bat_dau'))->setTimezone('Asia/Ho_Chi_Minh')->startOfDay()
    //         : now()->subDays(10)->setTimezone('Asia/Ho_Chi_Minh')->startOfDay();

    //     $ngayKetThuc = $request->has('ngay_ket_thuc')
    //         ? Carbon::parse($request->input('ngay_ket_thuc'))->setTimezone('Asia/Ho_Chi_Minh')->endOfDay()
    //         : now()->setTimezone('Asia/Ho_Chi_Minh')->endOfDay();

    //     $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc);

    //     // Lấy danh sách sản phẩm trong khoảng thời gian
    //     $sanPhamTonKho = SanPham::whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
    //         ->with(['bienTheSanPham'])
    //         ->get();

    //     // Khởi tạo biến tổng
    //     $tongSoLuongTonKhoTatCaSanPham = 0;
    //     $tongChiPhiSanXuat = 0;
    //     $tongGiaBan = 0;

    //     // Tính toán thống kê
    //     foreach ($sanPhamTonKho as $sanPham) {
    //         foreach ($sanPham->bienTheSanPham as $bienThe) {
    //             $tongSoLuongTonKhoTatCaSanPham += $bienThe->so_luong_bien_the;
    //             $tongChiPhiSanXuat += $bienThe->chi_phi_san_xuat * $bienThe->so_luong_bien_the;
    //             $tongGiaBan += $bienThe->gia_ban * $bienThe->so_luong_bien_the;
    //         }
    //     }

    //     // Lấy dữ liệu của khoảng thời gian trước đó
    //     $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
    //     $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

    //     $sanPhamTonKhoTruoc = SanPham::whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
    //         ->with(['bienTheSanPham:id,san_pham_id,so_luong_bien_the,chi_phi_san_xuat,gia_ban'])
    //         ->get();

    //     $tongSoLuongTonKhoTatCaSanPhamTruoc = 0;
    //     $tongChiPhiSanXuatTruoc = 0;
    //     $tongGiaBanTruoc = 0;

    //     foreach ($sanPhamTonKhoTruoc as $sanPham) {
    //         foreach ($sanPham->bienTheSanPham as $bienThe) {
    //             $tongSoLuongTonKhoTatCaSanPhamTruoc += $bienThe->so_luong_bien_the;
    //             $tongChiPhiSanXuatTruoc += $bienThe->chi_phi_san_xuat * $bienThe->so_luong_bien_the;
    //             $tongGiaBanTruoc += $bienThe->gia_ban * $bienThe->so_luong_bien_the;
    //         }
    //     }

    //     // Tính tỉ lệ tăng/giảm tồn kho
    //     $tiLeTangGiamTonKho = $tongSoLuongTonKhoTatCaSanPhamTruoc > 0
    //         ? (($tongSoLuongTonKhoTatCaSanPham - $tongSoLuongTonKhoTatCaSanPhamTruoc) / $tongSoLuongTonKhoTatCaSanPhamTruoc) * 100
    //         : ($tongSoLuongTonKhoTatCaSanPham > 0 ? 100 : 0);

    //     // Trả về kết quả dưới dạng JSON
    //     return response()->json([
    //         'tong_so_luong_ton_kho' => $tongSoLuongTonKhoTatCaSanPham,
    //         'tong_chi_phi_san_xuat' => $tongChiPhiSanXuat,
    //         'tong_gia_ban' => $tongGiaBan,
    //         'tong_so_luong_ton_kho_truoc' => $tongSoLuongTonKhoTatCaSanPhamTruoc,
    //         'tong_chi_phi_san_xuat_truoc' => $tongChiPhiSanXuatTruoc,
    //         'tong_gia_ban_truoc' => $tongGiaBanTruoc,
    //         'ti_le_tang_giam_ton_kho' => round($tiLeTangGiamTonKho, 2) // Làm tròn 2 chữ số thập phân
    //     ]);
    // }
    
    public function thongKeTongQuanTheoKhoang1(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9))->startOfDay();
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
    
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);
    
        // **1. Thống kê đơn hàng chốt**
        $donHangChot = DonHang::whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->whereIn('trang_thai_don_hang', [DonHang::TTDH_CXH])
            ->get();
        $tongTienChot = $donHangChot->sum('tong_tien_don_hang');
        $tongSoLuongDonHangChot = $donHangChot->count();
    
        $donHangChotTruoc = DonHang::whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->whereIn('trang_thai_don_hang', [DonHang::TTDH_CXH])
            ->get();
        $tongTienChotTruoc = $donHangChotTruoc->sum('tong_tien_don_hang');
        $tongSoLuongDonHangChotTruoc = $donHangChotTruoc->count();
    
        $tiLeTangGiamDonHangChot = $tongSoLuongDonHangChotTruoc > 0
            ? (($tongSoLuongDonHangChot - $tongSoLuongDonHangChotTruoc) / $tongSoLuongDonHangChotTruoc) * 100
            : ($tongSoLuongDonHangChot > 0 ? 100 : 0);
        $tiLeTangGiamTienChot = $tongTienChotTruoc > 0
            ? (($tongTienChot - $tongTienChotTruoc) / $tongTienChotTruoc) * 100
            : ($tongTienChot > 0 ? 100 : 0);
    
        // **2. Thống kê hoàn hàng**
        $donHangHoan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('ngay_hoan', [$ngayBatDau, $ngayKetThuc])
            ->get();
        $tongTienHoan = $donHangHoan->sum('tong_tien_don_hang');
        $tongSoLuongDonHangHoan = $donHangHoan->count();
    
        $donHangHoanTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('ngay_hoan', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();
        $tongTienHoanTruoc = $donHangHoanTruoc->sum('tong_tien_don_hang');
        $tongSoLuongDonHangHoanTruoc = $donHangHoanTruoc->count();
    
        $tiLeTangGiamDonHangHoan = $tongSoLuongDonHangHoanTruoc > 0
            ? (($tongSoLuongDonHangHoan - $tongSoLuongDonHangHoanTruoc) / $tongSoLuongDonHangHoanTruoc) * 100
            : ($tongSoLuongDonHangHoan > 0 ? 100 : 0);
        $tiLeTangGiamTienHoan = $tongTienHoanTruoc > 0
            ? (($tongTienHoan - $tongTienHoanTruoc) / $tongTienHoanTruoc) * 100
            : ($tongTienHoan > 0 ? 100 : 0);
    
        // **3. Thống kê tồn kho sản phẩm**
        $sanPhamTonKho = SanPham::whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->with(['bienTheSanPham'])
            ->get();
    
        $tongSoLuongTonKho = $sanPhamTonKho->sum(fn($sp) => $sp->bienTheSanPham->sum('so_luong_bien_the'));
        $tongChiPhiSanXuat = $sanPhamTonKho->sum(fn($sp) => $sp->bienTheSanPham->sum(fn($bt) => $bt->chi_phi_san_xuat * $bt->so_luong_bien_the));
        $tongGiaBan = $sanPhamTonKho->sum(fn($sp) => $sp->bienTheSanPham->sum(fn($bt) => $bt->gia_ban * $bt->so_luong_bien_the));
    
        $sanPhamTonKhoTruoc = SanPham::whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->with(['bienTheSanPham'])
            ->get();
    
        $tongSoLuongTonKhoTruoc = $sanPhamTonKhoTruoc->sum(fn($sp) => $sp->bienTheSanPham->sum('so_luong_bien_the'));
    
        $tiLeTangGiamTonKho = $tongSoLuongTonKhoTruoc > 0
            ? (($tongSoLuongTonKho - $tongSoLuongTonKhoTruoc) / $tongSoLuongTonKhoTruoc) * 100
            : ($tongSoLuongTonKho > 0 ? 100 : 0);
    
        return response()->json([
            'don_hang_chot' => [
                'tong_so_luong' => $tongSoLuongDonHangChot,
                'tong_tien' => $tongTienChot,
                'ti_le_tang_giam_so_luong' => round($tiLeTangGiamDonHangChot, 2),
                'ti_le_tang_giam_tien' => round($tiLeTangGiamTienChot, 2),
            ],
            'don_hang_hoan' => [
                'tong_so_luong' => $tongSoLuongDonHangHoan,
                'tong_tien' => $tongTienHoan,
                'ti_le_tang_giam_so_luong' => round($tiLeTangGiamDonHangHoan, 2),
                'ti_le_tang_giam_tien' => round($tiLeTangGiamTienHoan, 2),
            ],
            'ton_kho_san_pham' => [
                'tong_so_luong' => $tongSoLuongTonKho,
                'tong_chi_phi_san_xuat' => $tongChiPhiSanXuat,
                'tong_gia_ban' => $tongGiaBan,
                'ti_le_tang_giam_ton_kho' => round($tiLeTangGiamTonKho, 2),
            ],
        ]);
    }
    
    

    public function thongKeDoanhThuTong(Request $request)
    {
        try {
            // Lấy ngày bắt đầu và ngày kết thúc từ request hoặc dùng giá trị mặc định
            $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
            $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();
            $trangThai = [
                DonHang::TTDH_DGH,
                DonHang::TTDH_HTDH,
                DonHang::TTDH_CKHCN,
            ];
            $donHangs = DonHang::whereIn('trang_thai_don_hang', $trangThai)
                ->where(function ($query) use ($ngayBatDau, $ngayKetThuc) {
                    // Nếu trạng thái thanh toán là PTTT_TT, lọc theo ngày hoàn thành đơn
                    $query->where(function ($q) use ($ngayBatDau, $ngayKetThuc) {
                        $q->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
                            ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc]);
                    })
                        // Nếu trạng thái thanh toán là PTTT_MM_ATM hoặc PTTT_MM_QR, lọc theo created_at
                        ->orWhere(function ($q) use ($ngayBatDau, $ngayKetThuc) {
                            $q->whereIn('phuong_thuc_thanh_toan', [DonHang::PTTT_MM_ATM, DonHang::PTTT_MM_QR])
                                ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                                ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc]);
                        });
                })
                ->get();
            // Tính tổng doanh thu và số đơn hàng trong khoảng thời gian
            $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
            $soDonHang = $donHangs->count();

            // Tính khoảng thời gian (số ngày)
            $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

            // Khoảng thời gian trước (để so sánh)
            $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
            $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

            // Lấy danh sách đơn hàng trong khoảng thời gian trước
            $donHangsTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDauTruoc, $ngayKetThucTruoc])
                ->get();

            // Tính tổng doanh thu và số đơn hàng trong khoảng thời gian trước
            $tongDoanhThuTruoc = $donHangsTruoc->sum('tong_tien_don_hang');
            $soDonHangTruoc = $donHangsTruoc->count();

            // Tính tỷ lệ tăng/giảm doanh thu
            $tiLeTangGiamDoanhThu = $tongDoanhThuTruoc > 0
                ? (($tongDoanhThu - $tongDoanhThuTruoc) / $tongDoanhThuTruoc) * 100
                : ($tongDoanhThu > 0 ? 100 : 0);

            // Trả về dữ liệu dưới dạng JSON
            return response()->json([
                'tong_doanh_thu' => $tongDoanhThu,
                'so_don_hang' => $soDonHang,
                'tong_doanh_thu_truoc' => $tongDoanhThuTruoc,
                'so_don_hang_truoc' => $soDonHangTruoc,
                'ti_le_tang_giam_doanh_thu' => round($tiLeTangGiamDoanhThu, 2)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Đã xảy ra lỗi',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function thongKeThanhToanOnline(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        $trangThai = [
            DonHang::TTDH_DGH,
            DonHang::TTDH_HTDH,
            DonHang::TTDH_CKHCN,
        ];

        $donHangs = DonHang::whereIn('trang_thai_don_hang', $trangThai)
            ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
            ->whereIn('phuong_thuc_thanh_toan', [DonHang::PTTT_MM_ATM, DonHang::PTTT_MM_QR])
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
        $soDonHang = $donHangs->count();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        $donHangsTruoc = DonHang::whereIn('trang_thai_don_hang', $trangThai)
            ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
            ->whereIn('phuong_thuc_thanh_toan', [DonHang::PTTT_MM_ATM, DonHang::PTTT_MM_QR])
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        $tongDoanhThuTruoc = $donHangsTruoc->sum('tong_tien_don_hang');
        $soDonHangTruoc = $donHangsTruoc->count();

        $tiLeTangGiamDoanhThu = $tongDoanhThuTruoc > 0
            ? (($tongDoanhThu - $tongDoanhThuTruoc) / $tongDoanhThuTruoc) * 100
            : ($tongDoanhThu > 0 ? 100 : 0);

        return response()->json([
            'tong_doanh_thu' => $tongDoanhThu,
            'so_don_hang' => $soDonHang,
            'tong_doanh_thu_truoc' => $tongDoanhThuTruoc,
            'so_don_hang_truoc' => $soDonHangTruoc,
            'ti_le_tang_giam_doanh_thu' => round($tiLeTangGiamDoanhThu, 2)
        ]);
    }
    public function thongKeThanhToanOff(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        // $trangThaiBiLoaiBo = [
        //     DonHang::TTDH_DH,   // Hủy hàng
        //     DonHang::TTDH_HTDH, // Hoàn tất đơn hàng
        //     DonHang::TTDH_DHTB, // Đơn hàng bị từ chối nhận
        //     DonHang::TTDH_HH    // Hoàn hàng
        // ];

        // Lấy đơn hàng theo các điều kiện
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
            ->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc])
            ->get();

        // Tính tổng doanh thu và số đơn hàng trong khoảng thời gian hiện tại
        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
        $soDonHang = $donHangs->count();

        // Tính khoảng thời gian để lấy dữ liệu trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy đơn hàng trước đó
        $donHangsTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
            ->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        // Tính tổng doanh thu và số đơn hàng trước đó
        $tongDoanhThuTruoc = $donHangsTruoc->sum('tong_tien_don_hang');
        $soDonHangTruoc = $donHangsTruoc->count();

        // Tính tỷ lệ tăng giảm doanh thu
        $tiLeTangGiamDoanhThu = $tongDoanhThuTruoc > 0
            ? (($tongDoanhThu - $tongDoanhThuTruoc) / $tongDoanhThuTruoc) * 100
            : ($tongDoanhThu > 0 ? 100 : 0);

        // Trả về kết quả
        return response()->json([
            'tong_doanh_thu' => $tongDoanhThu,
            'so_don_hang' => $soDonHang,
            'tong_doanh_thu_truoc' => $tongDoanhThuTruoc,
            'so_don_hang_truoc' => $soDonHangTruoc,
            'ti_le_tang_giam_doanh_thu' => round($tiLeTangGiamDoanhThu, 2)
        ]);
    }
    public function thongKeLoiNhuan(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        // Lấy danh sách đơn hàng hoàn tất trong khoảng thời gian
        $donHangs = DonHang::query()->with(['chiTiets.bienTheSanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereBetween('ngay_hoan_thanh_don', values: [$ngayBatDau, $ngayKetThuc])
            ->get();

        // Tính tổng doanh thu và tổng chi phí sản xuất hiện tại
        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
        $tongChiSanXuat = $donHangs->sum(function ($donHang) {
            return $donHang->chiTiets->sum(function ($chiTiet) {
                return $chiTiet->bienTheSanPham->chi_phi_san_xuat * $chiTiet->so_luong;
            });
        });

        // Tính tổng lợi nhuận hiện tại
        $tongLoiNhuan = $tongDoanhThu - $tongChiSanXuat;

        // Lấy khoảng thời gian trước để so sánh
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy danh sách đơn hàng hoàn tất trong khoảng thời gian trước
        $donHangsTruoc = DonHang::query()->with(['chiTiets.bienTheSanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        // Tính tổng doanh thu và tổng chi phí sản xuất trước
        $tongDoanhThuTruoc = $donHangsTruoc->sum('tong_tien_don_hang');
        $tongChiSanXuatTruoc = $donHangsTruoc->sum(function ($donHang) {
            return $donHang->chiTiets->sum(function ($chiTiet) {
                return $chiTiet->bienTheSanPham->chi_phi_san_xuat * $chiTiet->so_luong;
            });
        });

        // Tính tổng lợi nhuận trước
        $tongLoiNhuanTruoc = $tongDoanhThuTruoc - $tongChiSanXuatTruoc;

        // Tính tỷ lệ tăng giảm lợi nhuận
        if ($tongLoiNhuanTruoc == 0) {
            // Nếu lợi nhuận trước bằng 0, ta so sánh xem lợi nhuận hiện tại tăng hay giảm
            $tiLeTangGiamLoiNhuan = $tongLoiNhuan > 0 ? 100 : -100;  // Nếu lợi nhuận hiện tại dương, tỷ lệ là +100%, nếu âm thì là -100%
        } else {
            $tiLeTangGiamLoiNhuan = (($tongLoiNhuan - $tongLoiNhuanTruoc) / $tongLoiNhuanTruoc) * 100;
        }
        return response()->json([
            'tong_doanh_thu' => $tongDoanhThu,
            'tong_chi_san_xuat' => $tongChiSanXuat,
            'tong_loi_nhuan' => $tongLoiNhuan,
            'tong_doanh_thu_truoc' => $tongDoanhThuTruoc,
            'tong_chi_san_xuat_truoc' => $tongChiSanXuatTruoc,
            'tong_loi_nhuan_truoc' => $tongLoiNhuanTruoc,
            'ti_le_tang_giam_loi_nhuan' => round($tiLeTangGiamLoiNhuan, 2)
        ]);
    }
    public function thongKeDoanhSoSanPham(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        // Lấy tổng số lượng đơn hàng và tổng số lượng sản phẩm trong khoảng thời gian hiện tại (TTDH_HTDH)
        $donHangsHienTai = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc])
            ->get();

        // Tổng số lượng đơn hàng hiện tại
        $tongSoDonHangHienTai = $donHangsHienTai->count();

        // Tổng số lượng sản phẩm được lên đơn trong khoảng thời gian hiện tại
        $tongSoLuongSanPhamHienTai = $donHangsHienTai->sum(function ($donHang) {
            return $donHang->chiTiets ? $donHang->chiTiets->sum('so_luong') : 0;
        });

        // Tính khoảng thời gian trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy tổng số lượng đơn hàng và tổng số lượng sản phẩm trong khoảng thời gian trước đó (TTDH_HTDH)
        $donHangsTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        // Tổng số lượng đơn hàng trước đó
        $tongSoDonHangTruoc = $donHangsTruoc->count();

        // Tổng số lượng sản phẩm được lên đơn trong khoảng thời gian trước đó
        $tongSoLuongSanPhamTruoc = $donHangsTruoc->sum(function ($donHang) {
            return $donHang->chiTiets ? $donHang->chiTiets->sum('so_luong') : 0;
        });

        // Tính tỷ lệ phần trăm thay đổi doanh số (dựa trên số lượng đơn hàng)
        $tiLeTangGiamDonHang = $tongSoDonHangTruoc > 0
            ? (($tongSoDonHangHienTai - $tongSoDonHangTruoc) / $tongSoDonHangTruoc) * 100
            : ($tongSoDonHangHienTai > 0 ? 100 : 0);

        // Tính tỷ lệ phần trăm thay đổi tổng số lượng sản phẩm
        $tiLeTangGiamSanPham = $tongSoLuongSanPhamTruoc > 0
            ? (($tongSoLuongSanPhamHienTai - $tongSoLuongSanPhamTruoc) / $tongSoLuongSanPhamTruoc) * 100
            : ($tongSoLuongSanPhamHienTai > 0 ? 100 : 0);

        // Trả về kết quả
        return response()->json([
            'tong_doanh_so_hien_tai' => $tongSoDonHangHienTai,
            'tong_so_luong_san_pham_hien_tai' => $tongSoLuongSanPhamHienTai,
            'tong_doanh_so_truoc' => $tongSoDonHangTruoc,
            'tong_so_luong_san_pham_truoc' => $tongSoLuongSanPhamTruoc,
            'ti_le_tang_giam_don_hang' => $tiLeTangGiamDonHang,
            'ti_le_tang_giam_san_pham' => $tiLeTangGiamSanPham
        ]);
    }
    public function thongKeDoanhThuTB(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        // Lấy tất cả các đơn hàng có trạng thái "Giao hàng thành công" trong khoảng thời gian hiện tại
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereBetween('ngay_hoan_thanh_don', values: [$ngayBatDau, $ngayKetThuc])
            ->with('chiTiets.bienTheSanPham')  // Lấy chi tiết đơn hàng và biến thể sản phẩm
            ->get();

        // Tính tổng doanh thu và số lượng đơn hàng hiện tại
        $tongDoanhThuHienTai = 0;
        $tongSoLuongDonHangHienTai = $donHangs->count();

        foreach ($donHangs as $donHang) {
            foreach ($donHang->chiTiets as $chiTiet) {
                $tongDoanhThuHienTai += $chiTiet->don_gia * $chiTiet->so_luong;
            }
        }

        // Tính doanh thu trung bình hiện tại
        $doanhThuTBHienTai = $tongSoLuongDonHangHienTai > 0
            ? $tongDoanhThuHienTai / $tongSoLuongDonHangHienTai
            : 0;

        // Tính toán dữ liệu cho khoảng thời gian trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy tất cả các đơn hàng có trạng thái "Giao hàng thành công" trong khoảng thời gian trước đó
        $donHangsTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->with('chiTiets.bienTheSanPham')
            ->get();

        // Tính tổng doanh thu và số lượng đơn hàng trước đó
        $tongDoanhThuTruoc = 0;
        $tongSoLuongDonHangTruoc = $donHangsTruoc->count();

        foreach ($donHangsTruoc as $donHang) {
            foreach ($donHang->chiTiets as $chiTiet) {
                $tongDoanhThuTruoc += $chiTiet->don_gia * $chiTiet->so_luong;
            }
        }

        // Tính doanh thu trung bình trước đó
        $doanhThuTBTruoc = $tongSoLuongDonHangTruoc > 0
            ? $tongDoanhThuTruoc / $tongSoLuongDonHangTruoc
            : 0;

        // So sánh doanh thu trung bình giữa hai khoảng thời gian
        $tiLeTangGiamDoanhThuTB = $doanhThuTBTruoc > 0
            ? (($doanhThuTBHienTai - $doanhThuTBTruoc) / $doanhThuTBTruoc) * 100
            : ($doanhThuTBHienTai > 0 ? 100 : 0);

        // Trả về kết quả
        return response()->json([
            'doanh_thu_tb_hien_tai' => $doanhThuTBHienTai,
            'doanh_thu_tb_truoc' => $doanhThuTBTruoc,
            'ti_le_tang_giam_doanh_thu_tb' => $tiLeTangGiamDoanhThuTB,
        ]);
    }
    public function doanhThuTheoKhoang(Request $request)
    {
        $ngayBatDau = $request->has('ngay_bat_dau')
            ? Carbon::parse($request->input('ngay_bat_dau'))->setTimezone('Asia/Ho_Chi_Minh')->startOfDay()
            : now()->subDays(10)->setTimezone('Asia/Ho_Chi_Minh')->startOfDay();


        $ngayKetThuc = $request->has('ngay_ket_thuc')
            ? Carbon::parse($request->input('ngay_ket_thuc'))->setTimezone('Asia/Ho_Chi_Minh')->endOfDay()
            : now()->setTimezone('Asia/Ho_Chi_Minh')->endOfDay();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc);

        // Doanh thu hoàn tất
        $doanhThuHoanTat = DonHang::selectRaw('DATE(ngay_hoan_thanh_don) as ngay, SUM(tong_tien_don_hang) as doanh_thu')
            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc])
            ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->groupBy('ngay')
            ->get()
            ->keyBy('ngay');


        $tongDoanhThuHoanTat = $doanhThuHoanTat->sum('doanh_thu');

        // Doanh thu hủy/hoàn
        $doanhThuHoan = DonHang::selectRaw('DATE(ngay_hoan) as ngay, SUM(tong_tien_don_hang) as doanh_thu')
            ->whereBetween('ngay_hoan', [$ngayBatDau, $ngayKetThuc])
            ->where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->groupBy('ngay')
            ->get()
            ->keyBy('ngay');

        $tongDoanhThuHoan = $doanhThuHoan->sum('doanh_thu');

        // Chuẩn bị dữ liệu doanh thu từng ngày
        $doanhThuHoanTatTheoNgay = [];
        $doanhThuHoanTheoNgay = [];
        $ngayTrongKhoang = [];

        for ($i = 0; $i <= $khoangThoiGian; $i++) {
            $ngay = $ngayBatDau->copy()->addDays($i)->format('Y-m-d');
            $ngayTrongKhoang[] = $ngay;
            $doanhThuHoanTatTheoNgay[] = $doanhThuHoanTat->get($ngay)->doanh_thu ?? 0;
            $doanhThuHoanTheoNgay[] = $doanhThuHoan->get($ngay)->doanh_thu ?? 0;
        }

        return response()->json([
            'tong_doanh_thu_hoan_tat' => $tongDoanhThuHoanTat,
            'doanh_thu_hoan_tat_theo_ngay' => $doanhThuHoanTatTheoNgay,
            'tong_doanh_thu_huy_hoan' => $tongDoanhThuHoan,
            'doanh_thu_huy_hoan_theo_ngay' => $doanhThuHoanTheoNgay,
            'ngay_trong_khoang' => $ngayTrongKhoang,
        ]);
    }

    public function trangThaiKhoangDonSoSanh(Request $request)
    {
        $ngayBatDau = $request->has('ngay_bat_dau')
            ? Carbon::parse($request->input('ngay_bat_dau'))->setTimezone('Asia/Ho_Chi_Minh')->startOfDay()
            : now()->subDays(10)->setTimezone('Asia/Ho_Chi_Minh')->startOfDay();

        $ngayKetThuc = $request->has('ngay_ket_thuc')
            ? Carbon::parse($request->input('ngay_ket_thuc'))->setTimezone('Asia/Ho_Chi_Minh')->endOfDay()
            : now()->setTimezone('Asia/Ho_Chi_Minh')->endOfDay();

        // Tạo mảng ngày trong khoảng
        $khoangNgay = [];
        for ($date = $ngayBatDau->copy(); $date->lte($ngayKetThuc); $date->addDay()) {
            $khoangNgay[] = $date->format('Y-m-d');
        }

        $soLuongHTDH = [];
        $soLuongHuyHang = [];

        foreach ($khoangNgay as $ngay) {
            // Đếm số lượng đơn hoàn tất trong ngày
            $hoanTatDonHang = DonHang::whereDate('ngay_hoan_thanh_don', $ngay)
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->count();
            $soLuongHTDH[] = $hoanTatDonHang;

            // Đếm số lượng đơn hàng bị hủy trong ngày
            $huyHang = DonHang::whereDate('ngay_huy', $ngay)
                ->where('trang_thai_don_hang', DonHang::TTDH_DH)
                ->count();
            $soLuongHuyHang[] = $huyHang;
        }

        return response()->json([
            'ngay' => $khoangNgay,
            'so_luong_hoan_tat_don_hang' => $soLuongHTDH,
            'so_luong_huy_hang' => $soLuongHuyHang,
        ]);
    }

    public function thongKeTheoKhoangDoanhThuTrangThai(Request $request)
{
    $ngayBatDau = $request->has('ngay_bat_dau')
        ? Carbon::parse($request->input('ngay_bat_dau'))->setTimezone('Asia/Ho_Chi_Minh')->startOfDay()
        : now()->subDays(10)->setTimezone('Asia/Ho_Chi_Minh')->startOfDay();

    $ngayKetThuc = $request->has('ngay_ket_thuc')
        ? Carbon::parse($request->input('ngay_ket_thuc'))->setTimezone('Asia/Ho_Chi_Minh')->endOfDay()
        : now()->setTimezone('Asia/Ho_Chi_Minh')->endOfDay();

    $khoangNgay = [];
    for ($date = $ngayBatDau->copy(); $date->lte($ngayKetThuc); $date->addDay()) {
        $khoangNgay[] = $date->format('Y-m-d');
    }

    $doanhThuHoanTat = DonHang::selectRaw('DATE(ngay_hoan_thanh_don) as ngay, SUM(tong_tien_don_hang) as doanh_thu')
        ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc])
        ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
        ->groupBy('ngay')
        ->get()
        ->keyBy('ngay');

    $tongDoanhThuHoanTat = $doanhThuHoanTat->sum('doanh_thu');

    $doanhThuHoan = DonHang::selectRaw('DATE(ngay_hoan) as ngay, SUM(tong_tien_don_hang) as doanh_thu')
        ->whereBetween('ngay_hoan', [$ngayBatDau, $ngayKetThuc])
        ->where('trang_thai_don_hang', DonHang::TTDH_HH)
        ->groupBy('ngay')
        ->get()
        ->keyBy('ngay');

    $tongDoanhThuHoan = $doanhThuHoan->sum('doanh_thu');

    $soLuongHTDH = [];
    $soLuongHuyHang = [];
    $doanhThuHoanTatTheoNgay = [];
    $doanhThuHoanTheoNgay = [];

    foreach ($khoangNgay as $ngay) {
        // Đếm số lượng đơn hoàn tất
        $soLuongHTDH[] = DonHang::whereDate('ngay_hoan_thanh_don', $ngay)
            ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->count();

        // Đếm số lượng đơn hàng bị hủy
        $soLuongHuyHang[] = DonHang::whereDate('ngay_huy', $ngay)
            ->where('trang_thai_don_hang', DonHang::TTDH_DH)
            ->count();

        // Lấy doanh thu hoàn tất từng ngày
        $doanhThuHoanTatTheoNgay[] = $doanhThuHoanTat->get($ngay)->doanh_thu ?? 0;

        // Lấy doanh thu hủy/hoàn từng ngày
        $doanhThuHoanTheoNgay[] = $doanhThuHoan->get($ngay)->doanh_thu ?? 0;
    }

    return response()->json([
        'tong_doanh_thu_hoan_tat' => $tongDoanhThuHoanTat,
        'doanh_thu_hoan_tat_theo_ngay' => $doanhThuHoanTatTheoNgay,
        'tong_doanh_thu_huy_hoan' => $tongDoanhThuHoan,
        'doanh_thu_huy_hoan_theo_ngay' => $doanhThuHoanTheoNgay,
        'so_luong_hoan_tat_don_hang' => $soLuongHTDH,
        'so_luong_huy_hang' => $soLuongHuyHang,
        'ngay_trong_khoang' => $khoangNgay,
    ]);
}

    // Tổng quan theo ngày
    public function thanhToanTienMatTheoNgay(Request $request)
    {
        try {
            DB::beginTransaction();
            $today = Carbon::today();
            $trangThai = [
                DonHang::TTDH_HTDH, // Đơn hàng hoàn tất
                DonHang::TTDH_CKHCN, //
            ];
            // Lấy tổng doanh thu và số lượng đơn có trạng thái "Thanh toán khi nhận hàng" trong ngày hiện tại

            $donHangQuery = DonHang::whereIn('trang_thai_don_hang', $trangThai)

                ->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT) // Điều kiện thanh toán khi nhận hàng
                ->whereDate('ngay_hoan_thanh_don', $today);

            // Tính tổng doanh thu
            $tongDoanhThu = $donHangQuery->sum('tong_tien_don_hang');

            // Đếm số lượng đơn hàng
            $soDonHang = $donHangQuery->count();

            DB::commit();

            return response()->json([
                'tong_doanh_thu' => $tongDoanhThu,
                'so_don_hang' => $soDonHang
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Đã xảy ra lỗi',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function thanhToanOnlineTheoNgay(Request $request)
    {
        try {
            DB::beginTransaction();
            $today = Carbon::today();
            $trangThai = [
                DonHang::TTDH_DGH,
                DonHang::TTDH_HTDH,
                DonHang::TTDH_CKHCN,
            ];
            // Lấy tổng doanh thu và số lượng đơn có phương thức thanh toán online (momo, ngân hàng) trong ngày hiện tại

            $donHangQuery = DonHang::whereIn('trang_thai_don_hang', $trangThai)
                ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                ->whereIn('phuong_thuc_thanh_toan', [
                    DonHang::PTTT_MM_ATM, // Momo
                    DonHang::PTTT_MM_QR  // Ngân hàng
                ])
                ->whereDate('created_at', $today);

            // Tính tổng doanh thu
            $tongDoanhThu = $donHangQuery->sum('tong_tien_don_hang');

            // Đếm số lượng đơn hàng
            $soDonHang = $donHangQuery->count();

            DB::commit();

            return response()->json([
                'tong_doanh_thu' => $tongDoanhThu,
                'so_don_hang' => $soDonHang
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Đã xảy ra lỗi',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function thongKeTongQuanTrongNgay(Request $request)
    {
        try {
            DB::beginTransaction();
            $today = Carbon::today();

            // Số lượng đơn hủy trong ngày
            $soDonHangHuy = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DH)
                ->whereDate('ngay_huy', $today)
                ->count();

            // Số lượng đơn hoàn trong ngày
            $soDonHangHoan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)
                ->whereDate('ngay_hoan', $today)
                ->count();

            // Số lượng đơn mới trong ngày
            $soDonHangMoi = DonHang::whereDate('created_at', $today)
                ->whereIn('trang_thai_don_hang', [
                    DonHang::TTDH_CXH,
                    DonHang::TTDH_DXH,
                    DonHang::TTDH_DXL,

                ])
                ->count();

            // Số lượng đơn thành công trong ngày
            $soDonHangThanhCong = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereDate('ngay_hoan_thanh_don', operator: $today)
                ->count();

            $soLuongSanPhamBanRa = DonHangChiTiet::whereHas('donHang', function ($query) use ($today) {
                $query->where('trang_thai_don_hang', DonHang::TTDH_HTDH)  // Trạng thái hoàn tất đơn hàng
                    ->whereDate('ngay_hoan_thanh_don', $today);                 // Ngày tạo là hôm nay
            })->sum('so_luong');


            // Số lượng khách hàng mua sản phẩm trong ngày
            $soLuongKhachHangMua = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereDate('ngay_hoan_thanh_don', operator: $today)
                ->distinct('user_id')
                ->count('user_id');

            DB::commit();

            return response()->json([
                'so_don_hang_huy' => $soDonHangHuy,
                'so_don_hang_hoan' => $soDonHangHoan,
                'so_don_hang_moi' => $soDonHangMoi,
                'so_don_hang_thanh_cong' => $soDonHangThanhCong,
                'so_luong_san_pham_ban_ra' => $soLuongSanPhamBanRa,
                'so_luong_khach_hang_mua' => $soLuongKhachHangMua,
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Đã xảy ra lỗi',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function doanhThuLoiNhuanRoi()
    {
        // Mốc thời gian từ 0h đến 22h cách nhau 2 giờ
        $timeLabels = ['0h', '2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h', '24h'];

        // Lấy thời gian bắt đầu và kết thúc của ngày hiện tại
        $ngayBatDau = Carbon::today();
        $ngayKetThuc = Carbon::tomorrow();
        $trangThai = [
            DonHang::TTDH_DGH,
            DonHang::TTDH_HTDH,
            DonHang::TTDH_CKHCN,
        ];

        // Tạo khoảng thời gian cách nhau 2 giờ
        $intervals = [];
        for ($i = 0; $i < 24; $i += 2) {
            $intervals[] = [
                'start' => $ngayBatDau->copy()->addHours($i),
                'end' => $ngayBatDau->copy()->addHours($i + 2),
            ];
        }

        // Mảng để lưu các giá trị cho doanh thu và lợi nhuận
        $doanhThuArray = [];
        $loiNhuanArray = [];

        // Lặp qua từng khoảng thời gian để tính doanh thu và lợi nhuận
        foreach ($intervals as $interval) {
            $donHangs = DonHang::whereIn('trang_thai_don_hang', $trangThai)
                ->where(function ($query) use ($interval) {
                    // Nếu trạng thái thanh toán là PTTT_TT, lọc theo ngày hoàn thành đơn
                    $query->where(function ($q) use ($interval) {
                        $q->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
                            ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                            ->whereBetween('ngay_hoan_thanh_don', [$interval['start'], $interval['end']]);
                    })
                        // Nếu trạng thái thanh toán là PTTT_MM_ATM hoặc PTTT_MM_QR, lọc theo created_at
                        ->orWhere(function ($q) use ($interval) {
                            $q->whereIn('phuong_thuc_thanh_toan', [DonHang::PTTT_MM_ATM, DonHang::PTTT_MM_QR])
                                ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                                ->whereBetween('created_at', [$interval['start'], $interval['end']]);
                        });
                })
                ->get();

            // Tính tổng doanh thu và tổng chi phí sản xuất
            $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
            $tongChiPhiSanXuat = $donHangs->sum(function ($donHang) {
                return $donHang->bienTheSanPhams->sum('chi_phi_san_xuat');
            });

            // Tính lợi nhuận
            $loiNhuan = $tongDoanhThu - $tongChiPhiSanXuat;

            // Thêm dữ liệu vào các mảng
            $doanhThuArray[] = $tongDoanhThu;
            $loiNhuanArray[] = $loiNhuan;
        }

        // Trả về kết quả dưới dạng JSON
        return response()->json([
            'thoi_gian' => $timeLabels,
            'doanh_thu' => $doanhThuArray,
            'loi_nhuan' => $loiNhuanArray
        ]);
    }

    public function thongKeDoanhThuTrongNgay()
    {
        $ngayBatDau = Carbon::today();
        $ngayKetThuc = Carbon::tomorrow();

        $trangThai = [
            DonHang::TTDH_DGH,
            DonHang::TTDH_HTDH,
            DonHang::TTDH_CKHCN,
        ];

        $donHangs = DonHang::whereIn('trang_thai_don_hang', $trangThai)
            ->where(function ($query) use ($ngayBatDau, $ngayKetThuc) {
                // Nếu trạng thái thanh toán là PTTT_TT, lọc theo ngày hoàn thành đơn
                $query->where(function ($q) use ($ngayBatDau, $ngayKetThuc) {
                    $q->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
                        ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                        ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc]);
                })
                    // Nếu trạng thái thanh toán là PTTT_MM_ATM hoặc PTTT_MM_QR, lọc theo created_at
                    ->orWhere(function ($q) use ($ngayBatDau, $ngayKetThuc) {
                        $q->whereIn('phuong_thuc_thanh_toan', [DonHang::PTTT_MM_ATM, DonHang::PTTT_MM_QR])
                            ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc]);
                    });
            })
            ->get();

        $tongSoDonHang = $donHangs->count();
        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');

        // Trả về kết quả
        return response()->json([
            'tong_so_don_hang' => $tongSoDonHang,
            'tong_doanh_thu' => $tongDoanhThu
        ]);
    }
}
