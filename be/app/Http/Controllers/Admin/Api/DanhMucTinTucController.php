<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMucTinTuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DanhMucTinTucController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $danhMucTinTucs = DanhMucTinTuc::orderBy('created_at', 'desc')->get();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $danhMucTinTucs,
                ],
                200
            );
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
        try {
            DB::beginTransaction();
            $validateDanhMucTinTuc = $request->validate([
                'ten_danh_muc_tin_tuc' => 'required|string|max:255',
                'mo_ta' => 'nullable',
                'hinh_anh' => 'nullable',

            ]);
            $validateDanhMucTinTuc['duong_dan'] = Str::slug($validateDanhMucTinTuc['ten_danh_muc_tin_tuc']);
            $danhMucTinTuc = DanhMucTinTuc::create($validateDanhMucTinTuc);
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Danh mục tin tức đã được thêm thành công',
                    'data' => $danhMucTinTuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi thêm danh mục tin tức',
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
            $danhMucTinTuc = DanhMucTinTuc::findOrFail($id);
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $danhMucTinTuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy danh mục tin tức',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            DB::beginTransaction();
            $validateDanhMucTinTuc = $request->validate([
                'ten_danh_muc_tin_tuc' => 'required|string|max:255',
            ]);
            $danhMucTinTuc = DanhMucTinTuc::findOrFail($id);
            $validateDanhMucTinTuc['duong_dan'] = Str::slug($validateDanhMucTinTuc['ten_danh_muc_tin_tuc']);
            $danhMucTinTuc->update($validateDanhMucTinTuc);
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Danh mục tin tức đã được Cập nhập thành công',
                    'data' => $danhMucTinTuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi Cập nhập danh mục tin tức',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            $danhMucTinTuc = DanhMucTinTuc::findOrFail($id);

            if ($danhMucTinTuc->tinTuc()->count() > 0) {
                return response()->json(['error' => 'Không thể xóa danh mục này vì vẫn còn tin tức.']);
            }

            $danhMucTinTuc->delete();
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Danh mục tin tức đã được xóa',
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi xóa danh mục tin tức',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of trashed resources.
     */

    public function danhSachDanhMucTinTucDaXoa()
    {
        try {
            $danhMucTinTucDaXoa = DanhMucTinTuc::onlyTrashed()->get();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $danhMucTinTucDaXoa,
                ],
                200
            );
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu không công',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Restore the specified trashed resource.
     */

    public function khoiPhucDanhMucTinTuc(string $id)
    {
        try {
            DB::beginTransaction();
            $danhMucTinTuc = DanhMucTinTuc::onlyTrashed()->findOrFail($id);
            $danhMucTinTuc->restore();
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Khôi phục Danh Mục tin tức thành công',
                    'data' => $danhMucTinTuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Khôi phục Danh Mục tin tức không thành công',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

}
