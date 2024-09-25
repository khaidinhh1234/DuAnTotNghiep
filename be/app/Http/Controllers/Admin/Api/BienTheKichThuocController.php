<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheKichThuoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BienTheKichThuocController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = BienTheKichThuoc::query()->orderByDesc('id')->get();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
            ];
            return response()->json($json, 500);
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
            'kich_thuoc' => 'required|string|max:255|unique:bien_the_kich_thuocs,kich_thuoc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            $data = $request->all();
            $bienTheKichThuoc = BienTheKichThuoc::create($data);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Thêm dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Thêm dữ liệu thát bị',
            ];
            return response()->json($json, 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $bienTheKichThuoc = BienTheKichThuoc::find($id);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thát bại',
            ];
            return response()->json($json, 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'kich_thuoc' => 'required|string|max:255|unique:bien_the_kich_thuocs,kich_thuoc,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            $data = $request->all();
            $bienTheKichThuoc = BienTheKichThuoc::find($id);
            $bienTheKichThuoc->update($data);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Cập nhật dữ liệu thất bại',
            ];
            return response()->json($json, 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $bienTheKichThuoc = BienTheKichThuoc::find($id);

            if ($bienTheKichThuoc->bienTheSanPhams()->exists()) {
                $json = [
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Không thể xóa vì sản phẩm có biến thể này.',
                ];
                return response()->json($json, 400);
            }

            $bienTheKichThuoc->delete();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Xóa dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            // Xử lý lỗi
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Xóa dữ liệu thất bại',
            ];
            return response()->json($json, 500);
        }
    }


    public function danhSachXoaMem()
    {
        try {
            $bienTheKichThuoc = BienTheKichThuoc::onlyTrashed()->get();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
            ];
            return response()->json($json, 500);
        }
    }

    public function khoiPhucXoaMem(string $id)
    {
        try {
            $bienTheKichThuoc = BienTheKichThuoc::withTrashed()->find($id);
            $bienTheKichThuoc->restore();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Khoi phuc dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Khoi phuc dữ liệu thất bại',
            ];
            return response()->json($json, 500);
        }
    }
}
