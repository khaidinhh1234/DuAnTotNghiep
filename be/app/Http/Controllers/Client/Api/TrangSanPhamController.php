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
            $sanPhams = SanPham::whereHas('danhMuc', function ($query) use ($danhMucChaId) {
                $query->where('cha_id', $danhMucChaId);  // Điều kiện lọc các danh mục con của danh mục cha
            })
                ->with([
                    'bienTheSanPham' => function ($query) {
                        // Lấy các biến thể sản phẩm để có giá bán và giá khuyến mãi
                        $query->select('san_pham_id', 'gia_ban', 'gia_khuyen_mai', 'ngay_bat_dau_khuyen_mai', 'ngay_ket_thuc_khuyen_mai');
                    }
                ])
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
    public function mauSac(Request $request)
    {
        DB::beginTransaction();  // Bắt đầu transaction
        try {
            // Lấy tất cả màu sắc
            $mauSac = BienTheMauSac::query()->get();
            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            return response()->json([
                'mauSac' => $mauSac
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
    public function laySanPhamTheoMauSac(Request $request)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();
            // Nhận mã màu sắc từ request
            $mauSacId = $request->id;

            // Kiểm tra nếu mã màu không tồn tại
            if (!$mauSacId) {
                return response()->json([
                    'message' => 'Màu sắc không hợp lệ.',
                    'data' => $mauSacId
                ], 400);
            }
            // Lấy danh sách biến thể sản phẩm theo màu sắc
            $sanPhams = SanPham::whereHas('bienTheSanPham', function ($query) use ($mauSacId) {
                $query->where('bien_the_mau_sac_id', $mauSacId);
            })
                ->with([
                    'bienTheSanPham' => function ($query) {
                        $query->with('anhBienThe');
                    }
                ])
                ->paginate(10);

            // Commit transaction sau khi xử lý xong
            DB::commit();

            // Trả về danh sách sản phẩm
            return response()->json([
                'data' => $sanPhams
            ], 200);

        } catch (\Exception $e) {
            // Rollback nếu có lỗi xảy ra
            DB::rollBack();
            return response()->json([
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
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

    public function laySanPhamTheoKichThuoc(Request $request)
    {
        // Bắt đầu transaction
        DB::beginTransaction();

        try {
            // Nhận mã kích thước từ request
            $kichThuocId = $request->kich_thuoc_id; // Lấy trực tiếp từ request

            // Kiểm tra nếu mã kích thước không tồn tại
            if (!$kichThuocId) {
                return response()->json([
                    'message' => 'Kích thước không hợp lệ.'
                ], 400);
            }

            // Lấy danh sách sản phẩm theo kích thước
            $sanPhams = SanPham::whereHas('bienTheSanPham', function ($query) use ($kichThuocId) {
                $query->where('bien_the_kich_thuoc_id', $kichThuocId);
            })
                ->with([
                    'bienTheSanPham' => function ($query) {
                        $query->with('anhBienThe');
                    }
                ])
                ->paginate(10);

            // Commit transaction sau khi xử lý xong
            DB::commit();

            // Trả về danh sách sản phẩm
            return response()->json([
                'data' => $sanPhams
            ], 200);

        } catch (\Exception $e) {
            // Rollback nếu có lỗi xảy ra
            DB::rollBack();
            return response()->json([
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ], 500);
        }
    }


}
