<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMuc;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrangSanPhamController extends Controller
{
    public function danhMucCha(Request $request)
    {
        DB::beginTransaction();  // Bắt đầu transaction
        try {
            // Lấy danh mục có cha_id là null
            $danhMucCha = DanhMuc::query()->whereNull('cha_id')->get();





            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            return response()->json([
                'danhMucCha' => $danhMucCha,

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

    public function locSanPhamTheoDanhMuc(Request $request)
    {
        DB::beginTransaction();  // Bắt đầu transaction
        try {
            // Lấy id danh mục cha từ request (truyền qua POST)
            $danhMucChaId = $request->cha_id;

            // Lấy thông tin danh mục cha và các danh mục con
            $danhMucCha = DanhMuc::with(['children'])
                ->where('id', $danhMucChaId)
                ->firstOrFail();

            // Lấy tất cả sản phẩm thuộc các danh mục con
            $sanPhams = SanPham::whereHas('danhMuc', function($query) use ($danhMucChaId) {
                $query->where('cha_id', $danhMucChaId);  // Điều kiện lọc các danh mục con của danh mục cha
            })
            ->with(['bienTheSanPham' => function($query) {
                // Lấy các biến thể sản phẩm để có giá bán và giá khuyến mãi
                $query->select('san_pham_id', 'gia_ban', 'gia_khuyen_mai', 'ngay_bat_dau_khuyen_mai', 'ngay_ket_thuc_khuyen_mai');
            }])
            ->paginate(10);  // Phân trang 10 sản phẩm mỗi trang

            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            // Trả về dữ liệu danh mục và sản phẩm
            return response()->json([
                'danhMucCha' => $danhMucCha,
                'sanPhams' => $sanPhams
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
}
