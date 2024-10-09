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
            'kich_thuoc' => 'required|string|max:255',
            'loai_kich_thuoc' => 'required|in:nam,nu,tre_em',
        ]);

        $validator->after(function ($validator) use ($request) {
            $exists = BienTheKichThuoc::where('kich_thuoc', $request->kich_thuoc)
                ->where('loai_kich_thuoc', $request->loai_kich_thuoc)
                ->exists();

            if ($exists) {
                $validator->errors()->add('kich_thuoc', 'Kích thước đã tồn tại cho loại này.');
            }

            if ($request->loai_kich_thuoc === 'nu' && !in_array($request->kich_thuoc, ['XS', 'S', 'M', 'L', 'XL', 'XXL'])) {
                $validator->errors()->add('kich_thuoc', 'Kích thước cho nữ chỉ được phép từ XS đến XXL.');
            } elseif ($request->loai_kich_thuoc === 'nam' && !in_array($request->kich_thuoc, ['S', 'M', 'L', 'XL', 'XXL'])) {
                $validator->errors()->add('kich_thuoc', 'Kích thước cho nam chỉ được phép từ S đến XXL.');
            } elseif ($request->loai_kich_thuoc === 'tre_em' && (!is_numeric($request->kich_thuoc) || $request->kich_thuoc < 1 || $request->kich_thuoc > 9)) {
                $validator->errors()->add('kich_thuoc', 'Kích thước cho trẻ em phải là số từ 1 đến 9.');
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
            'kich_thuoc' => 'required|string|max:255',
            'loai_kich_thuoc' => 'required|in:nam,nu,tre_em',
        ]);

        $validator->after(function ($validator) use ($request, $id) {
            $exists = BienTheKichThuoc::where('kich_thuoc', $request->kich_thuoc)
                ->where('loai_kich_thuoc', $request->loai_kich_thuoc)
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                $validator->errors()->add('kich_thuoc', 'Kích thước đã tồn tại cho loại này.');
            }
            if ($request->loai_kich_thuoc === 'nu' && !in_array($request->kich_thuoc, ['XS', 'S', 'M', 'L', 'XL', 'XXL'])) {
                $validator->errors()->add('kich_thuoc', 'Kích thước cho nữ chỉ được phép từ XS đến XXL.');
            }
            elseif ($request->loai_kich_thuoc === 'nam' && !in_array($request->kich_thuoc, ['S', 'M', 'L', 'XL', 'XXL'])) {
                $validator->errors()->add('kich_thuoc', 'Kích thước cho nam chỉ được phép từ S đến XXL.');
            }
            elseif ($request->loai_kich_thuoc === 'tre_em' && (!is_numeric($request->kich_thuoc) || $request->kich_thuoc < 1 || $request->kich_thuoc > 9)) {
                $validator->errors()->add('kich_thuoc', 'Kích thước cho trẻ em phải là số từ 1 đến 9.');
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
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Xóa dữ liệu thất bại',
            ], 500);
        }
    }
}
