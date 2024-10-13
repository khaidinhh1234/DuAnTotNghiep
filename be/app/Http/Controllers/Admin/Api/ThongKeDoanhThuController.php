<?php

namespace App\Http\Controllers\Admin\Api;

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
            $tongDoanhThuTuan = (float) DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
                ->sum('tong_tien_don_hang');
            // Thống kê doanh thu 7 ngày trong tuần
            for ($i = 1; $i <= 7; $i++) {
                $ngayTrongTuan = now()->setISODate($nam, $tuan, $i)->toDateString();
                $doanhThuTheoNgay = (float) DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                    ->whereDate('created_at', $ngayTrongTuan)
                    ->sum('tong_tien_don_hang');
                $doanhThu['theo_tuan']['ngay'][] = $ngayTrongTuan;
                $doanhThu['theo_tuan']['doanh_thu'][] = $doanhThuTheoNgay;
            }
            return response()->json(['tong_doanh_thu_tuan' => $tongDoanhThuTuan] + $doanhThu);
        }
        // Query chung cho doanh thu
        $query = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH);
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
            $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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
            $doanhThuTheoTuan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
                ->sum('tong_tien_don_hang');
            // Doanh thu theo từng ngày trong tuần
            $doanhThuTheoNgayTrongTuan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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
            $doanhThuThang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->sum('tong_tien_don_hang');
            // Doanh thu theo từng tuần trong tháng
            $doanhThuTheoTuanTrongThang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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
            $doanhThuTheoQuy = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereBetween('created_at', [$startOfQuarter, $endOfQuarter])
                ->sum('tong_tien_don_hang');
            // Doanh thu theo từng tháng trong quý
            $doanhThuTheoThangTrongQuy = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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
            $doanhThuTheoNam = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereBetween('created_at', [$startOfYear, $endOfYear])
                ->sum('tong_tien_don_hang');
            // Doanh thu theo từng quý trong năm
            $doanhThuTheoQuyTrongNam = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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
    public function soSanhDoanhThuThang(Request $request)
    {
        try {
            DB::beginTransaction();
            $now = Carbon::now();
            // Lấy doanh thu của tháng hiện tại
            $doanhThuThangHienTai = (float) DB::table('don_hangs')
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year)
                ->sum('tong_tien_don_hang');
            // Lấy doanh thu của tháng trước
            $thangTruoc = $now->subMonth();  // Lùi về tháng trước
            $doanhThuThangTruoc = DB::table('don_hangs')
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
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
}
