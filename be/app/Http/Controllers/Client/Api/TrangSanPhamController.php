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
    public function layTatCaSanPham(Request $request)
    {
        try {
            // Số lượng sản phẩm hiển thị mỗi trang, mặc định là 5
            $soLuongSanPhamMoiTrang = $request->get('per_page', 5);

            // Lấy tất cả sản phẩm cùng với biến thể sản phẩm, màu sắc và kích thước
            $sanPhams = SanPham::with([
                'bienTheSanPham' => function ($query) {
                    $query->with(['mauBienThe', 'kichThuocBienThe']) // Lấy cả thông tin màu sắc và kích thước
                        ->select( // lấy dữ liệu của  biến thể sản phẩm
                            'id',
                            'san_pham_id',
                            'bien_the_mau_sac_id',   // Thêm trường màu sắc
                            'bien_the_kich_thuoc_id', // Thêm trường kích thước
                            'so_luong_bien_the',
                            'gia_ban',
                            'gia_khuyen_mai',
                            'gia_khuyen_mai_tam_thoi'
                        );
                }
            ])
                ->select( // lấy dữ liệu của của  sản phẩm
                    'san_phams.id', // Chỉ định rõ bảng san_phams cho cột id
                    'san_phams.ten_san_pham',
                    'san_phams.anh_san_pham',
                    'san_phams.created_at',
                    'san_phams.ma_san_pham',
                    'san_phams.duong_dan',
                    'san_phams.hang_moi'
                )
                ->addSelect([
                    DB::raw('MIN(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_thap_nhat'), // Giá thấp nhất
                    DB::raw('MAX(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_cao_nhat')  // Giá cao nhất
                ])
                ->leftJoin('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->groupBy('san_phams.id') // Chỉ định rõ bảng san_phams cho cột id
                ->orderBy('san_phams.created_at', 'desc')  // Sắp xếp theo thời gian tạo mới nhất
                ->paginate($soLuongSanPhamMoiTrang);  // Phân trang

            // Xử lý dữ liệu trả về cho API
            $result = $sanPhams->map(function ($sanPham) {
                return [
                    'id' => $sanPham->id,
                    'ten_san_pham' => $sanPham->ten_san_pham,
                    'duong_dan' => $sanPham->duong_dan,
                    'anh_san_pham' => $sanPham->anh_san_pham ?? 'default_image.jpg', // Gán ảnh mặc định nếu null
                    'hang_moi' => $sanPham->hang_moi,
                    'gia_thap_nhat' => $sanPham->gia_thap_nhat,
                    'gia_cao_nhat' => $sanPham->gia_cao_nhat,
                    'bien_the' => $sanPham->bienTheSanPham->map(function ($bienThe) {
                        return [
                            'id' => $bienThe->id,
                            'so_luong_bien_the' => $bienThe->so_luong_bien_the ?? 0, // Gán giá trị 0 nếu null
                            'gia_ban' => $bienThe->gia_ban ?? 0, // Gán giá trị 0 nếu null
                            'gia_khuyen_mai' => $bienThe->gia_khuyen_mai ?? $bienThe->gia_ban, // Nếu null thì dùng giá bán
                            'gia_khuyen_mai_tam_thoi' => $bienThe->gia_khuyen_mai_tam_thoi ?? null,
                            'mau_sac' => $bienThe->mauBienThe->ten_mau_sac ?? 'Không xác định', // Lấy thông tin màu sắc
                            'kich_thuoc' => $bienThe->kichThuocBienThe->kich_thuoc ?? 'Không xác định', // Lấy thông tin kích thước
                        ];
                    })
                ];
            });

            // Trả về API dữ liệu phân trang
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy tất cả sản phẩm thành công.',
                'data' => $result,
                'pagination' => [
                    'total' => $sanPhams->total(),
                    'current_page' => $sanPhams->currentPage(),
                    'last_page' => $sanPhams->lastPage(),
                    'per_page' => $sanPhams->perPage(),
                ]
            ], 200);

        } catch (\Exception $e) {
            // Trả về lỗi nếu có exception
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Có lỗi xảy ra khi lấy tất cả sản phẩm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


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
