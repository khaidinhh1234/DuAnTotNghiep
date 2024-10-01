<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\ChuongTrinhUuDai;
use App\Models\DanhGia;
use App\Models\SanPham;
use App\Models\ThongTinWeb;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TrangChuController extends Controller
{

    public function index()
    {
        $dataBanner = ThongTinWeb::query()->select('banner')->first();

        $dataChuongTrinhUuDai = ChuongTrinhUuDai::query()->first();

        $dataDanhSachSanPhamMoi = SanPham::query()->with([
            'danhMuc',
            'bienTheSanPham.anhBienThe',
            'bienTheSanPham.mauBienThe',
            'bienTheSanPham.kichThuocBienThe',
            'chuongTrinhKhuyenMais'
        ])->orderByDesc('id')->take(8)->get();

        $dataDanhGiaKhachHang = DanhGia::query()->whereIn('so_sao_san_pham', [4, 5])->orderByDesc('id')->take(8)->get();

        $now = Carbon::now();

        $sanPhamDangKhuyenMai = SanPham::with('bienTheSanPham')
        ->whereNotNull('gia_khuyen_mai')
            ->where('ngay_bat_dau_khuyen_mai', '<=', $now)
            ->where('ngay_ket_thuc_khuyen_mai', '>=', $now)
            ->where('gia_tri_uu_dai', '>', 0)
            ->get();

        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Lấy dữ liệu thành công',
            'banner' => $dataBanner,
            'chuong_trinh_uu_dai' => $dataChuongTrinhUuDai,
            'danh_sach_san_pham_moi' => $dataDanhSachSanPhamMoi,
            'danh_gia_khach_hang' => $dataDanhGiaKhachHang,
            'san_pham_dang_khuyen_mai' => $sanPhamDangKhuyenMai
        ], 200);
    }
}
