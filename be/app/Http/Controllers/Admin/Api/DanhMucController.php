<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class DanhMucController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $danhMucs = DanhMuc::with('parent')->get();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $danhMucs,
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
            $validateDanhMuc = $request->validate([
                'ten_danh_muc' => 'required|unique:danh_mucs|max:255',
                'cha_id' => 'nullable',
                'anh_danh_muc' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'duong_dan' => 'nullable',

            ]);

            if ($request->hasFile('anh_danh_muc')) {
                $pathFile = $request->file('anh_danh_muc')->store('danh_mucs', 'public');
                $validateDanhMuc['anh_danh_muc'] = Storage::url($pathFile);
            }

            $validateDanhMuc['duong_dan'] = Str::slug($validateDanhMuc['ten_danh_muc']);
            $danhMuc = DanhMuc::create($validateDanhMuc);
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Danh mục đã được thêm thành công',
                    'data' => $danhMuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi thêm danh mục',
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
            // Tìm danh mục theo ID hoặc trả về lỗi 404 nếu không tìm thấy
            $danhMuc = DanhMuc::with('parent')->findOrFail($id);

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $danhMuc,
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            DB::beginTransaction();
            $validateDanhMuc = $request->validate([
                'ten_danh_muc' => 'required|unique:danh_mucs,ten_danh_muc,' . $id . '|max:255',
                'cha_id' => 'nullable',
                'anh_danh_muc' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'duong_dan' => 'nullable',

            ]);

            $danhMuc = DanhMuc::findOrFail($id);

            if ($request->hasFile('anh_danh_muc')) {
                if ($danhMuc->anh_danh_muc) {
                    Storage::delete('public/' . basename($danhMuc->anh_danh_muc));
                }
                $pathFile = $request->file('anh_danh_muc')->store('danh_mucs', 'public');
                $validateDanhMuc['anh_danh_muc'] = Storage::url($pathFile);
            } else {
                $validateDanhMuc['anh_danh_muc'] = $danhMuc->anh_danh_muc;
            }

            $validateDanhMuc['duong_dan'] = Str::slug($validateDanhMuc['ten_danh_muc']);
            $danhMuc->update($validateDanhMuc);
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Danh mục đã được cập nhập thành công',
                    'data' => $danhMuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi cập nhập danh mục',
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
            $danhMuc = DanhMuc::findOrFail($id);

            if ($danhMuc->children()->exists()) {
                return response()->json(['error' => 'Không thể xóa danh mục này vì vẫn còn danh mục con.'], 422);
            }

            // Kiểm tra và xóa file ảnh nếu có
            if ($danhMuc->anh_danh_muc) {
                $fileName = basename($danhMuc->anh_danh_muc);
                $filePath = public_path('storage/danh_mucs/' . $fileName);

                if (file_exists($filePath)) {
                    unlink($filePath);
                } else {
                    Log::error('File không tồn tại: ' . $filePath);
                }
            }

            $danhMuc->delete();
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Danh mục đã được xóa',
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi xóa danh mục',
                'error' => $exception->getMessage()
            ], 500);
        }
    }


    /**
     * Display a listing of trashed resources.
     */
    public function danhSachDanhMucDaXoa()
    {
        try {

            $danhMucsDaXoa = DanhMuc::onlyTrashed()->get();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy danh sách danh mục đã xóa thành công',
                'data' => $danhMucsDaXoa,
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy danh sách danh mục đã xóa',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Restore the specified trashed resource.
     */
    public function khoiPhucDanhMuc(string $id)
    {
        try {
            DB::beginTransaction();
            $danhMuc = DanhMuc::onlyTrashed()->findOrFail($id);
            $danhMuc->restore();
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Khôi phục Danh Mục thành công',
                    'data' => $danhMuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Khôi phục Danh Mục không công',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
