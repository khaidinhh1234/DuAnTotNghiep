<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\ChuongTrinhUuDai;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
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
            $dataUuDai['duong_dan'] = Str::slug($dataUuDai['ten_uu_dai']).'-'.Carbon::now()->timestamp;
            DB::beginTransaction();
            $uuDai = ChuongTrinhUuDai::create($dataUuDai);
            $uuDai->sanPhams()->sync($request->san_pham);
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

            $ngayBatDau = Carbon::parse($uuDai->ngay_bat_dau);
            $ngayHienTai = Carbon::now();

            if ($ngayHienTai->isPast($ngayBatDau)) {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Không thể cập nhật chương trình ưu đãi vì ngày bắt đầu đã đến.',
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
            $dataUuDai['duong_dan'] = Str::slug($dataUuDai['ten_uu_dai']).'-'.Carbon::now()->timestamp;
            DB::beginTransaction();
            $uuDai->update($dataUuDai);
            $uuDai->sanPhams()->sync($request->san_pham);
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật chương trình ưu đãi thành công',
                'data' => $uuDai,
            ], 200);
        } catch (\Exception $e) {
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

            $sanPhams = SanPham::where('gia_tri_uu_dai', $uuDai->gia_tri_uu_dai)->get();
            foreach ($sanPhams as $sanPham) {
                $sanPham->gia_tri_uu_dai = null;
                $sanPham->save();
            }
            $uuDai->delete();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Xóa chương trình ưu đãi thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi xóa chương trình ưu đãi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function danhSachXoaMem(){
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
}
