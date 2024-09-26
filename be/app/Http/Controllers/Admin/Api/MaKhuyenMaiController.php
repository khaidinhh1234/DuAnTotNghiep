<?php

namespace App\Http\Controllers\Admin\Api;

use App\Events\UserNotification;
use App\Http\Controllers\Controller;
use App\Models\MaKhuyenMai;
use App\Models\SanPham;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MaKhuyenMaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = MaKhuyenMai::query()->with(['sanPhams', 'hangThanhViens','danhMucs'])->orderByDesc('id')->get();
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
                'message' => 'Lỗi xảy ra khi lấy dữ liệu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ma_code'              => 'required|string|max:255|unique:ma_khuyen_mais,ma_code',
            'mo_ta'                => 'string|unique:ma_khuyen_mais,mo_ta',
            'loai'                 => 'required|string|in:phan_tram,tien_mat',
            'ngay_bat_dau_suu_tam' => 'required|date',
            'ngay_bat_dau'         => 'required|date|before:ngay_ket_thuc',
            'ngay_ket_thuc'        => 'required|date',
            'so_luong'             => 'required|integer',
            'giam_gia'             => 'required|numeric',
            'chi_tieu_thoi_thieu'  => 'nullable|numeric',
            'khuyen_mai_san_pham'  => 'nullable|array',
            'khuyen_mai_danh_muc'  => 'nullable|array',
            'hang_thanh_vien'      => 'required|array'
        ]);

        $validator->after(function ($validator) use ($request) {
            if ($request->loai === 'phan_tram' && $request->giam_gia > 50) {
                $validator->errors()->add('giam_gia', 'Giá trị giảm giá không được lớn hơn 50% nếu loại là phần trăm.');
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();
            $dataMaKhuyenMai = $request->except(['khuyen_mai_san_pham', 'khuyen_mai_danh_muc']);
            $maKhuyenMai = MaKhuyenMai::create($dataMaKhuyenMai);

            $dataKhuyenMaiSanPham = $request->khuyen_mai_san_pham;
            $dataKhuyenMaiDanhMuc = $request->khuyen_mai_danh_muc;

            if (!empty($dataKhuyenMaiDanhMuc)) {
                $maKhuyenMai->danhMucs()->sync($dataKhuyenMaiDanhMuc);
            } else {
                if (empty($dataKhuyenMaiSanPham)) {
                    $sanPhamIds = DB::table('san_phams')->pluck('id')->toArray(); // Lấy danh sách id sản phẩm
                    $dataKhuyenMaiSanPham = $sanPhamIds;  // Gán toàn bộ sản phẩm vào khuyến mãi
                }
                $maKhuyenMai->sanPhams()->sync($dataKhuyenMaiSanPham);
            }
            $maKhuyenMai->hangThanhViens()->sync($request->hang_thanh_vien);

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Đã lưu mã khuyến mãi thành công',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi trong quá trình lưu dữ liệu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $maKhuyenMai = MaKhuyenMai::query()->with(['sanPhams', 'hangThanhViens','danhMucs'])->findOrFail($id);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu mã khuyến mãi thành công',
                'data' => $maKhuyenMai
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy mã khuyến mãi',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'mo_ta'                => 'nullable|string',
            'so_luong'             => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        try {
            DB::beginTransaction();
            $maKhuyenMai = MaKhuyenMai::findOrFail($id);
            $dataMaKhuyenMai = $request->except('khuyen_mai_san_pham');
            $maKhuyenMai->update($dataMaKhuyenMai);

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Đã cập nhật mã khuyến mãi thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi trong quá trình cập nhật dữ liệu',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $maKhuyenMai = MaKhuyenMai::findOrFail($id);
            $maKhuyenMai->delete();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Xóa mềm mã khuyến mãi thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi xóa mềm mã khuyến mãi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function danhSachMaKhuyenMaiDaXoa()
    {
        try {
            $maKhuyenMai = MaKhuyenMai::onlyTrashed()->orderByDesc('deleted_at')->get();
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $maKhuyenMai,
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function khoiPhucMaKhuyenMai(int $id)
    {
        try {
            $maKhuyenMai = MaKhuyenMai::withTrashed()->findOrFail($id);
            $maKhuyenMai->restore();
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Khôi phục thành công',
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function guiThongBao(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ma_code' => 'required|string|max:255'
        ]);

        if ($validator->failed()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();
            $users = User::query()->whereHas('vaiTros', function ($query) {
                $query->where('ten_vai_tro', 'member');
            })->get();
            $maKhuyenMai = MaKhuyenMai::query()->where('ma_code', $request->ma_code)->first();
            foreach ($users as $user) {
                broadcast(new UserNotification($maKhuyenMai))->toOthers();
            }
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Gửi thông báo thành công.'
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi trong quá trình gửi thông báo',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function kichHoatMaKhuyenMai($id)
    {
        try {
            MaKhuyenMai::query()->findOrFail($id)->update(['trang_thai' => 1]);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Kích hoạt mã khuyến mãi thành công',
            ];
            return response()->json($json, 200);
        }catch (\Exception $exception) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Kích hoạt mã khuyến mãi thất bại',
                'error' => $exception->getMessage()
            ];
            return response()->json($json, 500);
        }
    }

    public function huyKichHoatMaKhuyenMai($id)
    {
        try {
            MaKhuyenMai::query()->findOrFail($id)->update(['trang_thai' => 0]);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Huỷ kích hoạt mà khuyến mãi',
            ];
            return response()->json($json, 200);
        }catch (\Exception $exception) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Huỷ kích hoạt mà khuyến mãi',
                'error' => $exception->getMessage()
            ];
            return response()->json($json, 500);
        }
    }
}