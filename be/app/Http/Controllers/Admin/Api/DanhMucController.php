<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMuc;
use Illuminate\Http\Request;

class DanhMucController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $danhMucs = DanhMuc::with('parent')->get();
            return response()->json($danhMucs, 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Đã có lỗi xảy ra khi lấy danh mục'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validateDanhMuc = $request->validate([
                'ten_danh_muc' => 'required|unique:danh_mucs|max:255',
                'cha_id' => 'nullable',
            ]);
            $danhMuc = DanhMuc::create($validateDanhMuc);

            return response()->json($danhMuc, 201);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Đã có lỗi xảy ra khi thêm danh mục'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validateDanhMuc = $request->validate([
                'ten_danh_muc' => 'required|unique:danh_mucs,ten_danh_muc,' . $id . '|max:255',
                'cha_id' => 'nullable',
            ]);
            $danhMuc = DanhMuc::findOrFail($id);
            $danhMuc->update($validateDanhMuc);

            return response()->json($danhMuc, 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Đã có lỗi xảy ra khi sửa danh mục'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $danhMuc = DanhMuc::findOrFail($id);
            $danhMuc->delete();

            return response()->json(['message' => 'Danh mục đã được xóa'], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Đã có lỗi xảy ra khi xóa danh mục'], 500);
        }
    }
}
