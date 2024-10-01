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

    public function locSanPhamTheoDanhMuc(Request $request)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();
            $mangDanhMuc = [];
            foreach ($request->id as $id) {
                // Lấy id danh mục cha từ request (truyền qua POST)
                $danhMucChaId = $id;

                // Lấy thông tin danh mục cha và các danh mục con
                $danhMucCha = DanhMuc::with(['children'])->findOrFail($danhMucChaId);

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
                array_push($mangDanhMuc, $danhMucCha);
            }


            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            // Trả về dữ liệu danh mục và sản phẩm
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'danhMucCha' => $mangDanhMuc,
                'sanPhams' => $sanPhams
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
                    'status' => false,
                    'status_code' => 400,
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
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'data' => $sanPhams
            ], 200);
        } catch (\Exception $e) {
            // Rollback nếu có lỗi xảy ra
            DB::rollBack();
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
    public function locSanPham(Request $request)
    {
        DB::beginTransaction();  // Bắt đầu transaction

        try {
            // Lấy các tham số lọc từ request
            $danhMucIds = $request->danh_muc_ids;
            $mauSacIds = $request->mau_sac_ids;
            $kichThuocIds = $request->kich_thuoc_ids;
            $giaDuoi = $request->gia_duoi;
            $giaTren = $request->gia_tren;

            // Tạo query
            $query = SanPham::query();

            // Lọc theo danh mục cha và con
            if ($danhMucIds && is_array($danhMucIds)) {
                $query->whereHas('danhMuc', function ($query) use ($danhMucIds) {
                    $query
                        ->whereIn('id', $danhMucIds)
                        ->orWhereIn('cha_id', $danhMucIds);  // Lấy danh mục cha và con
                });
            }

            // Lọc theo màu sắc sản phẩm
            if ($mauSacIds && is_array($mauSacIds)) {
                $query->whereHas('bienTheSanPham', function ($query) use ($mauSacIds) {
                    $query->whereIn('bien_the_mau_sac_id', $mauSacIds);
                });
            }

            // Lọc theo kích thước sản phẩm
            if ($kichThuocIds && is_array($kichThuocIds)) {
                $query->whereHas('bienTheSanPham', function ($query) use ($kichThuocIds) {
                    $query->whereIn('bien_the_kich_thuoc_id', $kichThuocIds);
                });
            }

            // Lọc theo khoảng giá
            if ($giaDuoi && $giaTren) {
                $query->whereBetween('gia_ban', [$giaDuoi, $giaTren]);
            }

            // Lấy dữ liệu sản phẩm với thông tin biến thể sản phẩm và ảnh biến thể
            $sanPhams = $query->with([
                'bienTheSanPham' => function ($query) {
                    $query->with(['anhBienThe', 'mauBienThe']);  // Lấy ảnh và thông tin màu
                }
            ])
                ->paginate(10);  // Phân trang, mỗi trang 10 sản phẩm

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
