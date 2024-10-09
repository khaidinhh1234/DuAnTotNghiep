<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class ThongKeDonHangController extends Controller
{
    public function thongKeHoanHang(Request $request)
    {
        // Lấy danh sách đơn hàng bị hoàn theo tháng
        $donHangHoan = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->selectRaw('YEAR(created_at) as nam, MONTH(created_at) as thang, COUNT(*) as so_luong')
            ->groupBy('nam', 'thang')
            ->orderBy('nam', 'desc')
            ->orderBy('thang', 'desc')
            ->get();

        // Thêm chi tiết sản phẩm bị hoàn vào từng tháng
        $thongKeChiTiet = $donHangHoan->map(function ($item) {
            $donHangThangNay = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
                ->whereYear('created_at', $item->nam)
                ->whereMonth('created_at', $item->thang)
                ->where('trang_thai_don_hang', DonHang::TTDH_HH)
                ->get();

            // Lấy thông tin sản phẩm bị hoàn trong các đơn hàng hoàn của tháng đó
            $sanPhamHoan = $donHangThangNay->flatMap(function ($donHang) {
                return $donHang->chiTiets->map(function ($chiTiet) {
                    return [
                        'ten_san_pham' => $chiTiet->bienTheSanPham->sanPham->ten_san_pham,
                        'so_luong' => $chiTiet->so_luong,
                        'gia' => $chiTiet->gia,
                        'thanh_tien' => $chiTiet->thanh_tien,
                    ];
                });
            });

            return [
                'nam' => $item->nam,
                'thang' => $item->thang,
                'so_luong_don_hang_hoan' => $item->so_luong,
                'san_pham_bi_hoan' => $sanPhamHoan
            ];
        });

        return response()->json($thongKeChiTiet);
    }
    public function thongKeHuyHangTheoThang()
{
    // Truy vấn các đơn hàng bị hủy, nhóm theo tháng và năm
    $thongKeHuyHang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DH)
        ->select(
            DB::raw('MONTH(created_at) as thang'),
            DB::raw('YEAR(created_at) as nam'),
            DB::raw('COUNT(id) as so_luong_don_huy')
        )
        ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
        ->orderBy('nam', 'asc')
        ->orderBy('thang', 'asc')
        ->with(['chiTiets.bienTheSanPham.sanPham'])
        ->get();

    // Mảng kết quả cho năm
    $thongKeNam = [];
    // Mảng kết quả cho tháng
    $thongKeThang = [];

    // Duyệt qua từng tháng và năm để lấy thông tin sản phẩm bị hủy
    foreach ($thongKeHuyHang as $thongKe) {
        // Thống kê theo từng năm, nếu chưa có thì tạo mới
        if (!isset($thongKeNam[$thongKe->nam])) {
            $thongKeNam[$thongKe->nam] = [
                'nam' => $thongKe->nam,
                'so_luong_don_huy' => 0,
                'san_pham_huy' => [] // Mảng sản phẩm bị hủy theo năm
            ];
        }
        $thongKeNam[$thongKe->nam]['so_luong_don_huy'] += $thongKe->so_luong_don_huy;

        // Lấy tất cả đơn hàng bị hủy trong tháng và năm hiện tại
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DH)
            ->whereYear('created_at', $thongKe->nam)
            ->whereMonth('created_at', $thongKe->thang)
            ->with(['chiTiets.bienTheSanPham.sanPham'])
            ->get();

        // Mảng để lưu sản phẩm bị hủy trong tháng và năm hiện tại
        $sanPhamTrongThang = [];

        // Duyệt qua từng đơn hàng
        foreach ($donHangs as $donHang) {
            foreach ($donHang->chiTiets as $chiTiet) {
                $sanPham = $chiTiet->bienTheSanPham->sanPham;

                // Thêm sản phẩm vào mảng thống kê theo năm nếu chưa tồn tại
                if (!in_array($sanPham->ten_san_pham, $thongKeNam[$thongKe->nam]['san_pham_huy'])) {
                    $thongKeNam[$thongKe->nam]['san_pham_huy'][] = $sanPham->ten_san_pham;
                }

                // Thêm sản phẩm vào mảng thống kê theo tháng
                $sanPhamTrongThang[] = [
                    'ten_san_pham' => $sanPham->ten_san_pham,
                    'so_luong_huy' => $chiTiet->so_luong,
                    'gia' => $chiTiet->gia,
                    'thanh_tien' => $chiTiet->thanh_tien
                ];
            }
        }

        // Thêm dữ liệu vào mảng kết quả cho tháng
        $thongKeThang[] = [
            'thang' => $thongKe->thang,
            'nam' => $thongKe->nam,
            'so_luong_don_huy' => $thongKe->so_luong_don_huy,
            'san_pham_huy' => $sanPhamTrongThang
        ];
    }

    // Kết quả cuối cùng
    $ketQua = [
        'thong_ke_nam' => array_values($thongKeNam), // Thống kê theo năm
        'thong_ke_thang' => $thongKeThang // Thống kê chi tiết theo tháng
    ];

    return $ketQua;
}


    public function thongKeDonHangTheoTrangThai(Request $request)
    {
        try {
            DB::beginTransaction();

            // Thống kê số lượng đơn hàng theo từng trạng thái
            $soLuongChoXacNhan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_CXH)->count();
            $soLuongDaXacNhan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DXH)->count();
            $soLuongDangXuLy = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DXL)->count();
            $soLuongDangGiaoHang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGH)->count();
            $soLuongDaGiaoHangThanhCong = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)->count();
            $soLuongDaHuyHang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DH)->count();
            $soLuongHoanHang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)->count();

            DB::commit();

            // Trả về kết quả thống kê qua API
            return response()->json([
                'so_luong_don_hang' => [
                    'cho_xac_nhan' => $soLuongChoXacNhan,
                    'da_xac_nhan' => $soLuongDaXacNhan,
                    'dang_xu_ly' => $soLuongDangXuLy,
                    'dang_giao_hang' => $soLuongDangGiaoHang,
                    'da_giao_hang_thanh_cong' => $soLuongDaGiaoHangThanhCong,
                    'da_huy_hang' => $soLuongDaHuyHang,
                    'hoan_hang' => $soLuongHoanHang,
                ]
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi trong quá trình xử lý dữ liệu.'], 500);
        }
    }
    public function soSanhDonHangThang(Request $request)
    {
        try {
            DB::beginTransaction();

            $now = Carbon::now();

            // Đếm số lượng khách hàng đăng ký trong tháng hiện tại
            $donHangHienTai = DB::table('don_hangs')
                ->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year)
                ->count();  // Đếm số lượt đăng ký

            // Lùi về tháng trước
            $thangTruoc = $now->subMonth();

            // Đếm số lượng khách hàng đăng ký trong tháng trước
            $donHangTruoc = DB::table('don_hangs')
                ->whereMonth('created_at', $thangTruoc->month)
                ->whereYear('created_at', $thangTruoc->year)
                ->count();  // Đếm số lượt đăng ký

            // Tính sự chênh lệch về số lượng đăng ký và phần trăm
            $chenhLechSo = $donHangHienTai - $donHangTruoc;
            $chenhLechPhanTram = ($donHangTruoc > 0)
                ? ($chenhLechSo / $donHangTruoc) * 100
                : 100;  // Nếu tháng trước không có lượt đăng ký, mặc định tăng 100%

            DB::commit();

            // Trả về kết quả so sánh
            return response()->json([
                'donHang_hien_tai' => $donHangHienTai,
                'donHang_truoc' => $donHangTruoc,
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

}
