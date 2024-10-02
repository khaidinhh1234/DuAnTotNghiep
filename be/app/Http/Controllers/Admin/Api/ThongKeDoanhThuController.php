<?php

namespace App\Http\Controllers\Admin\API;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\DanhMuc;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class ThongKeDoanhThuController extends Controller
{
    public function doanhThuTheoNgay(Request $request)
    {

        try {
            DB::beginTransaction();
            $today = Carbon::today();

            $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereDate('created_at', $today)
                ->sum('tong_tien_don_hang');

            DB::commit();
            return response()->json(['doanh_thu' => $doanhThu], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function doanhThuTheoTuan(Request $request)
    {
        try {
            DB::beginTransaction();

            // Lấy tuần và tháng từ request
            $tuan = $request->tuan;
            $thang = $request->thang;
            $nam = $request->nam;

            // Kiểm tra dữ liệu đầu vào
            if (!$tuan || !$thang || !$nam) {
                return response()->json(['error' => 'Vui lòng cung cấp tuần, tháng và năm'], 400);
            }

            // Xác định thời gian bắt đầu và kết thúc của tháng
            $startOfMonth = Carbon::create($nam, $thang)->startOfMonth();
            $endOfMonth = Carbon::create($nam, $thang)->endOfMonth();

            // Lấy tuần bắt đầu từ tuần 1
            $startOfWeek = $startOfMonth->copy()->addWeeks($tuan - 1)->startOfWeek();
            $endOfWeek = $startOfMonth->copy()->addWeeks($tuan - 1)->endOfWeek();

            // Đảm bảo tuần nằm trong phạm vi của tháng
            if ($startOfWeek->greaterThan($endOfMonth)) {
                return response()->json(['error' => 'Tuần không hợp lệ'], 400);
            }

            // Nếu tuần vượt quá tháng, điều chỉnh ngày cuối cùng của tuần
            if ($endOfWeek->greaterThan($endOfMonth)) {
                $endOfWeek = $endOfMonth;
            }

            // Tổng doanh thu của tuần đã chọn
            $doanhThuTheoTuan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
                ->sum('tong_tien_don_hang');

            // Doanh thu theo từng ngày trong tuần
            $doanhThuTheoNgayTrongTuan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
                ->selectRaw('DATE(created_at) as ngay, SUM(tong_tien_don_hang) as doanh_thu_ngay')
                ->groupBy('ngay')
                ->orderBy('ngay', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'doanh_thu_tuan' => $doanhThuTheoTuan,
                'doanh_thu_theo_ngay_trong_tuan' => $doanhThuTheoNgayTrongTuan
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }


    public function doanhThuTheoThang(Request $request)
    {
        try {
            DB::beginTransaction();

            // Lấy thông tin tháng và năm từ request
            $thang = $request->thang;
            $nam = $request->nam;

            // Xác định ngày bắt đầu và kết thúc của tháng
            $startOfMonth = Carbon::create($nam, $thang)->startOfMonth();
            $endOfMonth = Carbon::create($nam, $thang)->endOfMonth();

            // Tổng doanh thu của tháng đã chọn
            $doanhThuThang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->sum('tong_tien_don_hang');

            // Doanh thu theo từng tuần trong tháng
            $doanhThuTheoTuanTrongThang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->selectRaw('WEEK(created_at, 1) - WEEK(DATE_SUB(created_at, INTERVAL DAYOFMONTH(created_at)-1 DAY), 1) + 1 as tuan, SUM(tong_tien_don_hang) as doanh_thu_tuan')
                ->groupBy('tuan')
                ->orderBy('tuan', 'asc')
                ->get();

            DB::commit();
            return response()->json([
                'doanh_thu_thang' => $doanhThuThang,
                'doanh_thu_theo_tuan_trong_thang' => $doanhThuTheoTuanTrongThang
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function doanhThuTheoQuy(Request $request)
    {
        try {
            DB::beginTransaction();

            // Lấy quý và năm từ request
            $quy = $request->quy;
            $nam = $request->nam;

            // Kiểm tra dữ liệu đầu vào
            if (!$quy || !$nam || $quy < 1 || $quy > 4) {
                return response()->json(['error' => 'Vui lòng cung cấp quý hợp lệ (1-4) và năm'], 400);
            }

            // Xác định tháng bắt đầu và kết thúc của quý
            $thangBatDau = ($quy - 1) * 3 + 1;
            $thangKetThuc = $thangBatDau + 2;

            // Thời gian bắt đầu và kết thúc của quý
            $startOfQuarter = Carbon::create($nam, $thangBatDau)->startOfMonth();
            $endOfQuarter = Carbon::create($nam, $thangKetThuc)->endOfMonth();

            // Tổng doanh thu của quý đã chọn
            $doanhThuTheoQuy = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfQuarter, $endOfQuarter])
                ->sum('tong_tien_don_hang');

            // Doanh thu theo từng tháng trong quý
            $doanhThuTheoThangTrongQuy = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfQuarter, $endOfQuarter])
                ->selectRaw('MONTH(created_at) as thang, SUM(tong_tien_don_hang) as doanh_thu_thang')
                ->groupBy('thang')
                ->orderBy('thang', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'doanh_thu_quy' => $doanhThuTheoQuy,
                'doanh_thu_theo_thang_trong_quy' => $doanhThuTheoThangTrongQuy
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function doanhThuTheoNam(Request $request)
    {
        try {
            DB::beginTransaction();

            // Lấy năm từ request
            $nam = $request->nam;

            // Kiểm tra dữ liệu đầu vào
            if (!$nam) {
                return response()->json(['error' => 'Vui lòng cung cấp năm'], 400);
            }

            // Thời gian bắt đầu và kết thúc của năm
            $startOfYear = Carbon::create($nam)->startOfYear();
            $endOfYear = Carbon::create($nam)->endOfYear();

            // Tổng doanh thu của năm đã chọn
            $doanhThuTheoNam = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfYear, $endOfYear])
                ->sum('tong_tien_don_hang');

            // Doanh thu theo từng quý trong năm
            $doanhThuTheoQuyTrongNam = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfYear, $endOfYear])
                ->selectRaw('QUARTER(created_at) as quy, SUM(tong_tien_don_hang) as doanh_thu_quy')
                ->groupBy('quy')
                ->orderBy('quy', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'doanh_thu_nam' => $doanhThuTheoNam,
                'doanh_thu_theo_quy_trong_nam' => $doanhThuTheoQuyTrongNam
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function doanhThuTheoSanPham(Request $request)
    {

        try {
            DB::beginTransaction();
            // Lấy tất cả các biến thể sản phẩm và tính tổng doanh thu cho mỗi sản phẩm
            $doanhThuSanPhams = BienTheSanPham::with('sanPham')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_DGTC) // Chỉ lấy đơn hàng đã giao thành công
                ->select(
                    'bien_the_san_phams.san_pham_id',
                    DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu')
                )
                ->groupBy('bien_the_san_phams.san_pham_id')
                ->get();

            DB::commit();
            return response()->json(['doanh_thu_san_pham' => $doanhThuSanPhams], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }
    public function doanhThuTheoTungSanPham(Request $request)
    {
        try {
            DB::beginTransaction();

            // Lấy dữ liệu từ request
            $tenSanPham = $request->ten_san_pham;
            $maSanPham = $request->ma_san_pham;

            // Kiểm tra đầu vào: yêu cầu có tên sản phẩm hoặc mã sản phẩm
            if (!$tenSanPham && !$maSanPham) {
                return response()->json(['error' => 'Vui lòng cung cấp tên hoặc mã sản phẩm'], 400);
            }

            // Lấy thông tin sản phẩm dựa trên tên hoặc mã sản phẩm
            $sanPham = SanPham::when($tenSanPham, function ($query, $tenSanPham) {
                                return $query->where('ten_san_pham', $tenSanPham);
                            })
                            ->when($maSanPham, function ($query, $maSanPham) {
                                return $query->where('ma_san_pham', $maSanPham);
                            })
                            ->first();

            // Nếu không tìm thấy sản phẩm
            if (!$sanPham) {
                return response()->json(['error' => 'Không tìm thấy sản phẩm'], 404);
            }

            // Doanh thu của sản phẩm theo năm
            $doanhThuTheoNam = DonHangChiTiet::join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->join('bien_the_san_phams', 'don_hang_chi_tiets.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->selectRaw('YEAR(don_hangs.created_at) as nam, SUM(don_hang_chi_tiets.so_luong * don_hang_chi_tiets.gia) as doanh_thu_nam')
                ->groupBy('nam')
                ->orderBy('nam', 'asc')
                ->get();

            // Doanh thu của sản phẩm theo tháng hiện tại
            $currentYear = Carbon::now()->year;
            $currentMonth = Carbon::now()->month;
            $doanhThuTheoThang = DonHangChiTiet::join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->join('bien_the_san_phams', 'don_hang_chi_tiets.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereYear('don_hangs.created_at', $currentYear)
                ->whereMonth('don_hangs.created_at', $currentMonth)
                ->selectRaw('SUM(don_hang_chi_tiets.so_luong * don_hang_chi_tiets.gia) as doanh_thu_thang')
                ->first();
            DB::commit();
            return response()->json([
                'san_pham' => $sanPham,
                'doanh_thu_theo_nam' => $doanhThuTheoNam,
                'doanh_thu_thang_hien_tai' => $doanhThuTheoThang->doanh_thu_thang ?? 0
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }
        public function doanhThuTheoDanhMuc(Request $request)
    {

        try {
            DB::beginTransaction();
            // Lấy doanh thu theo danh mục
            $doanhThuDanhMucs = DanhMuc::join('san_phams', 'danh_mucs.id', '=', 'san_phams.danh_muc_id')
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_DGTC) // Chỉ lấy đơn hàng đã giao thành công
                ->select(
                    'danh_mucs.id as danh_muc_id',
                    'danh_mucs.ten_danh_muc',
                    DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu')
                )
                ->groupBy('danh_mucs.id', 'danh_mucs.ten_danh_muc')
                ->get();

            DB::commit();
            return response()->json(['doanh_thu_danh_muc' => $doanhThuDanhMucs], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }


    public function soSanhDoanhThu(Request $request)
    {
        // Bắt đầu transaction


        try {
            DB::beginTransaction();
            // Lấy tham số 'type' từ request (tuần, tháng, quý, năm)
            $type = $request->input('type', 'month');  // Mặc định là tháng
            $now = Carbon::now();

            // Query lấy doanh thu theo thời gian từ đơn hàng có trạng thái 'Đã giao hàng thành công'
            $query = DB::table('don_hangs')
                ->select(DB::raw('SUM(tong_tien_don_hang) as doanh_thu'));

            // Lọc theo loại thống kê (tuần, tháng, quý, năm)
            switch ($type) {
                case 'week':
                    $query->selectRaw('WEEK(created_at) as thoi_gian')  // Nhóm theo tuần
                        ->whereBetween('created_at', [$now->startOfWeek(), $now->endOfWeek()])
                        ->groupBy(DB::raw('WEEK(created_at)'));
                    break;

                case 'month':
                    $query->selectRaw('MONTH(created_at) as thoi_gian')  // Nhóm theo tháng
                        ->whereYear('created_at', $now->year)
                        ->groupBy(DB::raw('MONTH(created_at)'));
                    break;

                case 'quarter':
                    $query->selectRaw('QUARTER(created_at) as thoi_gian')  // Nhóm theo quý
                        ->whereYear('created_at', $now->year)
                        ->groupBy(DB::raw('QUARTER(created_at)'));
                    break;

                case 'year':
                    $query->selectRaw('YEAR(created_at) as thoi_gian')  // Nhóm theo năm
                        ->groupBy(DB::raw('YEAR(created_at)'));
                    break;

                default:
                    $query->selectRaw('MONTH(created_at) as thoi_gian')  // Mặc định là nhóm theo tháng
                        ->whereYear('created_at', $now->year)
                        ->groupBy(DB::raw('MONTH(created_at)'));
                    break;
            }

            // Lọc theo trạng thái đơn hàng "Đã giao hàng thành công"
            $data = $query->where('trang_thai_don_hang', DonHang::TTDH_DGTC)->get();

            // Commit transaction khi không có lỗi
            DB::commit();

            // Trả về dữ liệu doanh thu đã nhóm theo thời gian
            return response()->json($data);
        } catch (Exception $e) {
            // Rollback nếu có lỗi xảy ra
            DB::rollBack();

            // Trả về lỗi kèm theo mã lỗi
            return response()->json(['error' => 'Có lỗi xảy ra trong quá trình xử lý', 'message' => $e->getMessage()], 500);
        }
    }


    public function sanPhamBanChayTheoThang(Request $request)
    {
        // Nhận tháng từ request hoặc sử dụng tháng hiện tại
        $month = $request->input('month', Carbon::now()->month);

        // Lấy danh sách đơn hàng với trạng thái 'Đã giao hàng thành công' trong tháng được chọn
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
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

        // Sản phẩm ít được mua nhất (bottom 1)
        $sanPhamItMuaNhat = $sanPhamStats->last();

        return response()->json([
            'san_pham_ban_chay_nhat' => $sanPhamBanChayNhat,
            'san_pham_it_mua_nhat' => $sanPhamItMuaNhat,
            'thang' => $month,
        ]);
    }

    public function sanPhamBanChayTheoNam(Request $request)
    {
        // Nhận năm từ request hoặc sử dụng năm hiện tại
        $year = $request->input('year', Carbon::now()->year);

        // Lấy danh sách đơn hàng với trạng thái 'Đã giao hàng thành công' trong năm được chọn
        $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereYear('created_at', $year)
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

        // Sản phẩm ít được mua nhất (bottom 1)
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

