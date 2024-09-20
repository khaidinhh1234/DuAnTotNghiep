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
                'index' => 'Danh sách',
                'store' => 'Thêm',
                'show' => 'Chi tiết',
                'update' => 'Cập nhật',
                'destroy' => 'Xóa',
                'thungrac' => 'Thùng rác',
                'khoiphuc' => 'Khôi phục',
                'thongbao' => 'Thông báo',
                'tttt' => 'Trạng thái thanh toán',
                'ttdh' => 'Trạng thái đơn hàng',
                'danhmuc' => 'danh mục',
                'sanpham' => 'sản phẩm',
                'the' => 'thẻ',
                'vaitro' => 'vai trò',
                'thongtinweb' => 'thông tin website',
                'danhmuctintuc' => 'danh mục tin tức',
                'tintuc' => 'tin tức',
                'makhuyenmai' => 'mã khuyến mãi',
                'taikhoan' => 'tài khoản',
                'donhang' => 'đơn hàng',
                'bienthekichthuoc' => 'biến thể kích thức',
                'bienthemausac' => 'biến thể màu sắc',
                'thong-ke' => 'Thống kê',
                'doanh-thu-ngay' => 'doanh thu theo ngày',
                'doanh-thu-tuan' => 'doanh thu theo tuần',
                'doanh-thu-thang' => 'doanh thu theo tháng',
                'doanh-thu-quy' => 'doanh thu theo quý',
                'doanh-thu-nam' => 'doanh thu theo năm',
                'doanh-thu-san-pham' => 'doanh thu theo sản phẩm',
                'doanh-thu-danh-muc' => 'doanh thu theo danh mục',
                'doanh-thu-so-sanh' => 'doanh thu so sánh',
                'don-hang-theo-trang-thai' => 'doanh thu theo trạng thái đơn hàng',
                'san-pham-ban-theo-thang' => 'doanh thu sản phẩm bán theo tháng',
                'san-pham-ban-theo-nam' => 'doanh thu sản phẩm bán theo năm',
            ];

            $key = explode('.', $permission);
            $lastKey = end($key);

            if (isset($mapping[$lastKey])) {
                return $mapping[$lastKey] . ' ' .  $mapping[$key[1]];
            }
            return $permission;
        }

        $routeList = [];
        $routeNames = Route::getRoutes();
        foreach ($routeNames as $route) {
            $name = $route->getName();
            $pos = strpos($name, 'admin');
            $newText = convertPermissionToText($route->getName());
            if ($pos !== false && $name !== 'admin.') {
                array_push($routeList, [
                    'name' => $newText,
                    'key' => $name
                ]);
            }
            // $filteredPermissions = array_diff($routeList, ['admin.']);
        }
        return response()->json([
            'data' => $routeList
        ], 200);
    }
}
