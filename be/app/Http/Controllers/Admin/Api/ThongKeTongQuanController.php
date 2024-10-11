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

        $ngayBatDau  = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc  = Carbon::parse($request->input('ngay_ket_thuc'));

        $khoangThoiGian  = $ngayBatDau ->diffInDays($ngayKetThuc ) + 1;

        $donHangChot = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$ngayBatDau , $ngayKetThuc ])

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


        $ngayBatDauTruoc   = $ngayBatDau ->copy()->subDays($khoangThoiGian );
        $ngayKetThucTruoc   = $ngayKetThuc ->copy()->subDays($khoangThoiGian );

        $donHangChotTruoc = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$ngayBatDauTruoc  , $ngayKetThucTruoc  ])

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
        $ngayBatDau  = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc  = Carbon::parse($request->input('ngay_ket_thuc'));

        $khoangThoiGian  = $ngayBatDau ->diffInDays($ngayKetThuc ) + 1;

        $donHangHoan = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('created_at', [$ngayBatDau , $ngayKetThuc ])

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


        $ngayBatDauTruoc   = $ngayBatDau ->copy()->subDays($khoangThoiGian );
        $ngayKetThucTruoc   = $ngayKetThuc ->copy()->subDays($khoangThoiGian );

        $donHangHoanTruoc = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('created_at', [$ngayBatDauTruoc  , $ngayKetThucTruoc  ])

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

        $ngayBatDau  = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc  = Carbon::parse($request->input('ngay_ket_thuc'));

        $khoangThoiGian  = $ngayBatDau ->diffInDays($ngayKetThuc ) + 1;

        // Lấy các sản phẩm được tạo trong khoảng thời gian chỉ định
        $sanPhamTonKho = SanPham::whereBetween('created_at', [$ngayBatDau , $ngayKetThuc ])

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


        $ngayBatDauTruoc   = $ngayBatDau ->copy()->subDays($khoangThoiGian );
        $ngayKetThucTruoc   = $ngayKetThuc ->copy()->subDays($khoangThoiGian );

        // Lấy sản phẩm trong khoảng thời gian trước đó
        $sanPhamTonKhoTruoc = SanPham::whereBetween('created_at', [$ngayBatDauTruoc  , $ngayKetThucTruoc  ])

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


    public function thongKeDoanhThuTong(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc'));

        // Trạng thái giao hàng thành công
        $trangThaiGiaoHangThanhCong = DonHang::TTDH_DGTC;

        // Lấy tổng doanh thu và số lượng đơn hàng với trạng thái giao hàng thành công
        $donHangs = DonHang::where('trang_thai_don_hang', $trangThaiGiaoHangThanhCong)
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        // Tính tổng doanh thu
        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');

        // Đếm số lượng đơn hàng
        $soDonHang = $donHangs->count();

        // Tính toán dữ liệu cho khoảng thời gian trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy tổng doanh thu và số lượng đơn hàng trong khoảng thời gian trước đó
        $donHangsTruoc = DonHang::where('trang_thai_don_hang', $trangThaiGiaoHangThanhCong)
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        $tongDoanhThuTruoc = $donHangsTruoc->sum('tong_tien_don_hang');
        $soDonHangTruoc = $donHangsTruoc->count();

        // Tính tỷ lệ tăng giảm doanh thu
        $tiLeTangGiamDoanhThu = $tongDoanhThuTruoc > 0
            ? (($tongDoanhThu - $tongDoanhThuTruoc) / $tongDoanhThuTruoc) * 100
            : ($tongDoanhThu > 0 ? 100 : 0);

        $tiLeTangGiamDoanhThuFormatted = $tiLeTangGiamDoanhThu >= 0 ? '+' . $tiLeTangGiamDoanhThu : $tiLeTangGiamDoanhThu;

        // Trả về kết quả
        return response()->json([
            'tong_doanh_thu' => $tongDoanhThu,
            'so_don_hang' => $soDonHang,
            'tong_doanh_thu_truoc' => $tongDoanhThuTruoc,
            'so_don_hang_truoc' => $soDonHangTruoc,
            'ti_le_tang_giam_doanh_thu' => $tiLeTangGiamDoanhThuFormatted
        ]);
    }

    public function thongKeThanhToanOnline(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc'));

        // Lấy tổng doanh thu và số lượng đơn hàng với phương thức thanh toán là Momo hoặc ngân hàng
        $donHangs = DonHang::whereIn('phuong_thuc_thanh_toan', [
                DonHang::PTTT_MM,
                DonHang::PTTT_NH
            ])
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        // Tính tổng doanh thu
        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');

        // Đếm số lượng đơn hàng
        $soDonHang = $donHangs->count();

        // Tính toán dữ liệu cho khoảng thời gian trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy tổng doanh thu và số lượng đơn hàng trong khoảng thời gian trước đó
        $donHangsTruoc = DonHang::whereIn('phuong_thuc_thanh_toan', [
                DonHang::PTTT_MM,
                DonHang::PTTT_NH
            ])
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        $tongDoanhThuTruoc = $donHangsTruoc->sum('tong_tien_don_hang');
        $soDonHangTruoc = $donHangsTruoc->count();

        // Tính tỷ lệ tăng giảm doanh thu
        $tiLeTangGiamDoanhThu = $tongDoanhThuTruoc > 0
            ? (($tongDoanhThu - $tongDoanhThuTruoc) / $tongDoanhThuTruoc) * 100
            : ($tongDoanhThu > 0 ? 100 : 0);

        $tiLeTangGiamDoanhThuFormatted = $tiLeTangGiamDoanhThu >= 0 ? '+' . $tiLeTangGiamDoanhThu : $tiLeTangGiamDoanhThu;

        // Trả về kết quả
        return response()->json([
            'tong_doanh_thu' => $tongDoanhThu,
            'so_don_hang' => $soDonHang,
            'tong_doanh_thu_truoc' => $tongDoanhThuTruoc,
            'so_don_hang_truoc' => $soDonHangTruoc,
            'ti_le_tang_giam_doanh_thu' => $tiLeTangGiamDoanhThuFormatted
        ]);
    }

    public function thongKeThanhToanKhiNhanHang(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc'));
    
        // Lấy tổng doanh thu và số lượng đơn hàng với phương thức thanh toán là Thanh toán khi nhận hàng
        $donHangs = DonHang::where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();
    
        // Tính tổng doanh thu
        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
    
        // Đếm số lượng đơn hàng
        $soDonHang = $donHangs->count();
    
        // Tính toán dữ liệu cho khoảng thời gian trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);
    
        // Lấy tổng doanh thu và số lượng đơn hàng trong khoảng thời gian trước đó
        $donHangsTruoc = DonHang::where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();
    
        $tongDoanhThuTruoc = $donHangsTruoc->sum('tong_tien_don_hang');
        $soDonHangTruoc = $donHangsTruoc->count();
    
        // Tính tỷ lệ tăng giảm doanh thu
        $tiLeTangGiamDoanhThu = $tongDoanhThuTruoc > 0
            ? (($tongDoanhThu - $tongDoanhThuTruoc) / $tongDoanhThuTruoc) * 100
            : ($tongDoanhThu > 0 ? 100 : 0);
    
        $tiLeTangGiamDoanhThuFormatted = $tiLeTangGiamDoanhThu >= 0 ? '+' . $tiLeTangGiamDoanhThu : $tiLeTangGiamDoanhThu;
    
        // Trả về kết quả
        return response()->json([
            'tong_doanh_thu' => $tongDoanhThu,
            'so_don_hang' => $soDonHang,
            'tong_doanh_thu_truoc' => $tongDoanhThuTruoc,
            'so_don_hang_truoc' => $soDonHangTruoc,
            'ti_le_tang_giam_doanh_thu' => $tiLeTangGiamDoanhThuFormatted
        ]);
    }
    


}
