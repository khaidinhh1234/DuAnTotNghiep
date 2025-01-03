<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use App\Models\BienTheSanPham;
use App\Models\DanhGia;
use App\Models\DanhMuc;
use App\Models\SanPham;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TrangChiTietSpController extends Controller
{
    public function danhMucCha(Request $request)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();
            // Lấy danh mục có cha_id là null
            $danhMucCha = DanhMuc::query()->whereNull('cha_id')->get();
            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'danhMucCha' => $danhMucCha,
            ], 200);
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();
            // Trả về lỗi
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dự liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function chiTietSanPham(Request $request, $duongDan)
    {
        try {
            $SanPham = SanPham::where('duong_dan', $duongDan)->first();
            $idBienThe = $SanPham->bienTheDanhGias->pluck('id')->unique()->values()->toArray();

            // Lấy chi tiết sản phẩm với các quan hệ cần thiết
            $chiTietSanPham = SanPham::with([
                'danhMuc.parent',  // Lấy danh mục cha
                'danhGias.user',
                'danhGias.danhGiaHuuIch',
                'danhGias' => function ($query) {
                    $query->withCount('danhGiaHuuIch')->orderBy('created_at', 'desc');
                },
                'danhGias.danhGiaBienTheSanPhams' => function ($query) use ($idBienThe) {
                    $query->whereIn('bien_the_san_pham_id', $idBienThe)
                        ->with(['mauBienThe', 'kichThuocBienThe']);
                },
                'danhGias.anhDanhGias',
                'bienTheSanPham.anhBienThe',
                'bienTheSanPham.mauBienThe',
                'bienTheSanPham.kichThuocBienThe',
                'boSuuTapSanPham',
                'khachHangYeuThich',
            ])->where('duong_dan', $duongDan)->first();
                if($chiTietSanPham){
                    $chiTietSanPham->danhGias = $chiTietSanPham->danhGias->unique('id');
                }
            // dd($chiTietSanPham->danhGias->pluck('id')->unique()->values()->toArray());
            // Kiểm tra xem sản phẩm có tồn tại không
            if (!$chiTietSanPham) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Không tìm thấy sản phẩm'
                ], 404);
            }
            $key = 'san_pham_da_xem_' . $chiTietSanPham->id;
            if (Auth::guard('api')->check()) {
                $key .= '_user_' . Auth::guard('api')->user()->id;
            } else {
                $key .= '_guest_' . $request->ip();
            }

            // Kiểm tra xem sản phẩm đã được xem trong 24 giờ chưa
            $lastViewed = Cache::get($key);

            if (!$lastViewed || !($lastViewed instanceof \Carbon\Carbon) || now()->diffInHours($lastViewed) > 24) {
                // Tăng lượt xem nếu chưa được xem trong 24 giờ
                $chiTietSanPham->increment('luot_xem');
                // Lưu thông tin vào Cache với thời gian hết hạn là 24 giờ
                Cache::put($key, now(), 24 * 60); // 24 giờ
            }

            // Cập nhật trạng thái đánh giá hữu ích
            foreach ($chiTietSanPham->danhGias as $danhGia) {
                $danhGia->trang_thai_danh_gia_nguoi_dung = $danhGia->danhGiaHuuIch()->exists();
            }

            // Kiểm tra trạng thái yêu thích của sản phẩm
            $chiTietSanPham['trang_thai_yeu_thich'] = false;
            if (Auth::guard('api')->check()) {
                $user = Auth::guard('api')->user();
                $chiTietSanPham['trang_thai_yeu_thich'] = $chiTietSanPham->khachHangYeuThich->contains('id', $user->id);
            }

            // Lấy thêm thông tin danh mục cha và ông của danh mục sản phẩm
            $danhMuc = $chiTietSanPham->danhMuc;

            // Lấy cha và ông của danh mục
            $chaDanhMuc = $danhMuc->parent;
            $ongDanhMuc = $chaDanhMuc ? $chaDanhMuc->parent : null;

            // Thêm vào dữ liệu trả về
            $chiTietSanPham['cha_danh_muc'] = $chaDanhMuc;
            $chiTietSanPham['ong_danh_muc'] = $ongDanhMuc;

            // Trả về chi tiết sản phẩm cùng với các thông tin danh mục cha và ông
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Chi tiết sản phẩm',
                'data' => $chiTietSanPham
            ]);
        } catch (\Exception $exception) {
            // Xử lý lỗi nếu có
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy chi tiết sản phẩm',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function danhSachSanPhamCungLoai($id)
    {
        try {
            $sanPhamHienTai = SanPham::find($id);

            if (!$sanPhamHienTai) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Không tìm thấy sản phẩm với ID này.'
                ], 404);
            }

            // Lấy danh sách sản phẩm cùng loại
            $sanPhamLienQuan = SanPham::query()
                ->select(
                    'san_phams.id',
                    'san_phams.ten_san_pham',
                    'san_phams.duong_dan',
                    'san_phams.anh_san_pham',
                    'san_phams.hang_moi',
                    'san_phams.gia_tot',
                    DB::raw('MIN(CASE
                        WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_ban
                        WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_ban
                        ELSE bien_the_san_phams.gia_ban
                    END) as gia_thap_nhat'),
                    DB::raw('MAX(CASE
                        WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_ban
                        WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_ban
                        ELSE bien_the_san_phams.gia_ban
                    END) as gia_cao_nhat')
                )
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                ->where('san_phams.danh_muc_id', $sanPhamHienTai->danh_muc_id)
                ->where('san_phams.id', '!=', $sanPhamHienTai->id)
                ->groupBy('san_phams.id', 'san_phams.ten_san_pham', 'san_phams.duong_dan', 'san_phams.anh_san_pham')
                ->take(10)
                ->get()
                ->map(function ($sanPham) {
                    // Lấy thông tin biến thể của sản phẩm
                    $bienThe = BienTheSanPham::query()
                        ->select(
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
                            DB::raw('COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban) as gia_hien_tai')
                        )
                        ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                        ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                        ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                        ->get();

                    // Tạo mảng chứa màu sắc và 1 ảnh đại diện cho từng màu
                    $mauSacVaAnh = $bienThe->groupBy('ma_mau_sac')->map(function ($items) {
                        return [
                            'ma_mau_sac' => $items->first()->ma_mau_sac,
                            'ten_mau_sac' => $items->first()->ten_mau_sac,
                            'hinh_anh' => $items->first()->duong_dan_anh
                        ];
                    })->values()->all();

                    // Gán biến thể và mảng màu + ảnh vào sản phẩm
                    $sanPham->bien_the = $bienThe;
                    $sanPham->mau_sac_va_anh = $mauSacVaAnh;

                    return $sanPham;
                });

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Sản phẩm cùng loại',
                'data' => $sanPhamLienQuan
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy danh sách sản phẩm cùng loại',
                'error' => $exception->getMessage()
            ], 500);
        }
    }


    public function likeDanhGia(DanhGia $danhGia)
    {
        try {
            $user = Auth::guard('api')->id();
            if (!isset($user)) {
                return response()->json(['message' => 'Bạn cần đăng nhập để like đánh giá.'], 401);
            }

            $likes = $danhGia->danhGiaHuuIch()->pluck('id')->toArray();
            $isLiked = in_array($user, $likes);

            if ($isLiked) {
                return response()->json([
                    'message' => 'Bạn đã like đánh giá này rồi không thể like lại.',
                    'isLiked' => false,
                    'totalLikes' => count($likes),
                ], 200);
            }
            $danhGia->danhGiaHuuIch()->attach($user);
            return response()->json([
                'message' => 'Đã like thành công',
                'isLiked' => true,
                'totalLikes' => count($likes) + 1,
            ], 201);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi like đánh giá',
                'error' => $exception->getMessage()
            ], 500);
        }
    }



    public function boLikeDanhGia(DanhGia $danhGia)
    {
        try {
            $user = Auth::guard('api')->id();
            if (!$user) {
                return response()->json(['message' => 'Bạn cần đăng nhập để bỏ like đánh giá.'], 401);
            }

            $likes = $danhGia->danhGiaHuuIch()->pluck('id')->toArray();
            $isLiked = in_array($user, $likes);

            if (!$isLiked) {
                return response()->json([
                    'message' => 'Bạn chưa like đánh giá này.',
                    'isLiked' => false,
                    'totalLikes' => count($likes),
                ], 400);
            }

            // Bỏ like
            $danhGia->danhGiaHuuIch()->detach($user);

            return response()->json([
                'message' => 'Đã bỏ like thành công',
                'isLiked' => true,
                'totalLikes' => count($likes) - 1,
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi thực hiện bỏ like đánh giá.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function goiY(Request $request)
    {
        $request->validate([
            'chieu_cao' => 'required|numeric|min:0',
            'can_nang' => 'required|numeric|min:0',
            'san_pham_id' => 'required|exists:san_phams,id'
        ]);

        $chieuCao = $request->input('chieu_cao');
        $canNang = $request->input('can_nang');
        $sanPhamId = $request->input('san_pham_id');

        $sanPham = SanPham::with('danhMuc')->find($sanPhamId);

        if (!$sanPham || !$sanPham->danhMuc) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại hoặc không có danh mục.',
            ], 404);
        }

        $danhMuc = $sanPham->danhMuc;

        while ($danhMuc && $danhMuc->cha_id !== null) {
            $danhMuc = DanhMuc::find($danhMuc->cha_id);
        }


        $tenDanhMuc = strtolower($danhMuc->ten_danh_muc);

        $gioiTinh = $danhMuc->gioi_tinh;

        $kichThuoc = BienTheKichThuoc::where('loai_kich_thuoc', $tenDanhMuc)
            ->where('chieu_cao_toi_thieu', '<=', $chieuCao)
            ->where('chieu_cao_toi_da', '>=', $chieuCao)
            ->where('can_nang_toi_thieu', '<=', $canNang)
            ->where('can_nang_toi_da', '>=', $canNang)
            ->first();

        if (!$kichThuoc) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy kích thước phù hợp.',
            ], 404);
        }

        $bienTheSanPham = BienTheSanPham::where('san_pham_id', $sanPhamId)
            ->where('bien_the_kich_thuoc_id', $kichThuoc->id)
            ->with('mauBienThe')
            ->get(['bien_the_mau_sac_id', 'so_luong_bien_the', 'gia_ban', 'gia_khuyen_mai']);

        if ($bienTheSanPham->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy biến thể sản phẩm phù hợp.',
                'debug' => [
                    'san_pham_id' => $sanPhamId,
                    'kich_thuoc_id' => $kichThuoc->id,
                ]
            ], 404);
        }

        $result = $bienTheSanPham->map(function ($variant) {
            return [
                'bien_the_mau_sac' => $variant->mauBienThe,
                'so_luong' => $variant->so_luong_bien_the,
                'gia_ban' => $variant->gia_ban,
                'gia_khuyen_mai' => $variant->gia_khuyen_mai ? $variant->gia_khuyen_mai : null,
                'co_san_kho' => $variant->so_luong_bien_the > 0,
            ];
        });

        $kichThuocGoiY = BienTheKichThuoc::where('loai_kich_thuoc', $tenDanhMuc)
            ->where(function ($query) use ($chieuCao, $canNang) {
                $query->whereBetween('chieu_cao_toi_thieu', [$chieuCao - 5, $chieuCao + 5])
                    ->whereBetween('chieu_cao_toi_da', [$chieuCao - 5, $chieuCao + 5])
                    ->whereBetween('can_nang_toi_thieu', [$canNang - 5, $canNang + 5])
                    ->whereBetween('can_nang_toi_da', [$canNang - 5, $canNang + 5]);
            })
            ->pluck('kich_thuoc');

        return response()->json([
            'status' => true,
            'kich_thuoc' => $kichThuoc->kich_thuoc,
            'bien_the_san_pham' => $result,
            'goi_y' => [
                'kich_thuoc_duoc_goi_y' => $kichThuocGoiY,
                'huong_dan_cham_soc' => 'Giặt tay trong nước lạnh, không sử dụng chất tẩy. Phơi khô tự nhiên.'
            ],
        ]);
    }



    public function loadKichThuoc()
    {
        try {
            $kichThuocs = BienTheKichThuoc::all()->groupBy('loai_kich_thuoc');
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Danh sách kích thước theo loại',
                'data' => $kichThuocs
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy danh sách kích thước',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
