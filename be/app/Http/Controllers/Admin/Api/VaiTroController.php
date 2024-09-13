<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVaiTroRequest;
use App\Http\Requests\UpdateVaiTroRequest;
use App\Models\Quyen;
use App\Models\VaiTro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VaiTroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = VaiTro::query()->with('quyen')->orderByDesc('id')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data,
            ], 200);
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
    public function store(StoreVaiTroRequest $request)
    {
        try {
            DB::beginTransaction();
            $vaiTro = VaiTro::create([
                'ten_vai_tro' => $request->ten_vai_tro,
                'mo_ta' => $request->mo_ta
            ]);
            foreach ($request->ten_quyen as $ten_quyen) {
                $quyen = Quyen::updateOrCreate([
                    'ten_quyen' => $ten_quyen
                ]);
                $vaiTro->quyen()->attach($quyen->id);
            }

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Vai trò được tạo thành công.',
                'data' => $vaiTro,
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi tạo vai trò.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $vaiTro = VaiTro::query()->with('quyen')->findOrFail($id);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $vaiTro
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVaiTroRequest $request, string $id)
    {
        try {
            DB::beginTransaction();
            $quyen_id = [];
            $vaiTro = VaiTro::query()->with('quyen')->findOrFail($id);
            $vaiTro->update([
                'ten_vai_tro' => $request->ten_vai_tro,
                'mo_ta' => $request->mo_ta
            ]);
            foreach ($request->ten_quyen ?? [] as $ten_quyen) {
                $quyen = Quyen::updateOrCreate([
                    'ten_quyen' => $ten_quyen,
                ]);
                array_push($quyen_id, $quyen->id);
            }
            $vaiTro->quyen()->sync($quyen_id);
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Vai trò được cập nhật thành công.',
                'data' => $vaiTro
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi cập nhật vai trò.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();
            $vaiTro = VaiTro::query()->findOrFail($id);

            $vaiTro->quyen()->sync([]);
            $vaiTro->delete();

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Vai trò đã được xóa thành công.'
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Xóa vai trò thất bại!',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function danhSachVaiTroDaXoa()
    {
        try {
            $vaiTro = VaiTro::onlyTrashed()->orderByDesc('deleted_at')->get();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $vaiTro,
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại!',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
    public function khoiPhucVaiTro(int $id)
    {
        try {
            DB::beginTransaction();
            $vaiTro = VaiTro::onlyTrashed()->findOrFail($id);
            $vaiTro->restore();
            DB::commit();
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Khôi phục vai trò thành công',
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Khôi phục vai trò thất bại',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
