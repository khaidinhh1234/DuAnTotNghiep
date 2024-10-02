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
            $danhMucs = DanhMuc::with('parent')->orderBy('created_at', 'desc')->get();
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
                'anh_danh_muc' => 'nullable',
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
}
