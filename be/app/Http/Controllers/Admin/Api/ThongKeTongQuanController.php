<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ValidateKhoangNgayNhapRequest;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\SanPham;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThongKeTongQuanController extends Controller
{

    public function thongKeTongQuan(ValidateKhoangNgayNhapRequest $request)
    {
        // Gọi hàm thống kê doanh thu theo khoảng
        $doanhThuTheoKhoang = $this->doanhThuTheoKhoang($request);

        // Gọi hàm so sánh trạng thái đơn hàng trong khoảng
        $trangThaiKhoangDonSoSanh = $this->trangThaiKhoangDonSoSanh($request);

        // Gọi hàm thống kê đơn hàng chốt
        $thongKeDonHangChot = $this->thongKeDonHangChot($request);

        // Gọi hàm thống kê hoàn hàng
        $thongKeHoanHang = $this->thongKeHoanHang($request);

        // Gọi hàm thống kê sản phẩm tồn kho
        $thongKeSanPhamTonKho = $this->thongKeSanPhamTonKho($request);

        // Gọi hàm thống kê doanh thu tổng
        $thongKeDoanhThuTong = $this->thongKeDoanhThuTong($request);

        // Gọi hàm thống kê lợi nhuận
        $thongKeLoiNhuan = $this->thongKeLoiNhuan($request);

        // Gọi hàm thống kê thanh toán online
        $thongKeThanhToanOnline = $this->thongKeThanhToanOnline($request);

        // Gọi hàm thống kê thanh toán offline
        $thongKeThanhToanOff = $this->thongKeThanhToanOff($request);

        // Gọi hàm thống kê doanh số sản phẩm
        $thongKeDoanhSoSanPham = $this->thongKeDoanhSoSanPham($request);

        // Gọi hàm thống kê doanh thu trung bình
        $thongKeDoanhThuTB = $this->thongKeDoanhThuTB($request);

        // Tổng hợp kết quả từ các hàm thống kê
        return response()->json([
            'doanh_thu_theo_khoang' => $doanhThuTheoKhoang->original,
            'trang_thai_don_hang_so_sanh' => $trangThaiKhoangDonSoSanh->original,
            'thong_ke_don_hang_chot' => $thongKeDonHangChot->original,
            'thong_ke_hoan_hang' => $thongKeHoanHang->original,
            'thong_ke_san_pham_ton_kho' => $thongKeSanPhamTonKho->original,
            'thong_ke_doanh_thu' => $thongKeDoanhThuTong->original,
            'thong_ke_loi_nhuan' => $thongKeLoiNhuan->original,
            'thong_ke_thanh_toan_online' => $thongKeThanhToanOnline->original,
            'thong_ke_thanh_toan_off' => $thongKeThanhToanOff->original,
            'thong_ke_doanh_so_san_pham' => $thongKeDoanhSoSanPham->original,
            'thong_ke_doanh_thu_tb' => $thongKeDoanhThuTB->original,
        ]);
    }
    public function thongKeDonHangChot(ValidateKhoangNgayNhapRequest $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
       $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

        // Trạng thái cần loại trừ
        $trangThaiBoQua = [
            DonHang::TTDH_DH,   // Hủy hàng
            DonHang::TTDH_HTDH, // Hoàn tất đơn hàng
            DonHang::TTDH_DHTB, // Đơn hàng bị từ chối nhận
            DonHang::TTDH_HH    // Hoàn hàng
        ];

        // Lấy các đơn hàng chốt trong khoảng thời gian và không thuộc các trạng thái bị loại trừ
        $donHangChot = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', values: [$ngayBatDau, $ngayKetThuc])
            ->whereNotIn('trang_thai_don_hang', $trangThaiBoQua)
            ->get();

        $tongTien = 0;
        $tongSoLuongDonHang = $donHangChot->count();

        // Tính tổng tiền của các đơn hàng chốt
        $donHangChot->each(function ($donHang) use (&$tongTien) {
            $tongTien += $donHang->tong_tien_don_hang;
        });

        // Lấy khoảng thời gian trước để so sánh
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy các đơn hàng chốt trong khoảng thời gian trước và không thuộc các trạng thái bị loại trừ
        $donHangChotTruoc = DonHang::with(['chiTiets.bienTheSanPham.sanPham'])
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->whereNotIn('trang_thai_don_hang', $trangThaiBoQua)
            ->get();

        $tongTienTruoc = 0;
        $tongSoLuongDonHangTruoc = $donHangChotTruoc->count();

        // Tính tổng tiền của các đơn hàng chốt trước đó
        $donHangChotTruoc->each(function ($donHang) use (&$tongTienTruoc) {
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
    public function thongKeHoanHang(ValidateKhoangNgayNhapRequest $request)
    {
        // Lấy ngày bắt đầu và kết thúc từ request (hoặc mặc định là 10 ngày gần nhất)
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
       $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        // Tính khoảng thời gian để so sánh trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;

        // Lấy các đơn hàng hoàn trả trong khoảng thời gian hiện tại
        $donHangHoan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('ngay_hoan', values: [$ngayBatDau, $ngayKetThuc])
            ->get();

        // Tính tổng số lượng đơn hàng hoàn và tổng tiền hoàn (dựa trên tổng tiền đơn hàng)
        $tongTienHoan = $donHangHoan->sum('tong_tien_don_hang');
        $tongSoLuongDonHangHoan = $donHangHoan->count();

        // Lấy khoảng thời gian trước đó để so sánh
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy các đơn hàng hoàn trả trong khoảng thời gian trước đó
        $donHangHoanTruoc = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)
            ->whereBetween('ngay_hoan', [$ngayBatDauTruoc, $ngayKetThucTruoc])
            ->get();

        // Tính tổng số lượng đơn hàng hoàn trước đó và tổng tiền hoàn trước đó
        $tongTienHoanTruoc = $donHangHoanTruoc->sum('tong_tien_don_hang');
        $tongSoLuongDonHangHoanTruoc = $donHangHoanTruoc->count();

        // Tính tỷ lệ tăng giảm số lượng đơn hàng hoàn
        $tiLeTangGiamDonHangHoan = $tongSoLuongDonHangHoanTruoc > 0
            ? (($tongSoLuongDonHangHoan - $tongSoLuongDonHangHoanTruoc) / $tongSoLuongDonHangHoanTruoc) * 100
            : ($tongSoLuongDonHangHoan > 0 ? 100 : 0);

        // Tính tỷ lệ tăng giảm tổng tiền hoàn
        $tiLeTangGiamTienHoan = $tongTienHoanTruoc > 0
            ? (($tongTienHoan - $tongTienHoanTruoc) / $tongTienHoanTruoc) * 100
            : ($tongTienHoan > 0 ? 100 : 0);

        // Trả về kết quả thống kê
        return response()->json([
            'tong_so_luong_don_hang_hoan' => $tongSoLuongDonHangHoan,
            'tong_tien_hoan' => $tongTienHoan,
            'tong_so_luong_don_hang_hoan_truoc' => $tongSoLuongDonHangHoanTruoc,
            'tong_tien_hoan_truoc' => $tongTienHoanTruoc,
            'ti_le_tang_giam_don_hang_hoan' => $tiLeTangGiamDonHangHoan,  // Trả về số
            'ti_le_tang_giam_tien_hoan' => $tiLeTangGiamTienHoan,          // Trả về số
        ]);
    }
    public function thongKeSanPhamTonKho(ValidateKhoangNgayNhapRequest $request)
    {
        // Lấy ngày bắt đầu và ngày kết thúc từ request hoặc mặc định
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
       $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

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
    public function thongKeDoanhThuTong(ValidateKhoangNgayNhapRequest $request)
    {
        try {
            // Lấy ngày bắt đầu và ngày kết thúc từ request hoặc dùng giá trị mặc định
            $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
            $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();
            $trangThaiBiLoaiBo = [
                DonHang::TTDH_DH,   // Hủy hàng
                DonHang::TTDH_HTDH, // Hoàn tất đơn hàng
                DonHang::TTDH_DHTB, // Đơn hàng bị từ chối nhận
                DonHang::TTDH_HH    // Hoàn hàng
            ];
            // Lấy danh sách đơn hàng hoàn tất trong khoảng thời gian
            $donHangs = DonHang::whereNotIn('trang_thai_don_hang',  $trangThaiBiLoaiBo)
                ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
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
            $donHangsTruoc = DonHang::whereNotIn('trang_thai_don_hang',  $trangThaiBiLoaiBo)
                ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
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
    public function thongKeThanhToanOnline(ValidateKhoangNgayNhapRequest $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
       $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        $trangThaiBiLoaiBo = [
            DonHang::TTDH_DH,   // Hủy hàng
            DonHang::TTDH_HTDH, // Hoàn tất đơn hàng
            DonHang::TTDH_DHTB, // Đơn hàng bị từ chối nhận
            DonHang::TTDH_HH    // Hoàn hàng
        ];

        $donHangs = DonHang::whereNotIn('trang_thai_don_hang', $trangThaiBiLoaiBo)
            ->whereIn('phuong_thuc_thanh_toan', [DonHang::PTTT_MM, DonHang::PTTT_NH])
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
        $soDonHang = $donHangs->count();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        $donHangsTruoc = DonHang::whereNotIn('trang_thai_don_hang', $trangThaiBiLoaiBo)
            ->whereIn('phuong_thuc_thanh_toan', [DonHang::PTTT_MM, DonHang::PTTT_NH])
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
    public function thongKeThanhToanOff(ValidateKhoangNgayNhapRequest $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
       $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        $trangThaiBiLoaiBo = [
            DonHang::TTDH_DH,   // Hủy hàng
            DonHang::TTDH_HTDH, // Hoàn tất đơn hàng
            DonHang::TTDH_DHTB, // Đơn hàng bị từ chối nhận
            DonHang::TTDH_HH    // Hoàn hàng
        ];

        // Lấy đơn hàng theo các điều kiện
        $donHangs = DonHang::whereNotIn('trang_thai_don_hang', $trangThaiBiLoaiBo)
            ->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
            ->whereBetween('created_at', [$ngayBatDau, $ngayKetThuc])
            ->get();

        // Tính tổng doanh thu và số đơn hàng trong khoảng thời gian hiện tại
        $tongDoanhThu = $donHangs->sum('tong_tien_don_hang');
        $soDonHang = $donHangs->count();

        // Tính khoảng thời gian để lấy dữ liệu trước đó
        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc) + 1;
        $ngayBatDauTruoc = $ngayBatDau->copy()->subDays($khoangThoiGian);
        $ngayKetThucTruoc = $ngayKetThuc->copy()->subDays($khoangThoiGian);

        // Lấy đơn hàng trước đó
        $donHangsTruoc = DonHang::whereNotIn('trang_thai_don_hang', $trangThaiBiLoaiBo)
            ->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT)
            ->whereBetween('created_at', [$ngayBatDauTruoc, $ngayKetThucTruoc])
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
    public function thongKeLoiNhuan(ValidateKhoangNgayNhapRequest $request)
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
    public function thongKeDoanhSoSanPham(ValidateKhoangNgayNhapRequest $request)
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
    public function thongKeDoanhThuTB(ValidateKhoangNgayNhapRequest $request)
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
    public function doanhThuTheoKhoang(ValidateKhoangNgayNhapRequest $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
       $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->endOfDay();

        $khoangThoiGian = $ngayBatDau->diffInDays($ngayKetThuc);

        // Lấy đơn hàng hoàn tất (TTDH_HTDH)
        $donHangHoanTat = DonHang::whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc])
            ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->get();

        // Tính tổng doanh thu cho đơn hàng hoàn tất
        $tongDoanhThuHoanTat = $donHangHoanTat->sum('tong_tien_don_hang');

        // Lấy doanh thu theo từng ngày cho đơn hàng hoàn tất
        $doanhThuHoanTatTheoNgay = [];
        $ngayTrongKhoang = [];
        for ($i = 0; $i <= $khoangThoiGian; $i++) {
            $ngay = $ngayBatDau->copy()->addDays($i);
            $doanhThuNgay = DonHang::whereDate('ngay_hoan_thanh_don', $ngay)
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->sum('tong_tien_don_hang');
            $doanhThuHoanTatTheoNgay[] = $doanhThuNgay;
            $ngayTrongKhoang[] = $ngay->format('Y-m-d');
        }

        // Lấy đơn hàng hủy (TTDH_DH, TTDH_HH)
        $donHangHoan = DonHang::whereBetween('ngay_hoan', [$ngayBatDau, $ngayKetThuc]) // Sửa 'updated_at' thành 'ngay_huy'
            ->where('trang_thai_don_hang',   DonHang::TTDH_HH )
            ->get();

        // Tính tổng doanh thu cho đơn hàng hủy
        $tongDoanhThuHoan = $donHangHoan->sum('tong_tien_don_hang');

        // Lấy doanh thu theo từng ngày cho đơn hàng hủy
        $doanhThuHoanTheoNgay = [];
        for ($i = 0; $i <= $khoangThoiGian; $i++) {
            $ngay = $ngayBatDau->copy()->addDays($i);
            $doanhThuNgayHoan = DonHang::whereDate('ngay_hoan', $ngay) // Sửa 'updated_at' thành 'ngay_huy'
            ->where('trang_thai_don_hang',   DonHang::TTDH_HH )
                ->sum('tong_tien_don_hang');
            $doanhThuHoanTheoNgay[] = $doanhThuNgayHoan;
        }

        // Trả về kết quả
        return response()->json([
            'tong_doanh_thu_hoan_tat' => $tongDoanhThuHoanTat,
            'doanh_thu_hoan_tat_theo_ngay' => $doanhThuHoanTatTheoNgay,
            'tong_doanh_thu_huy_hoan' => $tongDoanhThuHoan,
            'doanh_thu_huy_hoan_theo_ngay' => $doanhThuHoanTheoNgay,
            'ngay_trong_khoang' => $ngayTrongKhoang // Các ngày trong khoảng thời gian
        ]);
    }
    public function trangThaiKhoangDonSoSanh(ValidateKhoangNgayNhapRequest $request)
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
            $hoanTatDonHang = DonHang::whereDate('ngay_hoan_thanh_don', $ngay)
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->count();
            $soLuongHTDH[] = $hoanTatDonHang;

            $huyHang = DonHang::whereDate('ngay_huy', operator: $ngay)
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
    // Tổng quan theo ngày
    public function thanhToanTienMatTheoNgay(Request $request)
    {
        try {
            DB::beginTransaction();
            $today = Carbon::today();
            $trangThaiBoQua = [
                DonHang::TTDH_DH,
                DonHang::TTDH_HTDH,
                DonHang::TTDH_DHTB,
                DonHang::TTDH_HH
            ];
            // Lấy tổng doanh thu và số lượng đơn có trạng thái "Thanh toán khi nhận hàng" trong ngày hiện tại
            $donHangQuery = DonHang::whereNotIn('trang_thai_don_hang',  $trangThaiBoQua)
                ->where('phuong_thuc_thanh_toan', DonHang::PTTT_TT) // Điều kiện thanh toán khi nhận hàng
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
            $trangThaiBoQua = [
                DonHang::TTDH_DH,
                DonHang::TTDH_HTDH,
                DonHang::TTDH_DHTB,
                DonHang::TTDH_HH
            ];
            // Lấy tổng doanh thu và số lượng đơn có phương thức thanh toán online (momo, ngân hàng) trong ngày hiện tại
            $donHangQuery = DonHang::whereNotIn('trang_thai_don_hang', $trangThaiBoQua )
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
                    DonHang::TTDH_DGH,
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
        $startTime = Carbon::today(); // 00:00 của ngày hiện tại
        $endTime = Carbon::tomorrow(); // 00:00 của ngày hôm sau

        // Tạo khoảng thời gian cách nhau 2 giờ
        $intervals = [];
        for ($i = 0; $i < 24; $i += 2) {
            $intervals[] = [
                'start' => $startTime->copy()->addHours($i),
                'end' => $startTime->copy()->addHours($i + 2),
            ];
        }

        // Mảng để lưu các giá trị cho doanh thu và lợi nhuận
        $doanhThuArray = [];
        $loiNhuanArray = [];

        // Lặp qua từng khoảng thời gian để tính doanh thu và lợi nhuận
        foreach ($intervals as $interval) {
            // Lấy tất cả các đơn hàng trong khoảng thời gian này
            $donHangs = DonHang::query()
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH) // Đơn hàng đã hoàn tất
                ->whereBetween('ngay_hoan_thanh_don', values: [$interval['start'], $interval['end']])
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

        // $trangThaiBoQua = [
        //     DonHang::TTDH_DH,
        //     DonHang::TTDH_HTDH,
        //     DonHang::TTDH_DHTB,
        //     DonHang::TTDH_HH
        // ];

        $donHangs = DonHang::where('trang_thai_don_hang',  DonHang::TTDH_HTDH)
            ->whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc])
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
