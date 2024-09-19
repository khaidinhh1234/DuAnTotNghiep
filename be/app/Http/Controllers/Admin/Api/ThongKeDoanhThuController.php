<?php

namespace App\Http\Controllers\Admin\API;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\DanhMuc;
use App\Models\DonHang;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class ThongKeDoanhThuController extends Controller
{
    public function doanhThuTheoNgay(Request $request)
    {
        DB::beginTransaction();
        try {
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

    public function doanhThuTheoTuan()
    {
        DB::beginTransaction();
        try {
            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();

            $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
                ->sum('tong_tien_don_hang');

            DB::commit();
            return response()->json(['doanh_thu' => $doanhThu], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function doanhThuTheoThang()
    {
        DB::beginTransaction();
        try {
            $startOfMonth = Carbon::now()->startOfMonth();
            $endOfMonth = Carbon::now()->endOfMonth();

            $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->sum('tong_tien_don_hang');

            DB::commit();
            return response()->json(['doanh_thu' => $doanhThu], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function doanhThuTheoQuy()
    {

        DB::beginTransaction();
        try {
            $currentQuarter = ceil(Carbon::now()->month / 3);
            $startOfQuarter = Carbon::now()->firstOfQuarter();
            $endOfQuarter = Carbon::now()->lastOfQuarter();

            $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfQuarter, $endOfQuarter])
                ->sum('tong_tien_don_hang');

            DB::commit();
            return response()->json(['doanh_thu' => $doanhThu], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }

        // $currentQuarter = ceil(Carbon::now()->month / 3);
        $startOfQuarter = Carbon::now()->firstOfQuarter();
        $endOfQuarter = Carbon::now()->lastOfQuarter();

        $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$startOfQuarter, $endOfQuarter])
            ->sum('tong_tien_don_hang');

        return response()->json(['doanh_thu' => $doanhThu], 200);

    }

    public function doanhThuTheoNam()
    {
        DB::beginTransaction();
        try {
            $startOfYear = Carbon::now()->startOfYear();
            $endOfYear = Carbon::now()->endOfYear();

            $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
                ->whereBetween('created_at', [$startOfYear, $endOfYear])
                ->sum('tong_tien_don_hang');

            DB::commit();
            return response()->json(['doanh_thu' => $doanhThu], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }

    public function doanhThuTheoSanPham(Request $request)
    {
        DB::beginTransaction();
        try {
            // Lấy tất cả các biến thể sản phẩm và tính tổng doanh thu cho mỗi sản phẩm
            $doanhThuSanPhams = BienTheSanPham::with(  'sanPham')
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

    public function doanhThuTheoDanhMuc(Request $request)
    {
        DB::beginTransaction();
        try {
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

}
