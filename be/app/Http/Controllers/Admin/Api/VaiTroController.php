<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVaiTroRequest;
use App\Http\Requests\UpdateVaiTroRequest;
use App\Models\Quyen;
use App\Models\VaiTro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

class VaiTroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = VaiTro::query()->with('quyens')->orderByDesc('id')->get();
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
            foreach ($request->ten_quyen ?? [] as $ten_quyen) {
                $quyen = Quyen::updateOrCreate([
                    'ten_quyen' => $ten_quyen
                ]);
                $vaiTro->quyens()->attach($quyen->id);
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
            $vaiTro = VaiTro::query()->with('quyens')->findOrFail($id);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $vaiTro
            ], 200);
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
            $vaiTro = VaiTro::query()->with('quyens')->findOrFail($id);
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
            $vaiTro->quyens()->sync($quyen_id);
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

            $vaiTro->quyens()->sync([]);
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

    // public function danhSachVaiTroDaXoa()
    // {
    //     try {
    //         $vaiTro = VaiTro::onlyTrashed()->orderByDesc('deleted_at')->get();

    //         return response()->json([
    //             'status' => true,
    //             'status_code' => 200,
    //             'message' => 'Lấy dữ liệu thành công.',
    //             'data' => $vaiTro,
    //         ], 200);
    //     } catch (\Exception $exception) {
    //         return response()->json([
    //             'status' => false,
    //             'status_code' => 500,
    //             'message' => 'Lấy dữ liệu thất bại!',
    //             'error' => $exception->getMessage()
    //         ], 500);
    //     }
    // }
    // public function khoiPhucVaiTro(string $id)
    // {
    //     try {
    //         DB::beginTransaction();
    //         $vaiTro = VaiTro::onlyTrashed()->findOrFail($id);
    //         $vaiTro->restore();
    //         DB::commit();
    //         return response()->json([
    //             'status' => true,
    //             'status_code' => 200,
    //             'message' => 'Khôi phục vai trò thành công',
    //         ], 200);
    //     } catch (\Exception $exception) {
    //         DB::rollBack();
    //         return response()->json([
    //             'status' => false,
    //             'status_code' => 500,
    //             'message' => 'Khôi phục vai trò thất bại',
    //             'error' => $exception->getMessage()
    //         ], 500);
    //     }
    // }


    public function danhSachQuyen()
    {
        function convertPermissionToText($permission)
        {
            $mapping = [
                'index' => 'Quản lý',
                'store' => 'Thêm',
                'show' => 'Chi tiết',
                'update' => 'Cập nhật',
                'destroy' => 'Xóa',
                'thungrac' => 'Thùng rác',
                'khoiphuc' => 'Khôi phục',
                'kichhoat' => 'Kích hoạt',
                'huykichhoat' => 'Hủy kích hoạt',
                'thongbao' => 'Thông báo',
                'tttt' => 'Trạng thái thanh toán',
                'ttdh' => 'Trạng thái',
                'ttvc' => 'Trạng thái',
                'danhmuc' => 'danh mục',
                'sanpham' => 'sản phẩm',
                'bosuutap' => 'Bộ sưu tập',
                'vaitro' => 'vai trò',
                'lienhe' => 'liên hệ',
                'phanhoi' => 'Phản hồi',
                'chuongtrinhuudai' => 'chương trình ưu đãi',
                'thongtinweb' => 'thông tin website',
                'danhmuctintuc' => 'danh mục tin tức',
                'tintuc' => 'tin tức',
                'bill' => 'Hóa đơn',
                'export' => 'Xuất file',
                'makhuyenmai' => 'mã khuyến mãi',
                'taikhoan' => 'tài khoản',
                'donhang' => 'đơn hàng',
                'vanchuyen' => 'vận chuyển',
                'bienthekichthuoc' => 'biến thể kích thước',
                'bienthemausac' => 'biến thể màu sắc',
                'hangthanhvien' => 'hạng thành viên',
                'xacnhan' => 'Xác nhận',
                'bulk-delete' => 'Xóa nhiều',
                'update-status' => 'Cập nhật trạng thái nhiều',
                'sanphamchuaco' => 'Sản phẩm chưa có',
                'bulk-restore' => 'Khôi phục nhiều',
            ];

            $key = explode('.', $permission);
            $lastKey = end($key);

            return isset($mapping[$lastKey]) ? $mapping[$lastKey] . ' ' .  $mapping[$key[1]] : $permission;
        }

        $routeList = [];
        $currentParent = null;

        foreach (Route::getRoutes() as $route) {
            $name = $route->getName();

            if (!$name || strpos($name, 'admin') === false || $name === 'admin.') {
                continue;
            }

            $newText = convertPermissionToText($name);
            $key = explode('.', $name);
            $index = end($key);

            if ($index === 'index' || (isset($key[1]) && $key[1] == 'thong-ke')) {
                if ($currentParent) {
                    $routeList[] = $currentParent;
                }

                $currentParent = [
                    "title" => $newText,
                    "key" => $name,
                    "children" => []
                ];
            } else {
                if ($currentParent) {
                    $currentParent['children'][] = [
                        "title" => $newText,
                        "key" => $name,
                    ];
                }
            }
        }

        if ($currentParent) {
            $routeList[] = $currentParent;
        }

        return response()->json([
            'data' => $routeList
        ], 200);
    }
}
