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
use Illuminate\Support\Facades\DB;

class TrangChiTietSpController extends Controller
{
    public function chiTietSanPham($duongDan)
    {
        try {
            $user = Auth::guard('api')->user();

            $chiTietSanPham = SanPham::with([
                'danhMuc',
                'danhGias.user',
                'danhGias.danhGiaHuuIch',
                'danhGias' => function ($query) {
                    $query->withCount('danhGiaHuuIch');
                },
                'danhGias.bienTheSanPham.mauBienThe',
                'danhGias.bienTheSanPham.kichThuocBienThe',
                'danhGias.donHang',
                'bienTheSanPham.anhBienThe',
                'bienTheSanPham.mauBienThe',
                'bienTheSanPham.kichThuocBienThe',
                'boSuuTapSanPham',
            ])->where('duong_dan', $duongDan)->first();

            foreach ($chiTietSanPham->danhGias as $danhGia) {
                $danhGia->trang_thai_danh_gia_nguoi_dung = $danhGia->danhGiaHuuIch()->where('user_id', $user->id)->exists();
            }
            if ($chiTietSanPham->khachHangYeuThich->pluck('id')->first() == $user->id) {
                $chiTietSanPham['trang_thai_yeu_thich'] = true;
            } else {
                $chiTietSanPham['trang_thai_yeu_thich'] = false;
            }

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Chi tiết sản phẩm',
                'data' => $chiTietSanPham
            ]);
        } catch (\Exception $exception) {
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
            if (!$user) {
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
        // Validate the incoming request
        $request->validate([
            'chieu_cao' => 'required|numeric|min:0',
            'can_nang' => 'required|numeric|min:0',
            'san_pham_id' => 'required|exists:san_phams,id',
        ]);

        // Get input values
        $chieuCao = $request->input('chieu_cao');
        $canNang = $request->input('can_nang');
        $sanPhamId = $request->input('san_pham_id');

        // Find the product with its category
        $sanPham = SanPham::with('danhMuc')->find($sanPhamId);

        // Check if the product or its category exists
        if (!$sanPham || !$sanPham->danhMuc) {
            return response()->json([
                'status' => false,
                'message' => 'Sản phẩm không tồn tại hoặc không có danh mục.',
            ], 404);
        }

        // Get the category and check if it's a child category
        $danhMuc = $sanPham->danhMuc;
        if ($danhMuc->cha_id !== null) {
            $danhMuc = DanhMuc::find($danhMuc->cha_id);
        }

        // Get the name of the category
        $tenDanhMuc = $danhMuc->ten_danh_muc;

        // Determine the size based on height and weight
        $kichThuoc = BienTheKichThuoc::where('loai_kich_thuoc', strtolower($tenDanhMuc))
            ->where(function($query) use ($chieuCao, $canNang) {
                $query->where('chieu_cao_toi_thieu', '<=', $chieuCao)
                    ->where('chieu_cao_toi_da', '>=', $chieuCao)
                    ->where('can_nang_toi_thieu', '<=', $canNang)
                    ->where('can_nang_toi_da', '>=', $canNang);
            })
            ->first();

        // Check if a size was found
        if (!$kichThuoc) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy kích thước phù hợp.',
            ], 404);
        }

        // Retrieve all color variations
        $mauSac = BienTheMauSac::all();

        // Return the response with size and color variations
        return response()->json([
            'status' => true,
            'kich_thuoc' => $kichThuoc->kich_thuoc,
            'mau_sac' => $mauSac,
        ]);
    }

}
