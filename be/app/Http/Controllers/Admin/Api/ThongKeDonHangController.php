<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
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
            $soLuongHoanHang = DonHang::where('trang_thai_don_hang',  DonHang::TTDH_HH)->count();

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

}
