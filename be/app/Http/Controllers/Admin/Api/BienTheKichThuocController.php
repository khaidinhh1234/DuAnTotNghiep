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
    public function show(string $id)
    {
        try {
            $data = BienTheKichThuoc::findOrFail($id);
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kich_thuoc' => 'required|string|max:255',
            'loai_kich_thuoc' => 'required|in:nam,nu,tre_em',
            'chieu_cao_toi_thieu' => 'nullable|integer|min:0',
            'chieu_cao_toi_da' => 'nullable|integer|min:0',
            'can_nang_toi_thieu' => 'nullable|integer|min:0',
            'can_nang_toi_da' => 'nullable|integer|min:0',
        ]);

        $data = $request->all();
        $data['kich_thuoc'] = strtoupper($request->kich_thuoc);

        $validator->after(function ($validator) use ($data) {
            $exists = BienTheKichThuoc::where('kich_thuoc', $data['kich_thuoc'])
                ->where('loai_kich_thuoc', $data['loai_kich_thuoc'])
                ->exists();

            if ($exists) {
                $validator->errors()->add('kich_thuoc', 'Kích thước đã tồn tại cho loại này.');
            }

            $overlapCheck = BienTheKichThuoc::where('loai_kich_thuoc', $data['loai_kich_thuoc'])
                ->where(function ($query) use ($data) {
                    $query->whereBetween('chieu_cao_toi_thieu', [$data['chieu_cao_toi_thieu'], $data['chieu_cao_toi_da']])
                        ->orWhereBetween('chieu_cao_toi_da', [$data['chieu_cao_toi_thieu'], $data['chieu_cao_toi_da']])
                        ->orWhere(function ($subQuery) use ($data) {
                            $subQuery->where('chieu_cao_toi_thieu', '<=', $data['chieu_cao_toi_thieu'])
                                ->where('chieu_cao_toi_da', '>=', $data['chieu_cao_toi_da']);
                        });
                })
                ->orWhere(function ($query) use ($data) {
                    $query->whereBetween('can_nang_toi_thieu', [$data['can_nang_toi_thieu'], $data['can_nang_toi_da']])
                        ->orWhereBetween('can_nang_toi_da', [$data['can_nang_toi_thieu'], $data['can_nang_toi_da']])
                        ->orWhere(function ($subQuery) use ($data) {
                            $subQuery->where('can_nang_toi_thieu', '<=', $data['can_nang_toi_thieu'])
                                ->where('can_nang_toi_da', '>=', $data['can_nang_toi_da']);
                        });
                })
                ->exists();

            if ($overlapCheck) {
                $validator->errors()->add('chieu_cao', 'Khoảng chiều cao hoặc cân nặng đã tồn tại cho loại này.');
            }

            if ($data['chieu_cao_toi_thieu'] && $data['chieu_cao_toi_da']) {
                if ($data['chieu_cao_toi_thieu'] > $data['chieu_cao_toi_da']) {
                    $validator->errors()->add('chieu_cao', 'Chiều cao tối thiểu phải nhỏ hơn chiều cao tối đa.');
                }
            }

            if ($data['can_nang_toi_thieu'] && $data['can_nang_toi_da']) {
                if ($data['can_nang_toi_thieu'] > $data['can_nang_toi_da']) {
                    $validator->errors()->add('can_nang', 'Cân nặng tối thiểu phải nhỏ hơn cân nặng tối đa.');
                }
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
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

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'kich_thuoc' => 'required|string|max:255',
            'loai_kich_thuoc' => 'required|in:nam,nu,tre_em',
            'chieu_cao_toi_thieu' => 'nullable|integer|min:0',
            'chieu_cao_toi_da' => 'nullable|integer|min:0',
            'can_nang_toi_thieu' => 'nullable|integer|min:0',
            'can_nang_toi_da' => 'nullable|integer|min:0',
        ]);

        $data = $request->all();
        $data['kich_thuoc'] = strtoupper($request->kich_thuoc);

        $validator->after(function ($validator) use ($data, $id) {
            $exists = BienTheKichThuoc::where('kich_thuoc', $data['kich_thuoc'])
                ->where('loai_kich_thuoc', $data['loai_kich_thuoc'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                $validator->errors()->add('kich_thuoc', 'Kích thước đã tồn tại cho loại này.');
            }

            $overlapCheck = BienTheKichThuoc::where('loai_kich_thuoc', $data['loai_kich_thuoc'])
                ->where('id', '!=', $id)
                ->where(function ($query) use ($data) {
                    $query->whereBetween('chieu_cao_toi_thieu', [$data['chieu_cao_toi_thieu'], $data['chieu_cao_toi_da']])
                        ->orWhereBetween('chieu_cao_toi_da', [$data['chieu_cao_toi_thieu'], $data['chieu_cao_toi_da']])
                        ->orWhere(function ($subQuery) use ($data) {
                            $subQuery->where('chieu_cao_toi_thieu', '<=', $data['chieu_cao_toi_thieu'])
                                ->where('chieu_cao_toi_da', '>=', $data['chieu_cao_toi_da']);
                        });
                })
                ->orWhere(function ($query) use ($data) {
                    $query->whereBetween('can_nang_toi_thieu', [$data['can_nang_toi_thieu'], $data['can_nang_toi_da']])
                        ->orWhereBetween('can_nang_toi_da', [$data['can_nang_toi_thieu'], $data['can_nang_toi_da']])
                        ->orWhere(function ($subQuery) use ($data) {
                            $subQuery->where('can_nang_toi_thieu', '<=', $data['can_nang_toi_thieu'])
                                ->where('can_nang_toi_da', '>=', $data['can_nang_toi_da']);
                        });
                })
                ->exists();

            if ($overlapCheck) {
                $validator->errors()->add('chieu_cao', 'Khoảng chiều cao hoặc cân nặng đã tồn tại cho loại này.');
            }

            if ($data['chieu_cao_toi_thieu'] && $data['chieu_cao_toi_da']) {
                if ($data['chieu_cao_toi_thieu'] > $data['chieu_cao_toi_da']) {
                    $validator->errors()->add('chieu_cao', 'Chiều cao tối thiểu phải nhỏ hơn chiều cao tối đa.');
                }
            }

            if ($data['can_nang_toi_thieu'] && $data['can_nang_toi_da']) {
                if ($data['can_nang_toi_thieu'] > $data['can_nang_toi_da']) {
                    $validator->errors()->add('can_nang', 'Cân nặng tối thiểu phải nhỏ hơn cân nặng tối đa.');
                }
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
            $bienTheKichThuoc->update($data);
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

    public function danhSachXoaMem(){
        try {
            $data = BienTheKichThuoc::query()->onlyTrashed()->get();
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
            $bienTheMauSac = BienTheKichThuoc::onlyTrashed()->find($id);
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
