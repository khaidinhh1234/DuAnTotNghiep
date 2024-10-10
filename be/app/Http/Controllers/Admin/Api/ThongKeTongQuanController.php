<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\SanPham;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ThongKeTongQuanController extends Controller
{
    public function thongKeDonHangChot(Request $request)
    {
        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));

        $duration = $startDate->diffInDays($endDate) + 1;

        $donHangChot = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $tongTien = 0;
        $tongSoLuongDonHang = $donHangChot->count();

        $donHangChot->each(function ($donHang) use (&$tongTien) {
            $donHang->chiTiets->each(function ($chiTiet) use (&$tongTien) {
                $tongTien += $chiTiet->thanh_tien;
            });
        });

        $previousStartDate = $startDate->copy()->subDays($duration);
        $previousEndDate = $endDate->copy()->subDays($duration);

        $donHangChotTruoc = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->get();

        $tongTienTruoc = 0;
        $tongSoLuongDonHangTruoc = $donHangChotTruoc->count();

        $donHangChotTruoc->each(function ($donHang) use (&$tongTienTruoc) {
            $donHang->chiTiets->each(function ($chiTiet) use (&$tongTienTruoc) {
                $tongTienTruoc += $chiTiet->thanh_tien;
            });
        });

        $tiLeTangGiamDonHang = $tongSoLuongDonHangTruoc > 0
            ? (($tongSoLuongDonHang - $tongSoLuongDonHangTruoc) / $tongSoLuongDonHangTruoc) * 100
            : ($tongSoLuongDonHang > 0 ? 100 : 0);

        $tiLeTangGiamTien = $tongTienTruoc > 0
            ? (($tongTien - $tongTienTruoc) / $tongTienTruoc) * 100
            : ($tongTien > 0 ? 100 : 0);

        $tiLeTangGiamDonHangFormatted = $tiLeTangGiamDonHang >= 0 ? '+' . $tiLeTangGiamDonHang : $tiLeTangGiamDonHang;
        $tiLeTangGiamTienFormatted = $tiLeTangGiamTien >= 0 ? '+' . $tiLeTangGiamTien : $tiLeTangGiamTien;

        return response()->json([
            'tong_so_luong_don_hang' => $tongSoLuongDonHang,
            'tong_tien' => $tongTien,
            'tong_so_luong_don_hang_truoc' => $tongSoLuongDonHangTruoc,
            'tong_tien_truoc' => $tongTienTruoc,
            'ti_le_tang_giam_don_hang' => $tiLeTangGiamDonHangFormatted,
            'ti_le_tang_giam_tien' => $tiLeTangGiamTienFormatted,
        ]);
    }
    public function thongKeHoanHang(Request $request)
    {
        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));

        $duration = $startDate->diffInDays($endDate) + 1;

        $donHangHoan = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $tongTienHoan = 0;
        $tongSoLuongDonHangHoan = $donHangHoan->count();

        $donHangHoan->each(function ($donHang) use (&$tongTienHoan) {
            $donHang->chiTiets->each(function ($chiTiet) use (&$tongTienHoan) {
                $tongTienHoan += $chiTiet->thanh_tien;
            });
        });

        $previousStartDate = $startDate->copy()->subDays($duration);
        $previousEndDate = $endDate->copy()->subDays($duration);

        $donHangHoanTruoc = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->get();

        $tongTienHoanTruoc = 0;
        $tongSoLuongDonHangHoanTruoc = $donHangHoanTruoc->count();

        $donHangHoanTruoc->each(function ($donHang) use (&$tongTienHoanTruoc) {
            $donHang->chiTiets->each(function ($chiTiet) use (&$tongTienHoanTruoc) {
                $tongTienHoanTruoc += $chiTiet->thanh_tien;
            });
        });

        $tiLeTangGiamDonHangHoan = $tongSoLuongDonHangHoanTruoc > 0
            ? (($tongSoLuongDonHangHoan - $tongSoLuongDonHangHoanTruoc) / $tongSoLuongDonHangHoanTruoc) * 100
            : ($tongSoLuongDonHangHoan > 0 ? 100 : 0);

        $tiLeTangGiamTienHoan = $tongTienHoanTruoc > 0
            ? (($tongTienHoan - $tongTienHoanTruoc) / $tongTienHoanTruoc) * 100
            : ($tongTienHoan > 0 ? 100 : 0);

        $tiLeTangGiamDonHangHoanFormatted = $tiLeTangGiamDonHangHoan >= 0 ? '+' . $tiLeTangGiamDonHangHoan : $tiLeTangGiamDonHangHoan;
        $tiLeTangGiamTienHoanFormatted = $tiLeTangGiamTienHoan >= 0 ? '+' . $tiLeTangGiamTienHoan : $tiLeTangGiamTienHoan;

        return response()->json([
            'tong_so_luong_don_hang_hoan' => $tongSoLuongDonHangHoan,
            'tong_tien_hoan' => $tongTienHoan,
            'tong_so_luong_don_hang_hoan_truoc' => $tongSoLuongDonHangHoanTruoc,
            'tong_tien_hoan_truoc' => $tongTienHoanTruoc,
            'ti_le_tang_giam_don_hang_hoan' => $tiLeTangGiamDonHangHoanFormatted,
            'ti_le_tang_giam_tien_hoan' => $tiLeTangGiamTienHoanFormatted,
        ]);
    }
    public function thongKeSanPhamTonKho(Request $request)
    {
        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));

        $duration = $startDate->diffInDays($endDate) + 1;

        // Lấy các sản phẩm được tạo trong khoảng thời gian chỉ định
        $sanPhamTonKho = SanPham::whereBetween('created_at', [$startDate, $endDate])
            ->with(['bienTheSanPham']) // Đúng với quan hệ đã định nghĩa
            ->get();

        $tongSoLuongTonKhoTatCaSanPham = 0;
        $thongKeTonKho = [];

        foreach ($sanPhamTonKho as $sanPham) {
            $tongSoLuongTon = 0;

            foreach ($sanPham->bienTheSanPham as $bienThe) { // Đúng với quan hệ đã định nghĩa
                $tongSoLuongTon += $bienThe->so_luong_ton;
            }

            $tongSoLuongTonKhoTatCaSanPham += $tongSoLuongTon;

            $thongKeTonKho[] = [
                'ten_san_pham' => $sanPham->ten_san_pham,
                'ma_san_pham' => $sanPham->ma_san_pham,
                'so_luong_ton' => $tongSoLuongTon,
                'ngay_tao' => $sanPham->created_at->format('Y-m-d')
            ];
        }

        $previousStartDate = $startDate->copy()->subDays($duration);
        $previousEndDate = $endDate->copy()->subDays($duration);

        // Lấy sản phẩm trong khoảng thời gian trước đó
        $sanPhamTonKhoTruoc = SanPham::whereBetween('created_at', [$previousStartDate, $previousEndDate])
            ->with(['bienTheSanPham']) // Đúng với quan hệ đã định nghĩa
            ->get();

        $tongSoLuongTonKhoTatCaSanPhamTruoc = 0;

        foreach ($sanPhamTonKhoTruoc as $sanPham) {
            $tongSoLuongTon = 0;

            foreach ($sanPham->bienTheSanPham as $bienThe) { // Đúng với quan hệ đã định nghĩa
                $tongSoLuongTon += $bienThe->so_luong_ton;
            }

            $tongSoLuongTonKhoTatCaSanPhamTruoc += $tongSoLuongTon;
        }

        $tiLeTangGiamTonKho = $tongSoLuongTonKhoTatCaSanPhamTruoc > 0
            ? (($tongSoLuongTonKhoTatCaSanPham - $tongSoLuongTonKhoTatCaSanPhamTruoc) / $tongSoLuongTonKhoTatCaSanPhamTruoc) * 100
            : ($tongSoLuongTonKhoTatCaSanPham > 0 ? 100 : 0);

        $tiLeTangGiamTonKhoFormatted = $tiLeTangGiamTonKho >= 0 ? '+' . $tiLeTangGiamTonKho : $tiLeTangGiamTonKho;

        return response()->json([
            'tong_so_luong_ton_kho' => $tongSoLuongTonKhoTatCaSanPham,
            'tong_so_luong_ton_kho_truoc' => $tongSoLuongTonKhoTatCaSanPhamTruoc,
            'ti_le_tang_giam_ton_kho' => $tiLeTangGiamTonKhoFormatted
        ]);
    }

}
