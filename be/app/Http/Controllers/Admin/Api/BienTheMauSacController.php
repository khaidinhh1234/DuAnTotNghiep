<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BienTheMauSacController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = BienTheMauSac::query()->orderByDesc('id')->get();
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
                'message' => 'Lấy dữ liệu thất báo',
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
            'ten_mau_sac' => 'required|string|max:255|unique:bien_the_mau_sacs,ten_mau_sac',
            'ma_mau_sac' => 'required|string|max:255|unique:bien_the_mau_sacs,ma_mau_sac',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $request->all();
            $bienTheMauSac = BienTheMauSac::create($data);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Thêm dữ liệu thành công',
                'data' => $bienTheMauSac
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Thêm dữ liệu thất bại',
            ];
            return response()->json($json, 500);
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
        $validator = Validator::make($request->all(), [
            'ten_mau_sac' => 'required|string|max:255|unique:bien_the_mau_sacs,ten_mau_sac,' . $id,
            'ma_mau_sac' => 'required|string|max:255|unique:bien_the_mau_sacs,ma_mau_sac,' . $id,
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            $data = $request->all();
            $bienTheMauSac = BienTheMauSac::find($id);
            $bienTheMauSac->update($data);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật dữ liệu thành công',
                'data' => $bienTheMauSac
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
            $bienTheMauSac = BienTheMauSac::find($id);
            $bienTheMauSac->delete();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Xóa dữ liệu thành công',
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Xóa dữ liệu thất bại',
            ];
            return response()->json($json, 500);
        }
    }

    public function danhSachXoaMem(){
        try {
            $data = BienTheMauSac::query()->onlyTrashed()->get();
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

    public function khoiPhucXoaMem($id)
    {
        try {
            $bienTheMauSac = BienTheMauSac::onlyTrashed()->find($id);
            $bienTheMauSac->restore();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Khôi phục dữ liệu thành công',
                'data' => $bienTheMauSac
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Khôi phục dữ liệu thất báo',
            ];
            return response()->json($json, 500);
        }
    }
}
