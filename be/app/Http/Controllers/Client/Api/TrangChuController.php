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

        $dataChuongTrinhUuDai = ChuongTrinhUuDai::query()->first();

        $dataDanhSachSanPhamMoi = SanPham::query()
            ->select('san_phams.*')
            ->with([
                'bienTheSanPham' => function($query) {
                    $query->select(
                        'bien_the_san_phams.id',
                        'bien_the_san_phams.san_pham_id',
                        'bien_the_san_phams.gia_ban',
                        'bien_the_san_phams.gia_khuyen_mai',
                        'bien_the_san_phams.gia_khuyen_mai_tam_thoi',
                        'bien_the_san_phams.so_luong_bien_the',
                        'bien_the_san_phams.bien_the_mau_sac_id',
                        'bien_the_san_phams.bien_the_kich_thuoc_id',
                        DB::raw('COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban) as gia_hien_tai') // Giá hiện tại
                    )
                        ->with('mauBienThe:id,ten_mau_sac,ma_mau_sac')
                        ->with('kichThuocBienThe:id,kich_thuoc');
                }
            ])
            ->where('san_phams.trang_thai', 1)
            ->where('san_phams.hang_moi', 1)
            ->orderByDesc('san_phams.id')
            ->take(8)
            ->get()
            ->map(function ($sanPham) {
                $sanPham->trong_uu_dai = $sanPham->chuongTrinhUuDais->isNotEmpty()
                    ? 'Sản phẩm đang trong chương trình ưu đãi'
                    : null;

                return $sanPham;
            });


        $boSuuTapUaChuongs = BoSuuTap::query()
            ->select(
                'bo_suu_taps.id',
                'bo_suu_taps.ten',
                'bo_suu_taps.duong_dan_anh',
                DB::raw('SUM(don_hang_chi_tiets.so_luong) as tong_so_luot_mua')
            )
            ->join('bo_suu_tap_san_pham', 'bo_suu_taps.id', '=', 'bo_suu_tap_san_pham.bo_suu_tap_id')
            ->join('bien_the_san_phams', 'bo_suu_tap_san_pham.san_pham_id', '=', 'bien_the_san_phams.san_pham_id')
            ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
            ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
            ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->groupBy('bo_suu_taps.id', 'bo_suu_taps.ten', 'bo_suu_taps.duong_dan_anh')
            ->orderByDesc('tong_so_luot_mua')
            ->take(5)
            ->with([
                'sanPhams' => function ($query) {
                    $query->select('san_phams.id', 'san_phams.ten_san_pham', 'san_phams.duong_dan', 'san_phams.anh_san_pham')
                        ->with([
                            'bienTheSanPham' => function ($query) {
                                $query->select(
                                    'bien_the_san_phams.id',
                                    'bien_the_san_phams.san_pham_id',
                                    'bien_the_san_phams.gia_ban',
                                    'bien_the_san_phams.gia_khuyen_mai',
                                    'bien_the_san_phams.gia_khuyen_mai_tam_thoi',
                                    'bien_the_san_phams.so_luong_bien_the',
                                    'bien_the_san_phams.bien_the_mau_sac_id',
                                    'bien_the_san_phams.bien_the_kich_thuoc_id',
                                    DB::raw('COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban) as gia_hien_tai') // Giá hiện tại
                                )
                                    ->with(['mauBienThe:id,ten_mau_sac,ma_mau_sac', 'kichThuocBienThe:id,kich_thuoc'])
                                    ->with(['anhBienThe' => function ($query) {
                                        $query->select('bien_the_san_pham_id', 'duong_dan_anh')
                                        ->limit(1);
                                    }])
                                    ->with(['anhBienThe' => function ($query) {
                                        $query->select('bien_the_san_pham_id', 'duong_dan_anh')
                                            ->limit(1);
                                    }]);
                            }
                        ]);
                }
            ])
            ->get();



        $dataDanhGiaKhachHang = DanhGia::query()->whereIn('so_sao_san_pham', [4, 5])->orderByDesc('id')->take(8)->get();

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
