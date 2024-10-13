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

        // Lấy tất cả các đơn hàng có trạng thái "Giao hàng thành công" trong khoảng thời gian hiện tại
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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
        $donHangsTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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

    public function doanhThuKhoangSoSanh(Request $request)
    {

        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc);

        $donHangTrongKhoang = DonHang::whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        $tongTienHienTai = $donHangTrongKhoang->sum('tong_tien_don_hang');
        $tongSoLuongDonHangHienTai = $donHangTrongKhoang->count();

        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);


        $donHangTrongKhoangTruoc = DonHang::whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        $tongTienTruoc = $donHangTrongKhoangTruoc->sum('tong_tien_don_hang');
        $tongSoLuongDonHangTruoc = $donHangTrongKhoangTruoc->count();


        $doanhThuHienTai = [];
        $ngayHienTai = [];
        for ($i = 0; $i <= $khoangThoiGian; $i++) {
            $ngay = $ngayBatDau->copy()->addDays($i);
            $doanhThuNgay = DonHang::whereDate('created_at', $ngay)
                ->sum('tong_tien_don_hang');
            $doanhThuHienTai[] = $doanhThuNgay;
            $ngayHienTai[] = $ngay->format('Y-m-d'); // Lưu ngày vào mảng
        }

        $doanhThuTruoc = [];
        $ngayTruoc = [];
        for ($i = 0; $i <= $khoangThoiGian; $i++) {
            $ngay = $ngayBatDauTruoc->copy()->addDays($i);
            $doanhThuNgayTruoc = DonHang::whereDate('created_at', $ngay)
                ->sum('tong_tien_don_hang');
            $doanhThuTruoc[] = $doanhThuNgayTruoc;
            $ngayTruoc[] = $ngay->format('Y-m-d'); // Lưu ngày vào mảng
        }

        // Trả về kết quả
        return response()->json([
            'tong_so_luong_don_hang_hien_tai' => $tongSoLuongDonHangHienTai,
            'tong_tien_hien_tai' => $tongTienHienTai,
            'tong_so_luong_don_hang_truoc' => $tongSoLuongDonHangTruoc,
            'tong_tien_truoc' => $tongTienTruoc,
            'doanh_thu_hien_tai' => $doanhThuHienTai, // Mảng doanh thu của từng ngày trong khoảng hiện tại
            'ngay_hien_tai' => $ngayHienTai, // Mảng ngày của từng ngày trong khoảng hiện tại
            'doanh_thu_truoc' => $doanhThuTruoc, // Mảng doanh thu của từng ngày trong khoảng trước đó
            'ngay_truoc' => $ngayTruoc // Mảng ngày của từng ngày trong khoảng trước đó
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

}


