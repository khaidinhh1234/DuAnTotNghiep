<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\ChuongTrinhUuDai;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ChuongTrinhUuDaiController extends Controller
{
    /**
     * Display the single program (if exists).
     */
    public function index()
    {
        try {
            $uuDai = ChuongTrinhUuDai::query()->with('sanPhams')->first();

            if ($uuDai) {
                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $uuDai,
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Chưa có chương trình ưu đãi nào',
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            if (ChuongTrinhUuDai::whereNull('deleted_at')->exists()) {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Chỉ có thể tạo 1 chương trình ưu đãi đang hoạt động',
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'ten_uu_dai' => 'required|string|max:255',
                'duong_dan_anh' => 'required|string',
                'ngay_hien_thi' => 'required|date|before_or_equal:ngay_bat_dau',
                'mo_ta' => 'required|string',
                'ngay_bat_dau' => 'required|date',
                'ngay_ket_thuc' => 'required|date|after:ngay_bat_dau',
                'gia_tri_uu_dai' => 'required|integer',
                'loai' => 'required|in:tien,phan_tram',
                'san_pham' => 'array',
                'san_pham.*' => 'integer|exists:san_phams,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'status_code' => 422,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $dataUuDai = $request->except('san_pham');
            $dataUuDai['duong_dan'] = Str::slug($dataUuDai['ten_uu_dai']) . '-' . Carbon::now()->timestamp;

            DB::beginTransaction();
            $uuDai = ChuongTrinhUuDai::create($dataUuDai);
            $uuDai->sanPhams()->sync($request->san_pham);

            $this->updateTemporaryPromotionPrices($uuDai);

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 201,
                'message' => 'Tạo chương trình ưu đãi thành công',
                'data' => $uuDai,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi tạo chương trình ưu đãi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function updateTemporaryPromotionPrices($uuDai)
    {
        $sanPhams = $uuDai->sanPhams()->with('bienTheSanPham')->get();

        foreach ($sanPhams as $sanPham) {
            Log::info('Cập nhật giá khuyến mãi tạm thời cho sản phẩm ID: ' . $sanPham->id);
            $bienTheSanPhams = $sanPham->bienTheSanPham;

            foreach ($bienTheSanPhams as $bienTheSanPham) {
                $currentPromotionPrice = $bienTheSanPham->gia_khuyen_mai ?? null;
                $originalPrice = $bienTheSanPham->gia_ban;

                if ($originalPrice === null) {
                    Log::warning('Biến thể không có giá bán: ID ' . $bienTheSanPham->id);
                    continue;
                }

                if ($currentPromotionPrice !== null) {
                    if ($uuDai->loai == 'tien') {
                        $bienTheSanPham->gia_khuyen_mai_tam_thoi = max(0, $currentPromotionPrice - $uuDai->gia_tri_uu_dai);
                    } elseif ($uuDai->loai == 'phan_tram') {
                        $discountAmount = ($currentPromotionPrice * $uuDai->gia_tri_uu_dai) / 100;
                        $bienTheSanPham->gia_khuyen_mai_tam_thoi = max(0, $currentPromotionPrice - $discountAmount);
                    }
                } else {
                    $bienTheSanPham->gia_khuyen_mai_tam_thoi = $originalPrice;

                    Log::info('Không có giá khuyến mãi, sử dụng giá bán: ' . $bienTheSanPham->gia_khuyen_mai_tam_thoi);
                }

                Log::info('Cập nhật giá khuyến mãi tạm thời cho biến thể ID: ' . $bienTheSanPham->id . ', Giá khuyến mãi tạm thời: ' . $bienTheSanPham->gia_khuyen_mai_tam_thoi);

                try {
                    $bienTheSanPham->save();
                    Log::info('Lưu thành công biến thể ID: ' . $bienTheSanPham->id);
                } catch (\Exception $e) {
                    Log::error('Lỗi khi lưu biến thể ID: ' . $bienTheSanPham->id . ' - ' . $e->getMessage());
                }
            }
        }
    }



    /**
     * Update the existing resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $uuDai = ChuongTrinhUuDai::find($id);

            if (!$uuDai) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Không tìm thấy chương trình ưu đãi',
                ], 404);
            }

            $ngayKetThuc = Carbon::parse($uuDai->ngay_ket_thuc);
            $ngayHienTai = Carbon::now();

            // Chỉ không cho phép cập nhật nếu ngày hiện tại đã vượt qua ngày kết thúc
            if ($ngayHienTai->greaterThan($ngayKetThuc)) {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Không thể cập nhật chương trình ưu đãi vì ngày kết thúc đã qua.',
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'ten_uu_dai' => 'required|string|max:255',
                'duong_dan_anh' => 'required|string',
                'ngay_hien_thi' => 'required|date|before_or_equal:' . $request->ngay_bat_dau,
                'mo_ta' => 'required|string',
                'ngay_bat_dau' => 'required|date',
                'ngay_ket_thuc' => 'required|date|after:ngay_bat_dau',
                'gia_tri_uu_dai' => 'required|integer',
                'loai' => 'required|in:tien,phan_tram',
                'san_pham' => 'array',
                'san_pham.*' => 'integer|exists:san_phams,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'status_code' => 422,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $dataUuDai = $request->except('san_pham');
            $dataUuDai['duong_dan'] = Str::slug($dataUuDai['ten_uu_dai'] ?? 'uu-dai') . '-' . Carbon::now()->timestamp;

            DB::beginTransaction();
            $uuDai->update($dataUuDai);

            if ($request->has('san_pham')) {
                $uuDai->sanPhams()->sync($request->san_pham);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật chương trình ưu đãi thành công',
                'data' => $uuDai,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating promotion: ', ['error' => $e->getMessage()]);

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi cập nhật chương trình ưu đãi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $uuDai = ChuongTrinhUuDai::find($id);

            if (!$uuDai) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Không tìm thấy chương trình ưu đãi',
                ], 404);
            }

            $sanPhams = $uuDai->sanPhams()->get();

            foreach ($sanPhams as $sanPham) {
                $bienTheSanPhams = $sanPham->bienTheSanPham()->get();

                foreach ($bienTheSanPhams as $bienTheSanPham) {
                    $bienTheSanPham->gia_khuyen_mai_tam_thoi = null;

                    try {
                        $bienTheSanPham->save();
                    } catch (\Exception $e) {
                        // Log lỗi khi lưu biến thể sản phẩm
                        Log::error('Lỗi khi lưu biến thể ID: ' . $bienTheSanPham->id . ' - ' . $e->getMessage());
                    }
                }
            }

            // Xóa chương trình ưu đãi sau khi đã cập nhật tất cả biến thể
            $uuDai->delete();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Xóa chương trình ưu đãi thành công',
            ], 200);

        } catch (\Exception $e) {
            // Bắt lỗi và trả về phản hồi nếu có lỗi xảy ra
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi xóa chương trình ưu đãi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function danhSachXoaMem()
    {
        try {
            $data = ChuongTrinhUuDai::onlyTrashed()->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lọc dữ liệu',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function khoiPhucXoaMem(string $id)
    {
        try {
            DB::beginTransaction();
            $danhMuc = ChuongTrinhUuDai::onlyTrashed()->findOrFail($id);
            $danhMuc->restore();
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Khôi phục thành công',
                    'data' => $danhMuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Khôi phục thất bại',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $data = ChuongTrinhUuDai::query()->with('sanPhams')->findOrFail($id);

            $sanPhamIds = $data->sanPhams->pluck('id')->toArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'chuongTrinhUuDai' => $data,
                    'sanPhamIds' => $sanPhamIds,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy chương trình ưu đãi hoặc có lỗi xảy ra.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
