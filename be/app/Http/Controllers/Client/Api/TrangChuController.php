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
            'chuongTrinhUuDais'
        ])
            ->orderByDesc('id')
            ->where('trang_thai', 1)
            ->take(8)
            ->get()
            ->map(function ($sanPham) {
                // Kiểm tra nếu sản phẩm có chương trình ưu đãi
                $sanPham->trong_uu_dai = $sanPham->chuongTrinhUuDais->isNotEmpty()
                    ? 'Sản phẩm đang trong chương trình ưu đãi'
                    : null;

                return $sanPham;
            });


        $dataDanhGiaKhachHang = DanhGia::query()->whereIn('so_sao_san_pham', [4, 5])->orderByDesc('id')->take(8)->get();

        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Lấy dữ liệu thành công',
            'banner' => $dataBanner,
            'chuong_trinh_uu_dai' => $dataChuongTrinhUuDai,
            'danh_sach_san_pham_moi' => $dataDanhSachSanPhamMoi,
            'danh_gia_khach_hang' => $dataDanhGiaKhachHang,
        ], 200);
    }
}
