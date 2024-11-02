<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\AnhTinTuc;
use App\Models\TinTuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class TinTucController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        try {
            $tinTucs = TinTuc::with(
                'user:id,ho,ten',
                'danhMucTinTuc:id,ten_danh_muc_tin_tuc',
            )->orderBy('created_at', 'desc')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $tinTucs,
            ]);
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
            $validatedTinTuc = $request->validate([
                'danh_muc_tin_tuc_id' => 'required|exists:danh_muc_tin_tucs,id',
                'tieu_de' => 'required|unique:tin_tucs,tieu_de|max:255',
                'anh_tin_tuc' => 'nullable',
                'noi_dung' => 'required|string',
                'duong_dan' => 'nullable',
            ]);

            $validatedTinTuc['user_id'] = Auth::guard('api')->id();

            $validatedTinTuc['duong_dan'] = Str::slug($validatedTinTuc['tieu_de']);
            $tinTuc = TinTuc::create($validatedTinTuc);

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Thêm mới tin tức thành công',
                'data' => $tinTuc,
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi thêm mới dữ liệu',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */

    public function show(string $id)
    {
        try {
            $tinTuc = TinTuc::with('user', 'danhMucTinTuc')->find($id);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $tinTuc,
            ]);
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

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $tinTuc = TinTuc::findOrFail($id);
            $validatedTinTuc = $request->validate([
                // 'user_id' => 'required|exists:users,id',
                'danh_muc_tin_tuc_id' => 'required|exists:danh_muc_tin_tucs,id',
                'tieu_de' => 'required|unique:tin_tucs,tieu_de,' . $id . '|max:255',
                'anh_tin_tuc' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'noi_dung' => 'required|string',
                'duong_dan' => 'nullable',
            ]);
            $validatedTinTuc['user_id'] = $tinTuc->user_id;
            $validatedTinTuc['duong_dan'] = Str::slug($validatedTinTuc['tieu_de']);

            $tinTuc->update($validatedTinTuc);

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật tin tức thành công',
                'data' => $tinTuc,
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi cập nhật dữ liệu',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */

    public function destroy($id)
    {
        try {
            DB::beginTransaction();


            $tinTuc = TinTuc::findOrFail($id);


            $tinTuc->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Xóa tin tức thành công',
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi xóa tin tức',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }


    /**
     * Display a listing of trashed resources.
     */

    public function danhSachTinTucDaXoa()
    {
        try {
            $tinTucDaXoa = TinTuc::onlyTrashed()->with(
                'user:id,ho,ten',
                'danhMucTinTuc:id,ten_danh_muc_tin_tuc',
            )->get();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $tinTucDaXoa,
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

    public function khoiPhucTinTuc(string $id)
    {
        try {
            DB::beginTransaction();
            $tinTuc = TinTuc::onlyTrashed()->findOrFail($id);
            $tinTuc->restore();
            DB::commit();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Khôi phục Tin Tức thành công',
                    'data' => $tinTuc,
                ],
                200
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Khôi phục Tin Tức không thành công',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
