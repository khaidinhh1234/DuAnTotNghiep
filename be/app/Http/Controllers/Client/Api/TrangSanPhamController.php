<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use App\Models\DanhMuc;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrangSanPhamController extends Controller
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



    public function mauSac(Request $request)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Lấy tất cả màu sắc
            $mauSac = BienTheMauSac::query()->get();
            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'mauSac' => $mauSac
            ], 200);
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();

            // Trả về lỗi
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function kichThuoc(Request $request)
    {
        DB::beginTransaction();  // Bắt đầu transaction
        try {
            // Lấy tất cả màu sắc
            $kichThuoc = BienTheKichThuoc::query()->get();
            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            return response()->json([
                'kichThuoc' => $kichThuoc
            ]);
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();

            // Trả về lỗi
            return response()->json([
                'message' => 'Có lỗi xảy ra, vui lòng thử lại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // $sanPhams = $query->with([
    //     'bienTheSanPham' => function ($query) {
    //         $query->with([
    //             'anhBienThe',
    //             'mauBienThe' => function($mauQuery) {
    //                 $mauQuery->select('id', 'ten_mau_sac', 'ma_mau_sac');
    //             }
    //         ]);
    //     }
    // ])
    //     ->select('ten_san_pham', 'gia_tri_uu_dai', 'luot_xem', 'anh_san_pham')
    //     ->paginate(10);  // Phân trang, mỗi trang 10 sản phẩm
    public function locSanPham(Request $request)
    {
        DB::beginTransaction();  // Bắt đầu transaction

        try {
            // Lấy các tham số lọc từ request
            $danhMucIds = $request->danh_muc_ids ?? [];
            $mauSacIds = $request->mau_sac_ids ?? [];
            $kichThuocIds = $request->kich_thuoc_ids ?? [];
            $giaDuoi = $request->gia_duoi ?? null;
            $giaTren = $request->gia_tren ?? null;

            // Tạo query
            $query = SanPham::query();

            // Lọc theo danh mục cha và con
            if (!empty($danhMucIds) && is_array($danhMucIds)) {
                $query->whereHas('danhMuc', function ($query) use ($danhMucIds) {
                    $query
                        ->whereIn('id', $danhMucIds)
                        ->orWhereIn('cha_id', $danhMucIds);  // Lấy danh mục cha và con
                });
            }

            // Lọc theo màu sắc sản phẩm
            if (!empty($mauSacIds) && is_array($mauSacIds)) {
                $query->whereHas('bienTheSanPham', function ($query) use ($mauSacIds) {
                    $query->whereIn('bien_the_mau_sac_id', $mauSacIds);
                });
            }

            // Lọc theo kích thước sản phẩm
            if (!empty($kichThuocIds) && is_array($kichThuocIds)) {
                $query->whereHas('bienTheSanPham', function ($query) use ($kichThuocIds) {
                    $query->whereIn('bien_the_kich_thuoc_id', $kichThuocIds);
                });
            }
            // Lọc theo khoảng giá
            if (!is_null($giaDuoi) && !is_null($giaTren)) {
                $query->whereHas('bienTheSanPham', function ($query) use ($giaDuoi, $giaTren) {
                    $query->whereBetween('gia_ban', [$giaDuoi, $giaTren]);
                });
            }

            // Lấy dữ liệu sản phẩm với thông tin biến thể sản phẩm và ảnh biến thể
            $sanPhams = $query->with([
                'bienTheSanPham' => function ($query) {
                    $query->with(['anhBienThe', 'mauBienThe', 'kichThuocBienThe']);  // Lấy ảnh và thông tin màu
                }
            ])
                // ->select('gia_tri_uu_dai', 'luot_xem')
                ->paginate(10);

            DB::commit();  // Commit transaction

            // Trả về kết quả
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'data' => $sanPhams
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();  // Rollback nếu có lỗi xảy ra

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
