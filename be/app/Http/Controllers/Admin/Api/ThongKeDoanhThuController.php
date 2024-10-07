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

    public function thongKeDoanhThuTuanTu(Request $request)
    {
        // Lấy tham số từ request: năm, quý, tháng, tuần
        $nam = (int) $request->input('nam');
        $quy = (int) $request->input('quy');
        $thang = (int) $request->input('thang');
        $tuan = (int) $request->input('tuan');

        // Khởi tạo cấu trúc doanh thu
        $doanhThu = [
            'theo_nam' => ['quy' => [], 'doanh_thu' => []],
            'theo_quy' => ['thang' => [], 'doanh_thu' => []],
            'theo_thang' => ['tuan' => [], 'doanh_thu' => []],
            'theo_tuan' => ['ngay' => [], 'doanh_thu' => []],
        ];

        // Nếu không có tham số nào, mặc định lấy theo tuần hiện tại
        if (empty($nam) && empty($quy) && empty($thang) && empty($tuan)) {
            $now = now();
            $nam = $now->year;
            $thang = $now->month;
            $quy = ceil($thang / 3);
            $tuan = $now->weekOfYear;

            // Tính khoảng thời gian đầu cuối tuần
            $startOfWeek = $now->startOfWeek()->toDateString();
            $endOfWeek = $now->endOfWeek()->toDateString();

            // Tính tổng doanh thu theo tuần
            $tongDoanhThuTuan = (float) DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
                ->sum('tong_tien_don_hang');

            // Thống kê doanh thu 7 ngày trong tuần
            for ($i = 1; $i <= 7; $i++) {
                $ngayTrongTuan = now()->setISODate($nam, $tuan, $i)->toDateString();
                $doanhThuTheoNgay = (float) DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                    ->whereDate('created_at', $ngayTrongTuan)
                    ->sum('tong_tien_don_hang');

                $doanhThu['theo_tuan']['ngay'][] = $ngayTrongTuan;
                $doanhThu['theo_tuan']['doanh_thu'][] = $doanhThuTheoNgay;
            }

            return response()->json(['tong_doanh_thu_tuan' => $tongDoanhThuTuan] + $doanhThu);
        }

        // Query chung cho doanh thu
        $query = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC);

        // Nếu có chọn năm
        if ($nam) {
            $query->whereYear('created_at', $nam);
            $tongDoanhThuNam = (float) $query->sum('tong_tien_don_hang');

            // Nếu không có quý, tháng, tuần, chỉ trả về doanh thu theo năm
            if (!$quy && !$thang && !$tuan) {
                // Mảng ánh xạ tên quý
                $tenQuy = [
                    1 => 'Quý 1',
                    2 => 'Quý 2',
                    3 => 'Quý 3',
                    4 => 'Quý 4',
                ];

                for ($i = 1; $i <= 4; $i++) {
                    // Clone lại query gốc để đảm bảo không bị thay đổi trong mỗi lần lặp
                    $queryClone = clone $query;

                    // Tính doanh thu cho quý
                    $doanhThuTheoQuy = (float) $queryClone->whereRaw('QUARTER(created_at) = ?', [$i])
                        ->sum('tong_tien_don_hang');

                    // Thêm tên quý vào dữ liệu
                    $doanhThu['theo_nam']['quy'][] = $tenQuy[$i]; // Lấy tên quý từ mảng
                    $doanhThu['theo_nam']['doanh_thu'][] = $doanhThuTheoQuy;
                }

                return response()->json(['tong_doanh_thu_nam' => $tongDoanhThuNam] + $doanhThu);
            }
        }


        // Nếu có chọn quý
        if ($quy && $nam) {
            // Lọc dữ liệu theo quý
            $query->whereRaw('QUARTER(created_at) = ?', [$quy])
                ->whereYear('created_at', $nam);
            $tongDoanhThuQuy = (float) $query->sum('tong_tien_don_hang');

            // Nếu không có tháng và tuần, trả về doanh thu theo tháng trong quý
            if (!$thang && !$tuan) {
                // Xác định tháng bắt đầu của quý
                $startMonth = ($quy - 1) * 3 + 1;
                $endMonth = $startMonth + 2;

                // Lấy doanh thu theo từng tháng trong quý
                $monthsData = $query->clone()
                    ->selectRaw('MONTH(created_at) as thang, SUM(tong_tien_don_hang) as doanh_thu_thang')
                    ->whereBetween(DB::raw('MONTH(created_at)'), [$startMonth, $endMonth])
                    ->groupBy('thang')
                    ->get();

                // Khởi tạo mảng để chứa doanh thu theo tháng
                $doanhThu['theo_quy']['thang'] = [];
                $doanhThu['theo_quy']['doanh_thu'] = [];
                // $doanhThu['theo_quy']['ten_thang'] = []; // Mảng để chứa tên tháng

                // Mảng ánh xạ giữa số tháng và tên tháng
                $tenThang = [
                    1 => 'Tháng 1',
                    2 => 'Tháng 2',
                    3 => 'Tháng 3',
                    4 => 'Tháng 4',
                    5 => 'Tháng 5',
                    6 => 'Tháng 6',
                    7 => 'Tháng 7',
                    8 => 'Tháng 8',
                    9 => 'Tháng 9',
                    10 => 'Tháng 10',
                    11 => 'Tháng 11',
                    12 => 'Tháng 12'
                ];

                // Duyệt qua từng tháng trong quý
                for ($i = $startMonth; $i <= $endMonth; $i++) {
                    // Lấy doanh thu cho từng tháng từ dữ liệu đã nhóm, ép kiểu về float
                    $doanhThuTheoThang = (float) ($monthsData->where('thang', $i)->first()->doanh_thu_thang ?? 0);
                    // $doanhThu['theo_quy']['thang'][] = $i;
                    $doanhThu['theo_quy']['doanh_thu'][] = $doanhThuTheoThang;
                    $doanhThu['theo_quy']['thang'][] = $tenThang[$i]; // Thêm tên tháng vào mảng
                }

                // Trả về tổng doanh thu của quý và doanh thu theo từng tháng
                return response()->json(['tong_doanh_thu_quy' => $tongDoanhThuQuy] + $doanhThu);
            }
        }

        if ($thang && $nam && $quy) {
            // Lọc doanh thu theo tháng
            $query->whereMonth('created_at', $thang)
                ->whereYear('created_at', $nam);
            $tongDoanhThuThang = (float) $query->sum('tong_tien_don_hang');

            // Nếu không có tuần được chỉ định, trả về doanh thu theo tháng chia theo tuần
            if (!$tuan) {
                $startOfMonth = now()->setDate($nam, $thang, 1)->startOfMonth();
                $endOfMonth = now()->setDate($nam, $thang, 1)->endOfMonth();

                // Khởi tạo mảng doanh thu theo tuần
                $doanhThu['theo_thang']['tuan'] = [];
                $doanhThu['theo_thang']['doanh_thu'] = [];

                // Lấy doanh thu chia theo tuần
                $weeksData = $query->clone()
                    ->selectRaw('WEEK(created_at, 1) as week, SUM(tong_tien_don_hang) as doanh_thu_tuan')
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->groupBy('week')
                    ->get();

                $currentWeek = $startOfMonth->weekOfYear;
                $endWeek = $endOfMonth->weekOfYear;

                // Khởi tạo mảng để chứa các tuần có doanh thu
                $weekMap = $weeksData->pluck('doanh_thu_tuan', 'week');

                // Duyệt qua từng tuần và gán doanh thu, ép kiểu về float
                for ($i = $currentWeek; $i <= $endWeek; $i++) {
                    // $doanhThu['theo_thang']['tuan'][] = $i - $currentWeek + 1; // Số tuần
                    $doanhThu['theo_thang']['doanh_thu'][] = (float) $weekMap->get($i, 0); // Doanh thu
                    $doanhThu['theo_thang']['tuan'][] = 'Tuần ' . ($i - $currentWeek + 1); // Thêm tên tuần
                }

                // Kiểm tra nếu tổng doanh thu của các tuần không khớp với tổng doanh thu tháng
                $tongDoanhThuTuan = array_sum($doanhThu['theo_thang']['doanh_thu']);
                if ($tongDoanhThuTuan != $tongDoanhThuThang) {
                    // $doanhThu['theo_thang']['tuan'][] = 'Tổng kiểm tra';
                    $doanhThu['theo_thang']['doanh_thu'][] = (float) ($tongDoanhThuThang - $tongDoanhThuTuan); // Ép kiểu về float
                    $doanhThu['theo_thang']['tuan'][] = 'Tổng kiểm tra'; // Thêm tên cho tổng kiểm tra
                }

                // Trả về tổng doanh thu của tháng và doanh thu theo từng tuần
                return response()->json(['tong_doanh_thu_thang' => $tongDoanhThuThang] + $doanhThu);
            }
        }


        // Nếu có chọn tuần, tháng, quý và năm
        if ($tuan && $thang && $quy && $nam) {
            // Xác định ngày bắt đầu và kết thúc của tuần
            $startOfWeek = now()->setISODate($nam, $tuan)->startOfWeek();
            $endOfWeek = now()->setISODate($nam, $tuan)->endOfWeek();

            // Xác định ngày bắt đầu và kết thúc của tháng
            $startOfMonth = now()->setDate($nam, $thang, 1)->startOfMonth();
            $endOfMonth = now()->setDate($nam, $thang, 1)->endOfMonth();

            // Điều chỉnh ngày bắt đầu và kết thúc tuần nếu nằm ngoài tháng
            $startOfWeek = $startOfWeek < $startOfMonth ? $startOfMonth : $startOfWeek;
            $endOfWeek = $endOfWeek > $endOfMonth ? $endOfMonth : $endOfWeek;
            $doanhThu['theo_tuan'] = [
                'ngay' => [],
                'doanh_thu' => []
            ];

            // Duyệt qua từng ngày trong tuần
            for ($i = 0; $i < 7; $i++) {
                $ngayTrongTuan = now()->setDate($nam, $thang, 1)->addWeeks($tuan - 1)->startOfWeek()->addDays($i)->toDateString();

                // Tính doanh thu cho từng ngày
                $doanhThuTheoNgay = (float) $query->clone()->whereDate('created_at', $ngayTrongTuan)->sum('tong_tien_don_hang');

                // Cập nhật danh sách ngày và doanh thu
                $doanhThu['theo_tuan']['ngay'][] = $ngayTrongTuan;
                $doanhThu['theo_tuan']['doanh_thu'][] = $doanhThuTheoNgay;
                $tongDoanhThuTuan = array_sum($doanhThu['theo_tuan']['doanh_thu']);
            }

            // Trả về kết quả
            return response()->json(['tong_doanh_thu_tuan' => $tongDoanhThuTuan] + $doanhThu);
        }


        return response()->json($doanhThu);
    }

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

            // Lấy tuần, tháng và năm từ request
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

            // Xác định thời gian bắt đầu và kết thúc của tuần
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

            // Tạo hai mảng 'ngay' và 'doanh_thu_ngay'
            $ngay = [];
            $doanh_thu_ngay = [];

            foreach ($doanhThuTheoNgayTrongTuan as $item) {
                $ngay[] = $item->ngay; // Lấy giá trị ngày
                $doanh_thu_ngay[] = (float) $item->doanh_thu_ngay; // Ép kiểu doanh thu theo ngày thành số thực
            }

            DB::commit();

            return response()->json([
                'doanh_thu_tuan' => (float) $doanhThuTheoTuan, // Ép kiểu doanh thu tuần thành số thực
                'ngay' => $ngay, // Trả về mảng 'ngay'
                'doanh_thu_ngay' => $doanh_thu_ngay // Trả về mảng 'doanh_thu_ngay'
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

            // Tạo hai mảng tuan và doanh_thu_tuan từ kết quả
            $tuan = [];
            $doanh_thu_tuan = [];

            foreach ($doanhThuTheoTuanTrongThang as $item) {
                $tuan[] = (int) $item->tuan; // Đảm bảo giá trị tuần là số nguyên
                $doanh_thu_tuan[] = (float) $item->doanh_thu_tuan; // Ép kiểu doanh thu thành số thực (float)
                // array_push($tuan, $item->tuan);
                // array_push($doanh_thu_tuan, $item->doanh_thu_tuan);
            }

            DB::commit();

            // Trả về phản hồi dưới dạng JSON với hai mảng tuan và doanh_thu_tuan
            return response()->json([
                'doanh_thu_thang' => (float) $doanhThuThang, // Ép kiểu doanh thu của tháng thành số thực
                'tuan' => $tuan,
                'doanh_thu_tuan' => $doanh_thu_tuan
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

            // Tạo hai mảng 'thang' và 'doanh_thu_thang'
            $thang = [];
            $doanh_thu_thang = [];

            foreach ($doanhThuTheoThangTrongQuy as $item) {
                $thang[] = $item->thang; // Lấy giá trị tháng
                $doanh_thu_thang[] = (float) $item->doanh_thu_thang; // Ép kiểu doanh thu theo tháng thành số thực
            }

            DB::commit();

            return response()->json([
                'doanh_thu_quy' => (float) $doanhThuTheoQuy, // Ép kiểu doanh thu quý thành số thực
                'thang' => $thang, // Trả về mảng 'thang'
                'doanh_thu_thang' => $doanh_thu_thang // Trả về mảng 'doanh_thu_thang'
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

            // Tạo hai mảng 'quy' và 'doanh_thu_quy'
            $quy = [];
            $doanh_thu_quy = [];

            foreach ($doanhThuTheoQuyTrongNam as $item) {
                $quy[] = $item->quy; // Lấy giá trị quý
                $doanh_thu_quy[] = (float) $item->doanh_thu_quy; // Ép kiểu doanh thu theo quý thành số thực
            }

            DB::commit();

            return response()->json([
                'doanh_thu_nam' => (float) $doanhThuTheoNam, // Ép kiểu doanh thu năm thành số thực
                'quy' => $quy, // Trả về mảng 'quy'
                'doanh_thu_quy' => $doanh_thu_quy // Trả về mảng 'doanh_thu_quy'
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
                'doanh_thu_theo_nam' => (float) $doanhThuTheoNam,
                'doanh_thu_thang_hien_tai' => (float) $doanhThuTheoThang->doanh_thu_thang ?? 0
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

            // Lấy tên danh mục từ request
            $tenDanhMuc = $request->input('ten_danh_muc');
            $now = Carbon::now(); // Lấy thời gian hiện tại

            // Truy vấn để lấy doanh thu tổng theo danh mục (bất kể thời gian)
            $doanhThuTong = DanhMuc::join('san_phams', 'danh_mucs.id', '=', 'san_phams.danh_muc_id')
            ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
            ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
            ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
            ->where('danh_mucs.ten_danh_muc', $tenDanhMuc)
            ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->groupBy('don_hangs.id') // Group by để không bị tính trùng đơn hàng
            ->select(DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu'))
            ->first();
            // Doanh thu theo năm hiện tại
            $doanhThuNamHienTai = DanhMuc::join('san_phams', 'danh_mucs.id', '=', 'san_phams.danh_muc_id')
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->where('danh_mucs.ten_danh_muc', $tenDanhMuc)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_DGTC) // Đơn hàng đã giao thành công
                ->whereYear('don_hangs.created_at', $now->year) // Doanh thu theo năm hiện tại
                ->select(DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu'))
                ->first();

            // Doanh thu theo tháng hiện tại
            $doanhThuThangHienTai = DanhMuc::join('san_phams', 'danh_mucs.id', '=', 'san_phams.danh_muc_id')
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->where('danh_mucs.ten_danh_muc', $tenDanhMuc)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_DGTC) // Đơn hàng đã giao thành công
                ->whereMonth('don_hangs.created_at', $now->month) // Doanh thu theo tháng hiện tại
                ->whereYear('don_hangs.created_at', $now->year) // Doanh thu theo năm hiện tại
                ->select(DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu'))
                ->first();

            // Lấy thông tin các sản phẩm thuộc danh mục cùng doanh thu của từng sản phẩm
            $sanPhamDoanhThu = SanPham::join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->join('danh_mucs', 'san_phams.danh_muc_id', '=', 'danh_mucs.id')
                ->where('danh_mucs.ten_danh_muc', $tenDanhMuc)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_DGTC) // Đơn hàng đã giao thành công
                ->select(
                    'san_phams.ten_san_pham',
                    DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu_san_pham')
                )
                ->groupBy('san_phams.id', 'san_phams.ten_san_pham')
                ->get();

            DB::commit();

            return response()->json([
                'doanh_thu_tong' => $doanhThuTong->tong_doanh_thu ?? 0,
                'doanh_thu_nam_hien_tai' => $doanhThuNamHienTai->tong_doanh_thu ?? 0,
                'doanh_thu_thang_hien_tai' => $doanhThuThangHienTai->tong_doanh_thu ?? 0,
                'san_pham_doanh_thu' => $sanPhamDoanhThu,
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function thongKeDoanhThuTheoDanhMuc(Request $request)
    {
        // Lấy tham số danh_muc_con_id và danh_muc_cha_id từ request
        $danhMucConId = $request->input('danh_muc_con_id');
        $danhMucChaId = $request->input('danh_muc_cha_id');

        // 1. Kiểm tra danh_muc_con_id có thuộc về danh_muc_cha_id hay không
        if ($danhMucConId) {
            // Tìm danh mục con theo ID
            $danhMucCon = DanhMuc::where('id', $danhMucConId)
                ->where('cha_id', $danhMucChaId)
                ->first();

            // Nếu không tìm thấy danh mục con phù hợp, trả về lỗi
            if (!$danhMucCon) {
                return response()->json([
                    'error' => 'Danh mục con không thuộc danh mục cha hoặc không tồn tại.'
                ], 400);
            }
        }

        // 2. Lấy tất cả danh mục con thuộc danh mục cha
        $danhMucCons = DanhMuc::where('cha_id', $danhMucChaId)->with('sanPhams.bienTheSanPham')->get();

        // Mảng chứa dữ liệu danh mục con và doanh thu
        $data = [];

        foreach ($danhMucCons as $danhMucCon) {
            // 3. Khởi tạo tổng doanh thu cho danh mục con
            $tongDoanhThuDanhMucCon = 0;

            // Mảng chứa dữ liệu từng sản phẩm trong danh mục con
            $sanPhamData = [];

            // 4. Lấy tất cả sản phẩm và biến thể của danh mục con
            foreach ($danhMucCon->sanPhams as $sanPham) {
                $tongDoanhThuSanPham = 0;

                foreach ($sanPham->bienTheSanPham as $bienTheSanPham) {
                    // 5. Lấy chi tiết đơn hàng của từng biến thể sản phẩm
                    $doanhThuBienThe = DonHangChiTiet::where('bien_the_san_pham_id', $bienTheSanPham->id)
                        ->whereHas('donHang', function($query) {
                            // Lọc những đơn hàng đã giao hàng thành công
                            $query->where('trang_thai_don_hang', DonHang::TTDH_DGTC);
                        })
                        ->sum('thanh_tien'); // Tổng doanh thu của biến thể sản phẩm

                    // Cộng doanh thu của biến thể vào doanh thu tổng của sản phẩm
                    $tongDoanhThuSanPham += $doanhThuBienThe;
                }

                // Cộng doanh thu của sản phẩm vào doanh thu tổng của danh mục con
                $tongDoanhThuDanhMucCon += $tongDoanhThuSanPham;

                // Chỉ thêm thông tin sản phẩm nếu có danh_muc_con_id
                if ($danhMucConId) {
                    // Lưu thông tin từng sản phẩm
                    $sanPhamData[] = [
                        'ten_san_pham' => $sanPham->ten_san_pham,
                        'doanh_thu' => $tongDoanhThuSanPham,
                    ];
                }
            }

            // 6. Tính phần trăm doanh thu của từng sản phẩm trong tổng doanh thu của danh mục con
            if ($danhMucConId) {
                foreach ($sanPhamData as &$sp) {
                    if ($tongDoanhThuDanhMucCon > 0) {
                        $sp['phan_tram'] = round(($sp['doanh_thu'] / $tongDoanhThuDanhMucCon) * 100, 2);
                    } else {
                        $sp['phan_tram'] = 0;
                    }
                }
            }

            // 7. Lưu thông tin của danh mục con và sản phẩm thuộc danh mục đó nếu có danh_muc_con_id
            $data[] = [
                'ten_danh_muc_con' => $danhMucCon->ten_danh_muc,
                'tong_doanh_thu_danh_muc_con' => $tongDoanhThuDanhMucCon,
                // Chỉ thêm danh sách sản phẩm nếu có danh_muc_con_id
                'san_phams' => $danhMucConId ? $sanPhamData : []
            ];
        }

        // Trả về kết quả
        return response()->json($data);
    }





    public function soSanhDoanhThuThang(Request $request)
    {
        try {
            DB::beginTransaction();

            $now = Carbon::now();

            // Lấy doanh thu của tháng hiện tại
            $doanhThuThangHienTai = (float) DB::table('don_hangs')
                ->where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year)
                ->sum('tong_tien_don_hang');

            // Lấy doanh thu của tháng trước
            $thangTruoc = $now->subMonth();  // Lùi về tháng trước
            $doanhThuThangTruoc = DB::table('don_hangs')
                ->where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereMonth('created_at', $thangTruoc->month)
                ->whereYear('created_at', $thangTruoc->year)
                ->sum('tong_tien_don_hang');

            // Tính sự chênh lệch về doanh thu (số tiền và phần trăm)
            $chenhLechSoTien = $doanhThuThangHienTai - $doanhThuThangTruoc;
            $chenhLechPhanTram = ($doanhThuThangTruoc > 0)
                ? ($chenhLechSoTien / $doanhThuThangTruoc) * 100
                : 100;  // Nếu doanh thu tháng trước bằng 0, thì mặc định tăng 100%

            // Commit transaction khi không có lỗi
            DB::commit();

            // Trả về kết quả bao gồm doanh thu tháng này, tháng trước, chênh lệch số tiền và phần trăm
            return response()->json([
                'doanh_thu_thang_hien_tai' => $doanhThuThangHienTai,
                'doanh_thu_thang_truoc' => $doanhThuThangTruoc,
                'chenh_lech_so_tien' => $chenhLechSoTien,
                'chenh_lech_phan_tram' => $chenhLechPhanTram
            ]);

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
