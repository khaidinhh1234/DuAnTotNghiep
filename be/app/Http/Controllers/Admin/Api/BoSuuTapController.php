<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\BoSuuTap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BoSuuTapController extends Controller
{
    /**
     * Display a listing of BoSuuTap resource.
     */
    public function index()
    {
        try {
            $data = BoSuuTap::query()->orderByDesc('id')->get();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data
            ];

            return response()->json($json, 200);
        }catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
                'error' => $e->getMessage(),
            ];
            return response()->json($json, 500);
        }
    }

    public function getBoSuuTapSanPham()
    {
        $data = BoSuuTap::query()->with('sanPhams')->orderByDesc('id')->get();
        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data
        ], 200);
    }

    /**
     * Show BoSuuTap form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ten' => 'required|string|max:255|unique:bo_suu_taps,ten',
                'duong_dan_anh' => 'required|string|max:255',
                'san_pham' => 'array',
                'san_pham.*' => 'integer',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            $data['duong_dan'] = Str::slug($data['ten']);
            DB::beginTransaction();
            $boSuuTap = BoSuuTap::create($data);
            $boSuuTap->sanPhams()->sync($request->san_pham);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Thêm dữ liệu thành công',
            ];

            DB::commit();
            return response()->json($json, 200);

        } catch (\Exception $e) {
            DB::rollBack();
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Thêm dữ liệu thất bại',
                'error' => $e->getMessage(),
            ];

            return response()->json($json, 500);
        }
    }


    /**
     * Display BoSuuTap specified resource.
     */
    public function show(string $id)
    {
        try {
            $data = BoSuuTap::query()->where('id', $id)->first();
            $data['san_pham'] = $data->sanPhams;
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data
            ];

            return response()->json($json, 200);
        }catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
                'error' => $e->getMessage(),
            ];

            return response()->json($json, 500);
        }
    }

    /**
     * Show BoSuuTap form for editing BoSuuTap specified resource.
     */
    public function edit(string $id)
    {

    }

    /**
     * Update BoSuuTap specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ten' => 'required|string|max:255|unique:bo_suu_taps,ten,' . $id,
                'duong_dan_anh' => 'required|string|max:255',
                'san_pham' => 'array',
                'san_pham.*' => 'integer',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $boSuuTap = BoSuuTap::find($id);
            if (!$boSuuTap) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Bộ sưu tập không tồn tại',
                ], 404);
            }

            $data = $request->all();
            $data['duong_dan'] = Str::slug($data['ten']);

            DB::beginTransaction();
            $boSuuTap->update($data);

            if ($request->has('san_pham')) {
                $boSuuTap->sanPhams()->sync($request->san_pham);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật dữ liệu thành công',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Cập nhật dữ liệu thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Remove BoSuuTap specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            BoSuuTap::query()->where('id', $id)->delete();
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
                'error' => $e->getMessage(),
            ];
            return response()->json($json, 500);
        }
    }

    public function danhSachBoSuuTapDaXoa()
    {
        try {
            $data = BoSuuTap::onlyTrashed()->get();
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
                'message' => 'Lấy dữ liệu thất bị',
                'error' => $e->getMessage()
            ];
            return response()->json($json, 500);
        }
    }

    public function khoiPhucBoSuuTap($id)
    {
        try {
            BoSuuTap::onlyTrashed()->where('id', $id)->restore();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Khôi phục thành công'
            ];
            return response()->json($json, 200);
        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Khôi phục thất bại',
                'error' => $e->getMessage()
            ];
            return response()->json($json, 500);
        }
    }
}
