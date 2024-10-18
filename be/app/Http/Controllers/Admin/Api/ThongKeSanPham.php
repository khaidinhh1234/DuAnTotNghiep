<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\SanPham;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThongKeSanPham extends Controller
{
    public function thongKeTopSanPham(Request $request)
    {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now());
        $soLuongTop = $request->input('top', 5);

        $dates = [];
        for ($date = $ngayBatDau->copy(); $date->lte($ngayKetThuc); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');
        }

        // Truy vấn chi tiết đơn hàng theo khoảng thời gian và trạng thái "TTDH_HTDH"
        $topSanPhams = DonHangChiTiet::select('bien_the_san_pham_id', DB::raw('SUM(so_luong) as tong_so_luong'))
        ->whereHas('donHang', function ($query) use ($ngayBatDau, $ngayKetThuc) {
            $query->whereBetween('ngay_hoan_thanh_don', [$ngayBatDau, $ngayKetThuc]);
        })
        ->groupBy('bien_the_san_pham_id')
        ->orderBy('tong_so_luong', 'desc')
        ->limit($soLuongTop)
        ->with(['bienTheSanPham.sanPham']) // Load sản phẩm để lấy tên
        ->get();

        $result = [];

        foreach ($topSanPhams as $sanPhamChiTiet) {
            $tenSanPham = $sanPhamChiTiet->bienTheSanPham->sanPham->ten_san_pham;

            $soLuongTheoNgay = [];
            foreach ($dates as $date) {
                $soLuongTrongNgay = DonHangChiTiet::whereHas('donHang', function ($query) use ($date) {
                    $query->whereDate('ngay_hoan_thanh_don', $date);
                })
                    ->where('bien_the_san_pham_id', $sanPhamChiTiet->bien_the_san_pham_id)
                    ->sum('so_luong');
                // Đảm bảo số lượng là một số (trả về 0 nếu không có dữ liệu)
                $soLuongTheoNgay[] = (int) $soLuongTrongNgay;
            }

            // Thêm vào result
            $result[] = [
                'name' => $tenSanPham,
                'data' => $soLuongTheoNgay,
            ];
        }

        return response()->json([
            'ngay_trong_khoang_chon' => $dates,
            'series' => $result,
        ]);
    }

    public function thongKeSanPhamAllTime(Request $request) {
        $ngayBatDau = Carbon::parse($request->input('ngay_bat_dau') ?? now()->subDays(9));
        $ngayKetThuc = Carbon::parse($request->input('ngay_ket_thuc') ?? now())->addDay();
    
        // Lấy danh sách các sản phẩm và biến thể
        $sanPhams = SanPham::whereHas('bienTheSanPham.chiTiets.donHang', function ($query) {
            $query->where('trang_thai_don_hang', DonHang::TTDH_HTDH);
        })->with(['bienTheSanPham', 'bienTheSanPham.chiTiets' => function ($query) {
            $query->whereHas('donHang', function ($query) {
                $query->where('trang_thai_don_hang', DonHang::TTDH_HTDH);
            });
        }])->get();
    
        // Khởi tạo các biến tổng
        $totalSoLuongBanRa = 0;
        $totalSoLuongThucTeBan = 0;
        $totalTienHang = 0;
        $totalDoanhSo = 0;
        $totalSoLuongDonHang = 0;
    
        $thongKeSanPhams = [];
    
        foreach ($sanPhams as $sanPham) {
            foreach ($sanPham->bienTheSanPham as $bienThe) {
                $soLuongThucTeBan = 0;
                $soLuongBanRa = 0;
                $tienHang = 0;
                $doanhSo = 0;
                $soLuongDonHang = 0;
    
                foreach ($bienThe->chiTiets as $chiTiet) {
                    $donHang = $chiTiet->donHang;
    
                    // Tính tổng số lượng bán ra (bao gồm tất cả đơn hàng)
                    $soLuongBanRa += $chiTiet->so_luong;
    
                    // Chỉ tính số lượng thực bán và thành tiền cho các đơn hoàn tất
                    if ($donHang->trang_thai_don_hang === DonHang::TTDH_HTDH) {
                        $soLuongThucTeBan += $chiTiet->so_luong;
                        $doanhSo += $chiTiet->thanh_tien;
                        $soLuongDonHang++;
                    }
                }
    
                // Tính tiền hàng từ chi phí sản xuất * số lượng biến thể (hoặc số lượng bán ra tùy logic)
                $tienHang = $bienThe->chi_phi_san_xuat * $soLuongBanRa;
    
                // Cộng dồn các giá trị vào tổng
                $totalSoLuongBanRa += $soLuongBanRa;
                $totalSoLuongThucTeBan += $soLuongThucTeBan;
                $totalTienHang += $tienHang;
                $totalDoanhSo += $doanhSo;
                $totalSoLuongDonHang += $soLuongDonHang;
    
                // Lưu dữ liệu thống kê vào mảng
                $thongKeSanPhams[] = [
                    'ma_san_pham' => $sanPham->ma_san_pham,
                    'ten_san_pham' => $sanPham->ten_san_pham,
                    'so_luong_ban_ra' => $soLuongBanRa,
                    'so_luong_thuc_ban' => $soLuongThucTeBan,
                    'tien_hang' => $tienHang,
                    'doanh_so' => $doanhSo,
                    'so_luong_don_hang' => $soLuongDonHang,
                ];
            }
        }
    
        return response()->json([
            'data' => $thongKeSanPhams,
            'tong_so_luong_ban_ra' => $totalSoLuongBanRa,
            'tong_so_luong_thuc_ban' => $totalSoLuongThucTeBan,
            'tong_tien_hang' => $totalTienHang,
            'tong_doanh_so' => $totalDoanhSo,
            'tong_so_luong_don_hang' => $totalSoLuongDonHang,
            'ngay_bat_dau' => $ngayBatDau->format('Y-m-d'),
            'ngay_ket_thuc' => $ngayKetThuc->format('Y-m-d')
        ]);
    }
    


    public function thongKeSanPhamTonKho()
    {
        // Ngày hiện tại và ngày cách đây 3 tháng
        $ngayHienTai = Carbon::now();
        $ngay3ThangTruoc = $ngayHienTai->subMonths(3);


        $sanPhamTonKho = SanPham::where('created_at', '<=', $ngay3ThangTruoc)
            ->with(['bienThes'])
            ->get();

        $thongKeTonKho = [];
        $tongSoLuongTonKhoTatCaSanPham = 0;

        foreach ($sanPhamTonKho as $sanPham) {
            $tongSoLuongTon = 0;

            foreach ($sanPham->bienThes as $bienThe) {
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

        return [
            'tong_so_luong_ton_kho' => $tongSoLuongTonKhoTatCaSanPham,
            'danh_sach_san_pham_ton_kho' => $thongKeTonKho
        ];
    }

    public function thongKeDoanhThuTheoSanPham(Request $request)
    {
        $tenSanPham = $request->ten_san_pham;

        // Tìm sản phẩm theo tên
        $sanPham = SanPham::where('ten_san_pham', $tenSanPham)->first();

        if (!$sanPham) {
            return response()->json(['message' => 'Sản phẩm không tồn tại.'], 404);
        }

        // Lấy doanh thu theo trạng thái giao hàng thành công
        $doanhThu = DonHangChiTiet::with(['donHang'])
            ->whereHas('donHang', function ($query) {
                $query->where('trang_thai_don_hang', DonHang::TTDH_HTDH);
            })
            ->where('bien_the_san_pham_id', $sanPham->id)
            ->get();

        $tongDoanhThu = $doanhThu->sum('thanh_tien');

        $doanhThuTheoNgay = $doanhThu->where('created_at', '>=', now()->startOfDay())->sum('thanh_tien');
        $doanhThuTheoTuan = $doanhThu->where('created_at', '>=', now()->startOfWeek())->sum('thanh_tien');
        $doanhThuTheoThang = $doanhThu->where('created_at', '>=', now()->startOfMonth())->sum('thanh_tien');
        $doanhThuTheoQuy = $doanhThu->where('created_at', '>=', now()->startOfQuarter())->sum('thanh_tien');
        $doanhThuTheoNam = $doanhThu->where('created_at', '>=', now()->startOfYear())->sum('thanh_tien');

        return response()->json([
            'ten_san_pham' => $sanPham->ten_san_pham,
            'tong_doanh_thu' => $tongDoanhThu,
            'doanh_thu_theo_ngay' => $doanhThuTheoNgay,
            'doanh_thu_theo_tuan' => $doanhThuTheoTuan,
            'doanh_thu_theo_thang' => $doanhThuTheoThang,
            'doanh_thu_theo_quy' => $doanhThuTheoQuy,
            'doanh_thu_theo_nam' => $doanhThuTheoNam
        ]);
    }

    public function doanhThuTheoTungSanPham(Request $request)
    {
        try {
            DB::beginTransaction();

            $tenSanPham = $request->ten_san_pham;
            $maSanPham = $request->ma_san_pham;

            if (!$tenSanPham && !$maSanPham) {
                return response()->json(['error' => 'Vui lòng cung cấp tên hoặc mã sản phẩm'], 400);
            }

            $sanPham = SanPham::when($tenSanPham, function ($query, $tenSanPham) {
                return $query->where('ten_san_pham', $tenSanPham);
            })
                ->when($maSanPham, function ($query, $maSanPham) {
                    return $query->where('ma_san_pham', $maSanPham);
                })
                ->first();

            if (!$sanPham) {
                return response()->json(['error' => 'Không tìm thấy sản phẩm'], 404);
            }

            $doanhThuTheoNam = DonHangChiTiet::join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->join('bien_the_san_phams', 'don_hang_chi_tiets.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->selectRaw('YEAR(don_hangs.created_at) as nam, SUM(don_hang_chi_tiets.so_luong * don_hang_chi_tiets.gia) as doanh_thu_nam')
                ->groupBy('nam')
                ->orderBy('nam', 'asc')
                ->get();

            $currentYear = Carbon::now()->year;
            $currentMonth = Carbon::now()->month;
            $doanhThuTheoThang = DonHangChiTiet::join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->join('bien_the_san_phams', 'don_hang_chi_tiets.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereYear('don_hangs.created_at', $currentYear)
                ->whereMonth('don_hangs.created_at', $currentMonth)
                ->selectRaw('SUM(don_hang_chi_tiets.so_luong * don_hang_chi_tiets.gia) as doanh_thu_thang')
                ->first();
            DB::commit();
            return response()->json([
                'san_pham' => $sanPham,
                'doanh_thu_theo_nam' => (float) $doanhThuTheoNam,
                'doanh_thu_thang_hien_tai' => (float) $doanhThuTheoThang->doanh_thu_thang ?? 0
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function sanPhamBanChayTheoThang(Request $request)
    {
        $month = $request->input('month', Carbon::now()->month);

        // Lấy danh sách đơn hàng với trạng thái 'Đã giao hàng thành công' trong tháng được chọn
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereMonth('created_at', $month)
            ->pluck('id'); // Lấy danh sách id của các đơn hàng

        // Lấy thống kê sản phẩm dựa trên đơn hàng chi tiết
        $sanPhamStats = DonHangChiTiet::whereIn('don_hang_id', $donHangs)
            ->join('bien_the_san_phams', 'don_hang_chi_tiets.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
            ->join('san_phams', 'bien_the_san_phams.san_pham_id', '=', 'san_phams.id')
            ->select(
                'san_phams.ten_san_pham',
                DB::raw('SUM(don_hang_chi_tiets.so_luong) as tong_so_luong'),
                DB::raw('SUM(don_hang_chi_tiets.thanh_tien) as tong_doanh_thu'),
                'bien_the_san_phams.gia_ban'
            )
            ->groupBy('san_phams.ten_san_pham', 'bien_the_san_phams.gia_ban')
            ->orderBy('tong_so_luong', 'desc')
            ->get();

        // Sản phẩm bán chạy nhất (top 1)
        $sanPhamBanChayNhat = $sanPhamStats->first();

        $sanPhamItMuaNhat = $sanPhamStats->last();

        return response()->json([
            'san_pham_ban_chay_nhat' => $sanPhamBanChayNhat,
            'san_pham_it_mua_nhat' => $sanPhamItMuaNhat,
            'thang' => $month,
        ]);
    }
    public function sanPhamBanChayTheoNam(Request $request)
    {

        $year = $request->input('year', Carbon::now()->year);

        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->whereYear('created_at', $year)
            ->pluck('id');

        $sanPhamStats = DonHangChiTiet::whereIn('don_hang_id', $donHangs)
            ->join('bien_the_san_phams', 'don_hang_chi_tiets.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
            ->join('san_phams', 'bien_the_san_phams.san_pham_id', '=', 'san_phams.id')
            ->select(
                'san_phams.ten_san_pham',
                DB::raw('SUM(don_hang_chi_tiets.so_luong) as tong_so_luong'),
                DB::raw('SUM(don_hang_chi_tiets.thanh_tien) as tong_doanh_thu'),
                'bien_the_san_phams.gia_ban'
            )
            ->groupBy('san_phams.ten_san_pham', 'bien_the_san_phams.gia_ban')
            ->orderBy('tong_so_luong', 'desc')
            ->get();

        $sanPhamBanChayNhat = $sanPhamStats->first();

        $sanPhamItMuaNhat = $sanPhamStats->last();

        return response()->json([
            'san_pham_ban_chay_nhat' => $sanPhamBanChayNhat,
            'san_pham_it_mua_nhat' => $sanPhamItMuaNhat,
            'nam' => $year,
        ]);
    }

    public function soLuongTonKhoCuaSanPham()
    {
        $products = SanPham::with([
            'bienTheSanPham' => function ($query) {
                $query->select('san_pham_id', DB::raw('SUM(so_luong_bien_the) as total_quantity'))
                    ->groupBy('san_pham_id');
            }
        ])->get();

        $result = $products->map(function ($product) {
            $totalQuantity = $product->bienTheSanPham->isNotEmpty()
                ? $product->bienTheSanPham->first()->total_quantity
                : 0;

            return [
                'id' => $product->id,
                'ten_san_pham' => $product->ten_san_pham,
                'ma_san_pham' => $product->ma_san_pham,
                'tong_so_luong_bien_the' => $totalQuantity
            ];
        });

        return response()->json($result);
    }
    public function soLuongSanPhamSapHetHang()
    {
        $products = SanPham::with([
            'bienTheSanPham' => function ($query) {
                $query->select('san_pham_id', DB::raw('SUM(so_luong_bien_the) as total_quantity'))
                    ->groupBy('san_pham_id');
            }
        ])->get();

        $result = $products->filter(function ($product) {
            $totalQuantity = $product->bienTheSanPham->isNotEmpty()
                ? $product->bienTheSanPham->first()->total_quantity
                : 0;

            return $totalQuantity < 10;
        })->map(function ($product) {
            $totalQuantity = $product->bienTheSanPham->isNotEmpty()
                ? $product->bienTheSanPham->first()->total_quantity
                : 0;

            return [
                'id' => $product->id,
                'ten_san_pham' => $product->ten_san_pham,
                'ma_san_pham' => $product->ma_san_pham,
                'tong_so_luong_bien_the' => $totalQuantity
            ];
        });

        return response()->json($result);
    }
}