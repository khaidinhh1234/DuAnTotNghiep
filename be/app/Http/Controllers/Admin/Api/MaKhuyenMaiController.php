<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\MaKhuyenMai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaKhuyenMaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = MaKhuyenMai::query()->orderByDesc('id')->get();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data
            ];
            return response()->json($json, 200);
        }catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lỗi xảy ra khi lấy dữ liệu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ma_code'             => 'required|string|max:255',
            'mo_ta'               => 'nullable|string',
            'loai'                => 'required|string',
            'ngay_bat_dau'        => 'required|date',
            'ngay_ket_thuc'       => 'required|date',
            'so_luong'            => 'required|integer',
            'giam_gia'            => 'required|numeric',
            'chi_tieu_thoi_thieu' => 'nullable|numeric',
            'tong_giam_gia_toi_da'=> 'nullable|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = MaKhuyenMai::create($request->all());
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Đã lưu mã khuyến mãi thành công',
                'data' => $data
            ];
            return response()->json($json, 200);
        }catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi trong quá trình lưu dữ liệu',
                'error' => $e->getMessage()
                ], 500);
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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
