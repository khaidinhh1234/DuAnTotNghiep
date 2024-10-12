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
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc'));

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

        $donHangChot = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        $tongTien = 0;
        $tongSoLuongDonHang = $donHangChot->count();

        $donHangChot->each(function ($donHang) use (&$tongTien) {
            $donHang->chiTiets->each(function ($chiTiet) use (&$tongTien) {
                $tongTien += $chiTiet->thanh_tien;
            });
        });

        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        $donHangChotTruoc = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
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
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc'));

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

        $donHangHoan = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])

            ->get();

        $tongTienHoan = 0;
        $tongSoLuongDonHangHoan = $donHangHoan->count();

        $donHangHoan->each(function ($donHang) use (&$tongTienHoan) {
            $donHang->chiTiets->each(function ($chiTiet) use (&$tongTienHoan) {
                $tongTienHoan += $chiTiet->thanh_tien;
            });
        });

        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        $donHangHoanTruoc = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
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
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc'));

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;


        $sanPhamTonKho = SanPham::whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->with(['bienTheSanPham'])
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

        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy sản phẩm trong khoảng thời gian trước đó
        $sanPhamTonKhoTruoc = SanPham::whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
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

    public function thongKeThanhToanOff(Request $request)
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

    public function thongKeDoanhSo(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc'));

        // Lấy tất cả các đơn hàng có trạng thái "Giao hàng thành công" trong khoảng thời gian hiện tại
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->with('chiTiets.bienTheSanPham')  // Lấy chi tiết đơn hàng và biến thể sản phẩm
            ->get();

        // Tính tổng doanh số cho từng sản phẩm
        $doanhSoSanPhams = [];

        foreach ($donHangs as $donHang) {
            foreach ($donHang->chiTiets as $chiTiet) {
                $sanPhamId = $chiTiet->bienTheSanPham->san_pham_id;
                $soLuong = $chiTiet->so_luong;
                $tongTien = $chiTiet->don_gia * $soLuong;

                // Cộng dồn doanh số theo sản phẩm
                if (isset($doanhSoSanPhams[$sanPhamId])) {
                    $doanhSoSanPhams[$sanPhamId]['so_luong'] += $soLuong;
                    $doanhSoSanPhams[$sanPhamId]['tong_tien'] += $tongTien;
                } else {
                    $doanhSoSanPhams[$sanPhamId] = [
                        'ten_san_pham' => $chiTiet->bienTheSanPham->sanPham->ten_san_pham,
                        'so_luong' => $soLuong,
                        'tong_tien' => $tongTien,
                    ];
                }
            }
        }

        // Tính toán dữ liệu cho khoảng thời gian trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy tất cả các đơn hàng có trạng thái "Giao hàng thành công" trong khoảng thời gian trước đó
        $donHangsTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->with('chiTiets.bienTheSanPham')
            ->get();

        // Tính tổng doanh số cho từng sản phẩm trong khoảng thời gian trước
        $doanhSoSanPhamsTruoc = [];

        foreach ($donHangsTruoc as $donHang) {
            foreach ($donHang->chiTiets as $chiTiet) {
                $sanPhamId = $chiTiet->bienTheSanPham->san_pham_id;
                $soLuong = $chiTiet->so_luong;
                $tongTien = $chiTiet->don_gia * $soLuong;

                // Cộng dồn doanh số theo sản phẩm trong khoảng thời gian trước đó
                if (isset($doanhSoSanPhamsTruoc[$sanPhamId])) {
                    $doanhSoSanPhamsTruoc[$sanPhamId]['so_luong'] += $soLuong;
                    $doanhSoSanPhamsTruoc[$sanPhamId]['tong_tien'] += $tongTien;
                } else {
                    $doanhSoSanPhamsTruoc[$sanPhamId] = [
                        'ten_san_pham' => $chiTiet->bienTheSanPham->sanPham->ten_san_pham,
                        'so_luong' => $soLuong,
                        'tong_tien' => $tongTien,
                    ];
                }
            }
        }

        // So sánh doanh số giữa hai khoảng thời gian
        $ketQuaSoSanh = [];

        foreach ($doanhSoSanPhams as $sanPhamId => $doanhSoHienTai) {
            $doanhSoTruoc = $doanhSoSanPhamsTruoc[$sanPhamId] ?? ['so_luong' => 0, 'tong_tien' => 0];

            $ketQuaSoSanh[$sanPhamId] = [
                'ten_san_pham' => $doanhSoHienTai['ten_san_pham'],
                'so_luong_hien_tai' => $doanhSoHienTai['so_luong'],
                'tong_tien_hien_tai' => $doanhSoHienTai['tong_tien'],
                'so_luong_truoc' => $doanhSoTruoc['so_luong'],
                'tong_tien_truoc' => $doanhSoTruoc['tong_tien'],
                'ti_le_tang_giam_doanh_so' => $doanhSoTruoc['tong_tien'] > 0
                    ? (($doanhSoHienTai['tong_tien'] - $doanhSoTruoc['tong_tien']) / $doanhSoTruoc['tong_tien']) * 100
                    : ($doanhSoHienTai['tong_tien'] > 0 ? 100 : 0)
            ];
        }

        // Trả về kết quả
        return response()->json([
            'doanh_so_hien_tai' => $doanhSoSanPhams,
            'doanh_so_truoc' => $doanhSoSanPhamsTruoc,
            'ket_qua_so_sanh' => $ketQuaSoSanh
        ]);
    }
    public function thongKeDoanhThuTB(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau'));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc'));

        // Lấy tất cả các đơn hàng có trạng thái "Giao hàng thành công" trong khoảng thời gian hiện tại
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
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
        $donHangsTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
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
}
