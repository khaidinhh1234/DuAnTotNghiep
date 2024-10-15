<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\SanPham;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThongKeTongQuanController extends Controller
{
    public function thongKeDonHangChot(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

        // Lấy các đơn hàng chốt trong khoảng thời gian
        $donHangChot = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        $tongTien = 0;
        $tongSoLuongDonHang = $donHangChot->count();

        // Tính tổng tiền của các đơn hàng chốt
        $donHangChot->each(function ($donHang) use (&$tongTien) {
            // $donHang->chiTiets->each(function ($chiTiet) use (&$tongTien) {
            //     $tongTien += $chiTiet->thanh_tien;
            // });
            $tongTien += $donHang->tong_tien_don_hang;
        });

        // Lấy khoảng thời gian trước để so sánh
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy các đơn hàng chốt trong khoảng thời gian trước
        $donHangChotTruoc = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        $tongTienTruoc = 0;
        $tongSoLuongDonHangTruoc = $donHangChotTruoc->count();

        // Tính tổng tiền của các đơn hàng chốt trước đó
        $donHangChotTruoc->each(function ($donHang) use (&$tongTienTruoc) {
            // $donHang->chiTiets->each(function ($chiTiet) use (&$tongTienTruoc) {
            //     $tongTienTruoc += $chiTiet->thanh_tien;
            // });
            $tongTienTruoc += $donHang->tong_tien_don_hang;
        });

        // Tính tỷ lệ tăng/giảm số lượng đơn hàng
        $tiLeTangGiamDonHang = $tongSoLuongDonHangTruoc > 0
            ? (($tongSoLuongDonHang - $tongSoLuongDonHangTruoc) / $tongSoLuongDonHangTruoc) * 100
            : ($tongSoLuongDonHang > 0 ? 100 : 0);

        // Tính tỷ lệ tăng/giảm tổng tiền
        $tiLeTangGiamTien = $tongTienTruoc > 0
            ? (($tongTien - $tongTienTruoc) / $tongTienTruoc) * 100
            : ($tongTien > 0 ? 100 : 0);


        return response()->json([
            'tong_so_luong_don_hang' => $tongSoLuongDonHang,
            'tong_tien' => $tongTien,
            'tong_so_luong_don_hang_truoc' => $tongSoLuongDonHangTruoc,
            'tong_tien_truoc' => $tongTienTruoc,
            'ti_le_tang_giam_don_hang' => round($tiLeTangGiamDonHang, 2), // làm tròn đến 2 chữ số thập phân
            'ti_le_tang_giam_tien' => round($tiLeTangGiamTien, 2), // làm tròn đến 2 chữ số thập phân
        ]);
    }

    public function thongKeHoanHang(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

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

        return response()->json([
            'tong_so_luong_don_hang_hoan' => $tongSoLuongDonHangHoan,
            'tong_tien_hoan' => $tongTienHoan,
            'tong_so_luong_don_hang_hoan_truoc' => $tongSoLuongDonHangHoanTruoc,
            'tong_tien_hoan_truoc' => $tongTienHoanTruoc,
            'ti_le_tang_giam_don_hang_hoan' => $tiLeTangGiamDonHangHoan,  // Trả về số
            'ti_le_tang_giam_tien_hoan' => $tiLeTangGiamTienHoan,          // Trả về số
        ]);
    }

    public function thongKeSanPhamTonKho(Request $request)
    {
        // Lấy ngày bắt đầu và ngày kết thúc từ request hoặc mặc định
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        // Khoảng thời gian cần lấy dữ liệu
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

        // Lấy danh sách sản phẩm trong khoảng thời gian
        $sanPhamTonKho = SanPham::whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->with(['bienTheSanPham'])  // Lấy cả biến thể sản phẩm
            ->get();

        // Khởi tạo biến để tính tổng số lượng, chi phí sản xuất và giá bán
        $tongSoLuongTonKhoTatCaSanPham = 0;
        $tongChiPhiSanXuat = 0;
        $tongGiaBan = 0;
        $thongKeTonKho = [];

        // Duyệt qua danh sách sản phẩm để tính toán
        foreach ($sanPhamTonKho as $sanPham) {
            $tongSoLuongTon = 0;
            $chiPhiSanXuatSanPham = 0;
            $giaBanSanPham = 0;

            foreach ($sanPham->bienTheSanPham as $bienThe) {
                // Cộng dồn số lượng tồn, chi phí sản xuất và giá bán của từng biến thể
                $tongSoLuongTon += $bienThe->so_luong_ton;
                $chiPhiSanXuatSanPham += $bienThe->chi_phi_san_xuat * $bienThe->so_luong_ton;
                $giaBanSanPham += $bienThe->gia_ban * $bienThe->so_luong_ton;
            }

            // Cộng dồn vào tổng
            $tongSoLuongTonKhoTatCaSanPham += $tongSoLuongTon;
            $tongChiPhiSanXuat += $chiPhiSanXuatSanPham;
            $tongGiaBan += $giaBanSanPham;

            // Thêm sản phẩm vào mảng thống kê
            $thongKeTonKho[] = [
                'ten_san_pham' => $sanPham->ten_san_pham,
                'ma_san_pham' => $sanPham->ma_san_pham,
                'so_luong_ton' => $tongSoLuongTon,
                'ngay_tao' => $sanPham->created_at->format('Y-m-d')
            ];
        }

        // Lấy dữ liệu của khoảng thời gian trước đó để so sánh
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        $sanPhamTonKhoTruoc = SanPham::whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->with(['bienTheSanPham'])
            ->get();

        // Khởi tạo biến để tính tổng số lượng tồn kho trước đó
        $tongSoLuongTonKhoTatCaSanPhamTruoc = 0;
        $tongChiPhiSanXuatTruoc = 0;
        $tongGiaBanTruoc = 0;

        foreach ($sanPhamTonKhoTruoc as $sanPham) {
            $tongSoLuongTon = 0;
            $chiPhiSanXuatSanPham = 0;
            $giaBanSanPham = 0;

            foreach ($sanPham->bienTheSanPham as $bienThe) {
                $tongSoLuongTon += $bienThe->so_luong_ton;
                $chiPhiSanXuatSanPham += $bienThe->chi_phi_san_xuat * $bienThe->so_luong_ton;
                $giaBanSanPham += $bienThe->gia_ban * $bienThe->so_luong_ton;
            }

            $tongSoLuongTonKhoTatCaSanPhamTruoc += $tongSoLuongTon;
            $tongChiPhiSanXuatTruoc += $chiPhiSanXuatSanPham;
            $tongGiaBanTruoc += $giaBanSanPham;
        }

        // Tính tỉ lệ tăng/giảm tồn kho
        $tiLeTangGiamTonKho = $tongSoLuongTonKhoTatCaSanPhamTruoc > 0
            ? (($tongSoLuongTonKhoTatCaSanPham - $tongSoLuongTonKhoTatCaSanPhamTruoc) / $tongSoLuongTonKhoTatCaSanPhamTruoc) * 100
            : ($tongSoLuongTonKhoTatCaSanPham > 0 ? 100 : 0);

        // Trả về kết quả dưới dạng JSON
        return response()->json([
            'tong_so_luong_ton_kho' => $tongSoLuongTonKhoTatCaSanPham,
            'tong_chi_phi_san_xuat' => $tongChiPhiSanXuat,
            'tong_gia_ban' => $tongGiaBan,
            'tong_so_luong_ton_kho_truoc' => $tongSoLuongTonKhoTatCaSanPhamTruoc,
            'tong_chi_phi_san_xuat_truoc' => $tongChiPhiSanXuatTruoc,
            'tong_gia_ban_truoc' => $tongGiaBanTruoc,
            'ti_le_tang_giam_ton_kho' => round($tiLeTangGiamTonKho, 2)  // Đảm bảo trả về dạng số
        ]);
    }

    public function thongKeDoanhThuTong(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        $trangThaiGiaoHangThanhCong = DonHang::TTDH_HTDH;

        $donHangs = DonHang::query()
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
        $soDonHang = $donHangs->count();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        $donHangsTruoc = DonHang::where('trang_thai_don_hang', $trangThaiGiaoHangThanhCong)
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
            'ti_le_tang_giam_doanh_thu' => round($tiLeTangGiamDoanhThu, 2)  // Trả về dạng số, không phải chuỗi
        ]);
    }

    public function thongKeThanhToanOnline(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        $donHangs = DonHang::whereIn('phuong_thuc_thanh_toan', [
            DonHang::PTTT_MM,
            DonHang::PTTT_NH
        ])
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
        $soDonHang = $donHangs->count();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        $donHangsTruoc = DonHang::whereIn('phuong_thuc_thanh_toan', [
            DonHang::PTTT_MM,
            DonHang::PTTT_NH
        ])
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
            'ti_le_tang_giam_doanh_thu' => round($tiLeTangGiamDoanhThu, 2)  // Trả về số
        ]);
    }

    public function thongKeThanhToanOff(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        $donHangs = DonHang::where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
        $soDonHang = $donHangs->count();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        $donHangsTruoc = DonHang::where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
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
            'ti_le_tang_giam_doanh_thu' => round($tiLeTangGiamDoanhThu, 2)  // Trả về số
        ]);
    }

    public function thongKeDoanhSo(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        // Lấy tổng doanh số trong khoảng thời gian hiện tại (TTDH_HTDH)
        $tongDoanhSoHienTai = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->sum('tong_tien_don_hang');

        // Tính khoảng thời gian trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy tổng doanh số trong khoảng thời gian trước đó (TTDH_HTDH)
        $tongDoanhSoTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->sum('tong_tien_don_hang');

        // Tính tỷ lệ phần trăm thay đổi doanh số
        $tiLeTangGiam = $tongDoanhSoTruoc > 0
            ? (($tongDoanhSoHienTai - $tongDoanhSoTruoc) / $tongDoanhSoTruoc) * 100
            : ($tongDoanhSoHienTai > 0 ? 100 : 0);

        // Trả về kết quả
        return response()->json([
            'tong_doanh_so_hien_tai' => $tongDoanhSoHienTai,
            'tong_doanh_so_truoc' => $tongDoanhSoTruoc,
            'ti_le_tang_giam' => $tiLeTangGiam
        ]);
    }

    public function thongKeDoanhThuTB(Request $request)
    {
        // Lấy khoảng thời gian bắt đầu và kết thúc từ request
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        // Lấy tất cả các đơn hàng có trạng thái "Giao hàng thành công" trong khoảng thời gian hiện tại
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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
        $donHangsTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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

    public function doanhThuTheoKhoang(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc);

        // Lấy đơn hàng hoàn tất (TTDH_HTDH)
        $donHangHoanTat = DonHang::whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->get();

        // Tính tổng doanh thu cho đơn hàng hoàn tất
        $tongDoanhThuHoanTat = $donHangHoanTat->sum('tong_tien_don_hang');

        // Lấy doanh thu theo từng ngày cho đơn hàng hoàn tất
        $doanhThuHoanTatTheoNgay = [];
        $ngayTrongKhoang = [];
        for ($i = 0; $i <= $khoangThoiGian; $i++) {
            $ngay = $ngayBatDau->copy()->addDays($i);
            $doanhThuNgay = DonHang::whereDate('created_at', $ngay)
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->sum('tong_tien_don_hang');
            $doanhThuHoanTatTheoNgay[] = $doanhThuNgay;
            $ngayTrongKhoang[] = $ngay->format('Y-m-d');
        }

        // Lấy đơn hàng hủy (TTDH_HDH)
        $donHangHuy = DonHang::whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->where('trang_thai_don_hang', [
                DonHang::TTDH_DH,
                DonHang::TTDH_HH
            ])
            ->get();

        // Tính tổng doanh thu cho đơn hàng hủy
        $tongDoanhThuHuy = $donHangHuy->sum('tong_tien_don_hang');

        // Lấy doanh thu theo từng ngày cho đơn hàng hủy
        $doanhThuHuyTheoNgay = [];
        for ($i = 0; $i <= $khoangThoiGian; $i++) {
            $ngay = $ngayBatDau->copy()->addDays($i);
            $doanhThuNgayHuy = DonHang::whereDate('created_at', $ngay)
                ->where('trang_thai_don_hang', [
                    DonHang::TTDH_DH,
                    DonHang::TTDH_HH
                ])
                ->sum('tong_tien_don_hang');
            $doanhThuHuyTheoNgay[] = $doanhThuNgayHuy;
        }

        // Trả về kết quả
        return response()->json([
            'tong_doanh_thu_hoan_tat' => $tongDoanhThuHoanTat,
            'doanh_thu_hoan_tat_theo_ngay' => $doanhThuHoanTatTheoNgay,
            'tong_doanh_thu_huy_hoan' => $tongDoanhThuHuy,
            'doanh_thu_huy_hoan_theo_ngay' => $doanhThuHuyTheoNgay,
            'ngay_trong_khoang' => $ngayTrongKhoang // Các ngày trong khoảng thời gian
        ]);
    }

    public function trangThaiKhoangDonSoSanh(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(10));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now());

        $khoangNgay = [];
        for ($date = $ngayBatDau->copy(); $date->lte($ngayKetThuc); $date->addDay()) {
            $khoangNgay[] = $date->format('Y-m-d');
        }

        $soLuongHTDH = [];
        $soLuongHuyHang = [];

        foreach ($khoangNgay as $ngay) {
            $hoanTatDonHang = DonHang::whereDate('created_at', $ngay)
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->count();
            $soLuongHTDH[] = $hoanTatDonHang;

            $huyHang = DonHang::whereDate('created_at', $ngay)
                ->where('trang_thai_don_hang', DonHang::TTDH_DH)
                ->count();
            $soLuongHuyHang[] = $huyHang;
        }

        return response()->json([
            'ngay' => $khoangNgay,
            'so_luong_hoan_tat_don_hang' => $soLuongHTDH,
            'so_luong_huy_hang' => $soLuongHuyHang
        ]);
    }

    public function thanhToanTienMatTheoNgay(Request $request)
    {
        try {
            DB::beginTransaction();
            $today = Carbon::today();

            // Lấy tổng doanh thu và số lượng đơn có trạng thái "Thanh toán khi nhận hàng" trong ngày hiện tại
            $donHangQuery = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->where('phuong_thuc_thanh_toan', DonHang::TTDH_HTDH) // Điều kiện thanh toán khi nhận hàng
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
    public function thanhToanOnlineTheoNgay(Request $request)
    {
        try {
            DB::beginTransaction();
            $today = Carbon::today();

            // Lấy tổng doanh thu và số lượng đơn có phương thức thanh toán online (momo, ngân hàng) trong ngày hiện tại
            $donHangQuery = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereIn('phuong_thuc_thanh_toan', [
                    DonHang::PTTT_MM, // Momo
                    DonHang::PTTT_NH  // Ngân hàng
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
                ->whereDate('updated_at', $today)
                ->count();

            // Số lượng đơn hoàn trong ngày
            $soDonHangHoan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)
                ->whereDate('updated_at', $today)
                ->count();

            // Số lượng đơn mới trong ngày
            $soDonHangMoi = DonHang::whereDate('created_at', $today)
                ->count();

            // Số lượng đơn thành công trong ngày
            $soDonHangThanhCong = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereDate('updated_at', $today)
                ->count();

            // Số lượng sản phẩm bán ra trong ngày
            $soLuongSanPhamBanRa = DonHangChiTiet::whereHas('donHang', function ($query) use ($today) {
                $query->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                    ->whereDate('updated_at', $today);
            })->sum('so_luong');

            // Số lượng khách hàng mua sản phẩm trong ngày
            $soLuongKhachHangMua = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereDate('updated_at', $today)
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

}


