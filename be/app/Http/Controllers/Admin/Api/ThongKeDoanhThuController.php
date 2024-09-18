<?php

namespace App\Http\Controllers\Admin\API;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ThongKeDoanhThuController extends Controller
{
    public function doanhThuTheoNgay(Request $request)
    {
        $today = Carbon::today();

        $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereDate('created_at', $today)
            ->sum('tong_tien_don_hang');

        return response()->json(['doanh_thu' => $doanhThu], 200);
    }

    public function doanhThuTheoTuan(Request $request)
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->sum('tong_tien_don_hang');

        return response()->json(['doanh_thu' => $doanhThu], 200);
    }

    public function doanhThuTheoThang(Request $request)
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('tong_tien_don_hang');

        return response()->json(['doanh_thu' => $doanhThu], 200);
    }

    public function doanhThuTheoQuy(Request $request)
    {
        $currentQuarter = ceil(Carbon::now()->month / 3);
        $startOfQuarter = Carbon::now()->firstOfQuarter();
        $endOfQuarter = Carbon::now()->lastOfQuarter();

        $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$startOfQuarter, $endOfQuarter])
            ->sum('tong_tien_don_hang');

        return response()->json(['doanh_thu' => $doanhThu], 200);
    }

    public function doanhThuTheoNam(Request $request)
    {
        $startOfYear = Carbon::now()->startOfYear();
        $endOfYear = Carbon::now()->endOfYear();

        $doanhThu = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DGTC)
            ->whereBetween('created_at', [$startOfYear, $endOfYear])
            ->sum('tong_tien_don_hang');

        return response()->json(['doanh_thu' => $doanhThu], 200);
    }
}
