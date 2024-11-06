<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\BoSuuTap;
use App\Models\ChuongTrinhUuDai;
use App\Models\DanhGia;
use App\Models\DanhMuc;
use App\Models\DanhMucTinTuc;
use App\Models\DonHang;
use App\Models\SanPham;
use App\Models\ThongTinWeb;
use App\Models\TinTuc;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $dataChuongTrinhUuDai = ChuongTrinhUuDai::query()
            ->where('ngay_hien_thi', '<=', Carbon::now())
            ->where('ngay_ket_thuc', '>=', Carbon::now())
            ->orderBy('ngay_hien_thi')
            ->orderByDesc('id')
            ->get();

        $dataDanhSachSanPhamMoi = SanPham::query()
            ->select(
                'san_phams.id',
                'san_phams.ten_san_pham',
                'san_phams.duong_dan',
                'san_phams.anh_san_pham',
                'san_phams.hang_moi',
                'san_phams.gia_tot',
                DB::raw('MIN(CASE
                    WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                    WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                    ELSE bien_the_san_phams.gia_ban
                END) as gia_thap_nhat'),

                DB::raw('MAX(CASE
                    WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                    WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                    ELSE bien_the_san_phams.gia_ban
                END) as gia_cao_nhat')
            )
            ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
            ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
            ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
            ->where('san_phams.trang_thai', 1)
            ->where('san_phams.hang_moi', 1)
            ->whereNotNull('san_phams.danh_muc_id')
            ->groupBy('san_phams.id', 'san_phams.ten_san_pham', 'san_phams.duong_dan', 'san_phams.anh_san_pham')
            ->orderByDesc('san_phams.id')
            ->take(8)
            ->get()
            ->map(function ($sanPham) {
                $bienThe = BienTheSanPham::query()
                    ->with('anhBienThe')
                    ->select(
                        'bien_the_san_phams.id',
                        'bien_the_san_phams.san_pham_id',
                        'bien_the_san_phams.so_luong_bien_the',
                        'bien_the_mau_sacs.ten_mau_sac',
                        'bien_the_mau_sacs.ma_mau_sac',
                        'bien_the_kich_thuocs.kich_thuoc',
                        DB::raw('bien_the_san_phams.gia_ban as gia_chua_giam'),
                        DB::raw('CASE
                            WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                            WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                            ELSE bien_the_san_phams.gia_ban
                        END as gia_hien_tai')
                    )
                    ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                    ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                    ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                    ->get();

                $mauSacVaAnh = $bienThe->groupBy('ma_mau_sac')->map(function ($items) {
                    $bienTheDauTien = $items->first();
                    $anhBienTheDaiDien = $bienTheDauTien->anhBienThe->first() ? $bienTheDauTien->anhBienThe->first()->duong_dan_anh : null;

                    return [
                        'ma_mau_sac' => $bienTheDauTien->ma_mau_sac,
                        'ten_mau_sac' => $bienTheDauTien->ten_mau_sac,
                        'hinh_anh' => $anhBienTheDaiDien
                    ];
                })->values()->all();

                $sanPham->bien_the = $bienThe;
                $sanPham->mau_sac_va_anh = $mauSacVaAnh;

                return $sanPham;
            });

        //User
        $user = Auth::guard('api')->user();
        if ($user) {
            // Thêm thông tin yêu thích vào từng sản phẩm
            $dataDanhSachSanPhamMoi->map(function ($sanPham) use ($user) {
                $sanPham['yeu_thich'] = $sanPham->khachHangYeuThich->contains($user->id); // Sản phẩm được yêu thích
                return $sanPham;
            });
        }

        $boSuuTapUaChuongs = BoSuuTap::query()
            ->select(
                'bo_suu_taps.id',
                'bo_suu_taps.ten',
                'bo_suu_taps.duong_dan',
                'bo_suu_taps.duong_dan_anh',
//                DB::raw('SUM(don_hang_chi_tiets.so_luong) as tong_so_luot_mua')
            )
            ->leftJoin('bo_suu_tap_san_pham', 'bo_suu_taps.id', '=', 'bo_suu_tap_san_pham.bo_suu_tap_id')
            ->leftJoin('bien_the_san_phams', 'bo_suu_tap_san_pham.san_pham_id', '=', 'bien_the_san_phams.san_pham_id')
//            ->leftJoin('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
//            ->leftJoin('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
//            ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->groupBy('bo_suu_taps.id', 'bo_suu_taps.ten', 'bo_suu_taps.duong_dan', 'bo_suu_taps.duong_dan_anh')
//            ->havingRaw('SUM(don_hang_chi_tiets.so_luong) > 0') // Lọc chỉ lấy bộ sưu tập có lượt mua > 0
//            ->orderByDesc('tong_so_luot_mua')
            ->limit(5)
            ->with(['sanPhams' => function ($query) {
                $query->select(
                    'san_phams.id',
                    'san_phams.ten_san_pham',
                    'san_phams.duong_dan',
                    'san_phams.anh_san_pham',
                    'san_phams.hang_moi',
                    'san_phams.gia_tot'
                )
                    ->whereNotNull('san_phams.danh_muc_id')
                    ->where('san_phams.trang_thai', 1)
                    ->whereHas('bienTheSanPham')  // Lọc sản phẩm có biến thể
                    ->with(['bienTheSanPham' => function ($query) {
                        $query->select(
                            'bien_the_san_phams.id',
                            'bien_the_san_phams.san_pham_id',
                            'bien_the_san_phams.so_luong_bien_the',
                            'bien_the_mau_sacs.ten_mau_sac',
                            'bien_the_mau_sacs.ma_mau_sac',
                            'bien_the_kich_thuocs.kich_thuoc',
                            DB::raw('(SELECT anh_bien_thes.duong_dan_anh
                          FROM anh_bien_thes
                          WHERE anh_bien_thes.bien_the_san_pham_id = bien_the_san_phams.id
                          LIMIT 1) as duong_dan_anh'),
                            DB::raw('bien_the_san_phams.gia_ban as gia_chua_giam'),
                            DB::raw('CASE
                            WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                            WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                            ELSE bien_the_san_phams.gia_ban
                         END as gia_hien_tai')
                        )
                            ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                            ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id');
                    }]);
            }])
            ->get();

// Xử lý từng bộ sưu tập
        foreach ($boSuuTapUaChuongs as $boSuuTap) {
            foreach ($boSuuTap->sanPhams as $sanPham) {
                $sanPham->trong_chuong_trinh_uu_dai = $sanPham->chuongTrinhUuDais->isNotEmpty()
                    ? $sanPham->chuongTrinhUuDais->map(function ($uuDai) {
                        $giaTriUuDai = $uuDai->loai === 'phan_tram'
                            ? $uuDai->gia_tri_uu_dai . '%'
                            : number_format($uuDai->gia_tri_uu_dai, 0, ',', '.') . ' VND';
                        return $uuDai->ten_uu_dai . " - Giảm: " . $giaTriUuDai;
                    })->implode(', ')
                    : null;

                $lowestPrice = null;
                $highestPrice = null;

                // Nhóm các biến thể sản phẩm theo màu sắc
                $mauSacVaAnh = $sanPham->bienTheSanPham->groupBy('ma_mau_sac')->map(function ($items) {
                    $bienTheDauTien = $items->first();
                    $anhBienTheDaiDien = $bienTheDauTien->anhBienThe->first() ? $bienTheDauTien->anhBienThe->first()->duong_dan_anh : null;
                    return [
                        'ma_mau_sac' => $bienTheDauTien->ma_mau_sac,
                        'ten_mau_sac' => $bienTheDauTien->ten_mau_sac,
                        'hinh_anh' => $anhBienTheDaiDien
                    ];
                })->values()->all();

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
                $sanPham->mau_sac_va_anh = $mauSacVaAnh;
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

        $dataTinTucMoi = TinTuc::query()
            ->whereNotIn('id', function ($query) {
                $query->select('id')
                    ->from('danh_muc_tin_tucs')
                    ->whereIn('ten_danh_muc_tin_tuc', ['Dịch vụ khách hàng','Về chúng tôi']);
            })
            ->orderByDesc('id')
            ->limit(4)
            ->get();

        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Lấy dữ liệu thành công',
            'banner' => $dataBanner,
            'danh_sach_san_pham_moi' => $dataDanhSachSanPhamMoi,
            'bo_suu_tap_ua_chuongs' => $boSuuTapUaChuongs,
            'chuong_trinh_uu_dai' => $dataChuongTrinhUuDai,
            'danh_gia_khach_hang' => $dataDanhGiaKhachHang,
            'tin_tuc_moi' => $dataTinTucMoi
        ], 200);
    }

    public function thongTinWeb()
    {
        try {
            $data = ThongTinWeb::query()
                ->first()
                ->makeHidden(['banner']);
            $data['footer_blogs'] = DanhMucTinTuc::query()->whereIn('ten_danh_muc_tin_tuc',['Dịch vụ khách hàng','Về chúng tôi'])
                ->with('tinTuc')->get();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data,
            ], 200);
        } catch (\Exception $exception) {
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

        $goiY =
            SanPham::query()
                ->select(
                    'san_phams.id',
                    'san_phams.ten_san_pham',
                    'san_phams.duong_dan',
                    'san_phams.anh_san_pham',
                    'san_phams.hang_moi',
                    'san_phams.gia_tot',
                    DB::raw('MIN(CASE
                    WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                    WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                    ELSE bien_the_san_phams.gia_ban
                END) as gia_thap_nhat'),

                    DB::raw('MAX(CASE
                    WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                    WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                    ELSE bien_the_san_phams.gia_ban
                END) as gia_cao_nhat')
                )
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                ->where('san_phams.trang_thai', 1)
                ->where('san_phams.hang_moi', 1)
                ->whereNotNull('san_phams.danh_muc_id')
                ->where('ten_san_pham', 'like', '%' . $query . '%')
                ->groupBy('san_phams.id', 'san_phams.ten_san_pham', 'san_phams.duong_dan', 'san_phams.anh_san_pham')
                ->orderByDesc('san_phams.id')
                ->take(8)
                ->get()
                ->map(function ($sanPham) {
                    $bienThe = BienTheSanPham::query()
                        ->with('anhBienThe')
                        ->select(
                            'bien_the_san_phams.id',
                            'bien_the_san_phams.san_pham_id',
                            'bien_the_san_phams.so_luong_bien_the',
                            'bien_the_mau_sacs.ten_mau_sac',
                            'bien_the_mau_sacs.ma_mau_sac',
                            'bien_the_kich_thuocs.kich_thuoc',
                            DB::raw('bien_the_san_phams.gia_ban as gia_chua_giam'),
                            DB::raw('CASE
                            WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                            WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                            ELSE bien_the_san_phams.gia_ban
                        END as gia_hien_tai')
                        )
                        ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                        ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                        ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                        ->get();

                    $mauSacVaAnh = $bienThe->groupBy('ma_mau_sac')->map(function ($items) {
                        $bienTheDauTien = $items->first();
                        $anhBienTheDaiDien = $bienTheDauTien->anhBienThe->first() ? $bienTheDauTien->anhBienThe->first()->duong_dan_anh : null;

                        return [
                            'ma_mau_sac' => $bienTheDauTien->ma_mau_sac,
                            'ten_mau_sac' => $bienTheDauTien->ten_mau_sac,
                            'hinh_anh' => $anhBienTheDaiDien
                        ];
                    })->values()->all();

                    $sanPham->bien_the = $bienThe;
                    $sanPham->mau_sac_va_anh = $mauSacVaAnh;

                    return $sanPham;
                });
        return response()->json($goiY);
    }

    public function loadDanhMucConChau($chaId)
    {
        try {
            $danhMucCha = DanhMuc::where('id', $chaId)
                ->with('children.children')
                ->first();

            if (!$danhMucCha) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Danh mục cha không tồn tại',
                ], 404);
            }

            $getFullPath = function ($danhMuc) {
                $path = $danhMuc->duong_dan;
                $parent = $danhMuc->parent;
                while ($parent) {
                    $path = $parent->duong_dan . '/' . $path;
                    $parent = $parent->parent;
                }
                return $path;
            };

            $formattedData = [
                'danh_muc' => $danhMucCha->children->map(function ($child) use ($getFullPath) {
                    return [
                        'id' => $child->id,
                        'ten_danh_muc' => $child->ten_danh_muc,
                        'duong_dan' => $getFullPath($child),
                        'con' => $child->children->map(function ($grandChild) use ($getFullPath) {
                            return [
                                'id' => $grandChild->id,
                                'ten_danh_muc' => $grandChild->ten_danh_muc,
                                'duong_dan' => $getFullPath($grandChild),
                            ];
                        })->toArray(),
                    ];
                })->toArray(),
                'anh_danh_muc_cha' => $danhMucCha->duong_dan_anh,
            ];

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $formattedData,
            ], 200);

        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }



    public function loadDanhMucSanPhamCha(){
        try {
            $danhMucs = DanhMuc::whereNull('cha_id')
                ->get();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $danhMucs,
                ]
            ,200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

}
