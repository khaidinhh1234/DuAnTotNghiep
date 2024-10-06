<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheKichThuoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BienTheKichThuocController extends Controller
{
    public function index()
    {
        try {
            $data = BienTheKichThuoc::query()->orderByDesc('id')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kich_thuoc' => 'required|string|max:255|unique:bien_the_kich_thuocs,kich_thuoc',
            'loai_kich_thuoc' => 'required|in:nguoi_lon,tre_em',
        ]);

        $validator->after(function ($validator) use ($request) {
            if ($request->loai_kich_thuoc === 'nguoi_lon' && !preg_match('/^[a-zA-Z]+$/', $request->kich_thuoc)) {
                $validator->errors()->add('kich_thuoc', 'Kích thước phải là chữ cho loại người lớn.');
            } elseif ($request->loai_kich_thuoc === 'tre_em' && !is_numeric($request->kich_thuoc)) {
                $validator->errors()->add('kich_thuoc', 'Kích thước phải là số cho loại trẻ em.');
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $request->all();
            $bienTheKichThuoc = BienTheKichThuoc::create($data);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Thêm dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Thêm dữ liệu thất bại',
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $bienTheKichThuoc = BienTheKichThuoc::find($id);
            if (!$bienTheKichThuoc) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Biến thể kích thước không tồn tại',
                ], 404);
            }
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'kich_thuoc' => 'required|string|max:255|unique:bien_the_kich_thuocs,kich_thuoc,' . $id,
            'loai_kich_thuoc' => 'required|in:nguoi_lon,tre_em',
        ]);

        $validator->after(function ($validator) use ($request) {
            if ($request->loai_kich_thuoc === 'nguoi_lon' && !preg_match('/^[a-zA-Z]+$/', $request->kich_thuoc)) {
                $validator->errors()->add('kich_thuoc', 'Kích thước phải là chữ cho loại người lớn.');
            } elseif ($request->loai_kich_thuoc === 'tre_em' && !is_numeric($request->kich_thuoc)) {
                $validator->errors()->add('kich_thuoc', 'Kích thước phải là số cho loại trẻ em.');
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $bienTheKichThuoc = BienTheKichThuoc::find($id);
            if (!$bienTheKichThuoc) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Biến thể kích thước không tồn tại',
                ], 404);
            }
            $bienTheKichThuoc->update($request->all());
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Cập nhật dữ liệu thất bại',
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $bienTheKichThuoc = BienTheKichThuoc::find($id);
            if (!$bienTheKichThuoc) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Biến thể kích thước không tồn tại',
                ], 404);
            }

            if ($bienTheKichThuoc->bienTheSanPhams()->exists()) {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Không thể xóa vì sản phẩm có biến thể này.',
                ], 400);
            }

            $bienTheKichThuoc->delete();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Xóa dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Xóa dữ liệu thất bại',
            ], 500);
        }
    }

    public function danhSachXoaMem()
    {
        try {
            $bienTheKichThuoc = BienTheKichThuoc::onlyTrashed()->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
            ], 500);
        }
    }

    public function khoiPhucXoaMem(string $id)
    {
        try {
            $bienTheKichThuoc = BienTheKichThuoc::withTrashed()->find($id);
            if (!$bienTheKichThuoc) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Biến thể kích thước không tồn tại',
                ], 404);
            }
            $bienTheKichThuoc->restore();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Khôi phục dữ liệu thành công',
                'data' => $bienTheKichThuoc
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Khôi phục dữ liệu thất bại',
            ], 500);
        }
    }
}
