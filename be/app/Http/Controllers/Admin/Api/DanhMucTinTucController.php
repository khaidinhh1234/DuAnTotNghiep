<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMucTinTuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
}
