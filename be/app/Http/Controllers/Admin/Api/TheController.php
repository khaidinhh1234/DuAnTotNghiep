<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\The;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TheController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = The::query()->orderByDesc('id')->get();
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
            ];
            return response()->json($json, 500);
        }
    }

    /**
     * Show the form for creating a new resource.
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
                'ten_the' => 'required|string|max:255|unique:thes,ten_the',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            $data['duong_dan'] = Str::slug($data['ten_the']);

            The::create($data);

            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Thêm dữ liệu thành công',
            ];

            return response()->json($json, 200);

        } catch (\Exception $e) {
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

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ten_the' => 'required|string|max:255|unique:thes,ten_the',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            $data['duong_dan'] = Str::slug($data['ten_the']);

            The::query()->where('id', $id)->update($data);

            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật dữ liệu thành công',
            ];

            return response()->json($json, 200);

        } catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Cập nhật dữ liệu thất bại',
                'error' => $e->getMessage(),
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
            The::query()->where('id', $id)->delete();
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

    public function danhSachTheDaXoa()
    {
        try {
            $data = The::onlyTrashed()->get();
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

    public function khoiPhucThe($id)
    {
        try {
            The::onlyTrashed()->where('id', $id)->restore();
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
