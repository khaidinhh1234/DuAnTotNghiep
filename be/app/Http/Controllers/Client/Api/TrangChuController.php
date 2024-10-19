<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\BoSuuTap;
use App\Models\ChuongTrinhUuDai;
use App\Models\DanhGia;
use App\Models\DonHang;
use App\Models\SanPham;
use App\Models\ThongTinWeb;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrangChuController extends Controller
{

    public function index()
    {
        $dataBanner = ThongTinWeb::query()->select('banner')->first();

        if ($dataBanner && isset($dataBanner)) {
            $bannersArray = is_string($dataBanner) ? json_decode($dataBanner, true) : $dataBanner;

            if (is_array($bannersArray)) {
                usort($bannersArray, function ($a, $b) {
                    return $a['vi_tri'] <=> $b['vi_tri'];
                });
            } else {
                $bannersArray = [];
            }
        } else {
            $bannersArray = [];
        }

        $result = ['banner' => ['banner' => $bannersArray]];

        $dataChuongTrinhUuDai = ChuongTrinhUuDai::query()->orderByDesc('id')->get();

        $dataDanhSachSanPhamMoi = SanPham::query()
            ->select(
                'san_phams.id',
                'san_phams.ten_san_pham',
                'san_phams.duong_dan',
                'san_phams.anh_san_pham',
                DB::raw('MIN(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_thap_nhat'), // Giá thấp nhất
                DB::raw('MAX(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_cao_nhat')  // Giá cao nhất
            )
            ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
            ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
            ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
            ->where('san_phams.trang_thai', 1)
            ->where('san_phams.hang_moi', 1)
            ->groupBy('san_phams.id', 'san_phams.ten_san_pham', 'san_phams.duong_dan', 'san_phams.anh_san_pham')
            ->orderByDesc('san_phams.id')
            ->take(8)
            ->get()
            ->map(function ($sanPham) {
                $bienThe = BienTheSanPham::query()
                    ->select(
                        'bien_the_san_phams.id',
                        'bien_the_san_phams.san_pham_id',
                        'bien_the_san_phams.so_luong_bien_the',
                        'bien_the_mau_sacs.ten_mau_sac',
                        'bien_the_mau_sacs.ma_mau_sac',
                        'bien_the_kich_thuocs.kich_thuoc',
                        'anh_bien_thes.duong_dan_anh',
                        DB::raw('
                    CASE
                        WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                        WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_ban
                        ELSE NULL
                    END as gia_chua_giam'),
                        DB::raw('COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban) as gia_hien_tai') // Giá hiện tại
                    )
                    ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                    ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                    ->leftJoin('anh_bien_thes', 'bien_the_san_phams.id', '=', 'anh_bien_thes.bien_the_san_pham_id') // Join với bảng ảnh biến thể
                    ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                    ->get();

                $sanPham->bien_the = $bienThe;
                $sanPham->trong_chuong_trinh_uu_dai = $sanPham->chuongTrinhUuDais->isNotEmpty()
                    ? 'Sản phẩm đang trong chương trình ưu đãi'
                    : null;

                return $sanPham;
            });

        $boSuuTapUaChuongs = BoSuuTap::query()
            ->select(
                'bo_suu_taps.id',
                'bo_suu_taps.ten',
                'bo_suu_taps.duong_dan',
                'bo_suu_taps.duong_dan_anh',
                DB::raw('SUM(don_hang_chi_tiets.so_luong) as tong_so_luot_mua')
            )
            ->leftJoin('bo_suu_tap_san_pham', 'bo_suu_taps.id', '=', 'bo_suu_tap_san_pham.bo_suu_tap_id')
            ->leftJoin('bien_the_san_phams', 'bo_suu_tap_san_pham.san_pham_id', '=', 'bien_the_san_phams.san_pham_id')
            ->leftJoin('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
            ->leftJoin('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
            ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->groupBy('bo_suu_taps.id', 'bo_suu_taps.ten', 'bo_suu_taps.duong_dan', 'bo_suu_taps.duong_dan_anh')
            ->orderByDesc('tong_so_luot_mua')
            ->take(5)
            ->with(['sanPhams' => function ($query) {
                $query->select(
                    'san_phams.id',
                    'san_phams.ten_san_pham',
                    'san_phams.duong_dan',
                    'san_phams.anh_san_pham'
                )
                    ->where('san_phams.trang_thai', 1)
                    ->with(['bienTheSanPham' => function ($query) {
                        $query->select(
                            'bien_the_san_phams.id',
                            'bien_the_san_phams.san_pham_id',
                            'bien_the_san_phams.so_luong_bien_the',
                            'bien_the_mau_sacs.ten_mau_sac',
                            'bien_the_mau_sacs.ma_mau_sac',
                            'bien_the_kich_thuocs.kich_thuoc',
                            DB::raw('
                    CASE
                         WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                        WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_ban
                        ELSE NULL
                    END as gia_chua_giam'
                            ),
                            DB::raw('COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban) as gia_hien_tai') // Giá hiện tại
                        )
                            ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                            ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id');
                    }]);
            }])
            ->get();

        foreach ($boSuuTapUaChuongs as $boSuuTap) {
            foreach ($boSuuTap->sanPhams as $sanPham) {
                $sanPham->trong_chuong_trinh_uu_dai = $sanPham->chuongTrinhUuDais->isNotEmpty()
                    ? 'Sản phẩm đang trong chương trình ưu đãi'
                    : null;

                $lowestPrice = null;
                $highestPrice = null;

                foreach ($sanPham->bienTheSanPham as $bienThe) {
                    $currentPrice = $bienThe->gia_hien_tai;

                    if ($lowestPrice === null || $currentPrice < $lowestPrice) {
                        $lowestPrice = $currentPrice;
                    }
                    if ($highestPrice === null || $currentPrice > $highestPrice) {
                        $highestPrice = $currentPrice;
                    }
                }

                $sanPham->gia_thap_nhat = $lowestPrice;
                $sanPham->gia_cao_nhat = $highestPrice;
            }
        }

        $dataDanhGiaKhachHang = DanhGia::query()
            ->with(['user', 'sanPham'])
            ->whereIn('so_sao_san_pham', [5])
            ->orderByDesc('id')
            ->get()
            ->unique('user.id')
            ->unique('sanPham.id')
            ->take(8);

        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Lấy dữ liệu thành công',
            'banner' => $dataBanner,
            'danh_sach_san_pham_moi' => $dataDanhSachSanPhamMoi,
            'bo_suu_tap_ua_chuongs' => $boSuuTapUaChuongs,
            'chuong_trinh_uu_dai' => $dataChuongTrinhUuDai,
            'danh_gia_khach_hang' => $dataDanhGiaKhachHang,
        ], 200);
    }

    public function thongTinWeb()
    {
        try {
            $data = ThongTinWeb::query()
                ->first()
                ->makeHidden(['banner']);

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data,
            ], 200);
        }catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function timKiemGoiY(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:1',
        ]);

        $query = trim($request->input('query'));

        $goiY = SanPham::where('ten_san_pham', 'like', '%' . $query . '%')
            ->limit(10)
            ->get();

        return response()->json($goiY);
    }
}
