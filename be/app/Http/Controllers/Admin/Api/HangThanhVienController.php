<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\HangThanhVien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class HangThanhVienController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $hangThanhVen = HangThanhVien::query()->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $hangThanhVen,
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validateHangThanhVien = Validator::make($request->all(), [
            'ten_hang_thanh_vien' => 'required|unique:hang_thanh_viens',
            'anh_hang_thanh_vien' => 'required',
            'chi_tieu_toi_thieu' => 'required|numeric',
            'chi_tieu_toi_da' => 'required|numeric',
            'ngay_bat_dau' => 'nullable',
            'ngay_ket_thuc' => 'nullable',
            'mo_ta' => 'nullable'
        ]);

        if ($validateHangThanhVien->fails()) {
            return response()->json(['errors' => $validateHangThanhVien->errors()], 422);
        }


        $exists = HangThanhVien::where(function ($query) use ($request) {
            // kiểm tra bất kì tối thiểu hay tối đa nằm trong khaonr bất kì bản ghio nòa cũng sẽ báo
            $query->whereBetween('chi_tieu_toi_thieu', [$request->chi_tieu_toi_thieu, $request->chi_tieu_toi_da])
                ->orWhereBetween('chi_tieu_toi_da', [$request->chi_tieu_toi_thieu, $request->chi_tieu_toi_da])
                ->orWhere(function ($subQuery) use ($request) {
                    $subQuery->where('chi_tieu_toi_thieu', '<=', $request->chi_tieu_toi_thieu)
                        ->where('chi_tieu_toi_da', '>=', $request->chi_tieu_toi_da);
                });

        })->exists();

        if ($exists) {
            return response()->json(['error' => 'Khoảng chi tiêu đã tồn tại hoặc bị chồng lấn.'], 422);
        }

        try {
            DB::beginTransaction();
            $hang = HangThanhVien::create($request->all());
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Thêm mới hạng thành viên thành công',
                'data' => $hang
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi thêm hạng thành viên',
                'error' => $exception->getMessage()
            ], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $hangThanhVien = HangThanhVien::query()->findOrFail($id);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu hạng thành viên thành công',
                'data' => $hangThanhVien
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy hạng thành viên',
                'error' => $exception->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validateHangThanhVien = Validator::make($request->all(), [
            'ten_hang_thanh_vien' => 'required|unique:hang_thanh_viens,id,' . $id,
            'anh_hang_thanh_vien' => 'required',
            'chi_tieu_toi_thieu' => 'required|integer',
            'chi_tieu_toi_da' => 'required|integer',
            'ngay_bat_dau' => 'nullable',
            'ngay_ket_thuc' => 'nullable',
            'mo_ta' => 'nullable'
        ]);
    
        if ($validateHangThanhVien->fails()) {
            return response()->json(['errors' => $validateHangThanhVien->errors()], 422);
        }
    
        $exists = HangThanhVien::where(function ($query) use ($request) {

            $query->whereBetween('chi_tieu_toi_thieu', [$request->chi_tieu_toi_thieu, $request->chi_tieu_toi_da])
                  ->orWhereBetween('chi_tieu_toi_da', [$request->chi_tieu_toi_thieu, $request->chi_tieu_toi_da])
                  ->orWhere(function ($subQuery) use ($request) {
                      $subQuery->where('chi_tieu_toi_thieu', '<=', $request->chi_tieu_toi_thieu)
                               ->where('chi_tieu_toi_da', '>=', $request->chi_tieu_toi_da);
                  });
        })
        ->where('id', '!=', $id)  // Loại trừ bản ghi hiện tại
        ->exists();
    
        if ($exists) {
            return response()->json(['error' => 'Khoảng chi tiêu đã tồn tại hoặc bị chồng lấn.'], 422);
        }

        try {
            DB::beginTransaction();
            $hang = HangThanhVien::findOrFail($id);
            $hang->update($request->all());
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật hạng thành viên thành công',
                'data' => $hang
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy hạng thành viên',
                'error' => $exception->getMessage()
            ], 404);
        }
    }
    


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $hangThanhVien = HangThanhVien::findOrFail($id);
            $hangThanhVien->delete();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Xóa hàng thành viên thành công',
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi xóa hạng thành viên',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function danhSachHangThanhVienDaXoa()
    {
        try {
            $hangThanhVien = HangThanhVien::onlyTrashed()->orderByDesc('deleted_at')->get();
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $hangThanhVien,
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function khoiPhucHangThanhVien(int $id)
    {
        try {
            $hangThanhVien = HangThanhVien::withTrashed()->findOrFail($id);
            $hangThanhVien->restore();
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Khôi phục thành công',
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
