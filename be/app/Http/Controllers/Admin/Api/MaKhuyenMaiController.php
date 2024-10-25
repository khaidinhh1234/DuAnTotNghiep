<?php

namespace App\Http\Controllers\Admin\Api;

use App\Events\MaKhuyenMaiCreated;
use App\Events\UserNotification;
use App\Events\VoucherCreated;
use App\Http\Controllers\Controller;
use App\Models\MaKhuyenMai;
use App\Models\SanPham;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
            $data = MaKhuyenMai::with(['sanPhams', 'hangThanhViens', 'danhMucs'])
                ->orderByDesc('id')
                ->get();

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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ma_code' => 'required|string|max:255|unique:ma_khuyen_mais,ma_code',
            'mo_ta' => 'string|unique:ma_khuyen_mais,mo_ta',
            'loai' => 'required|string|in:phan_tram,tien_mat',
            'ngay_bat_dau_suu_tam' => 'required|date',
            'ngay_bat_dau' => 'required|date|before:ngay_ket_thuc',
            'ngay_ket_thuc' => 'required|date|after:ngay_bat_dau',
            'so_luong' => 'required|integer',
            'giam_gia' => 'required|numeric',
            'chi_tieu_thoi_thieu' => 'nullable|numeric',
            'khuyen_mai_san_pham' => 'nullable|array',
            'khuyen_mai_danh_muc' => 'nullable|array',
            'hang_thanh_vien' => 'required|array'
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
            $dataKhuyenMaiSanPham = $request->khuyen_mai_san_pham;
            $dataKhuyenMaiDanhMuc = $request->khuyen_mai_danh_muc;

            if (!empty($dataKhuyenMaiSanPham)) {
                $sanPhamNames = DB::table('san_phams')->whereIn('id', $dataKhuyenMaiSanPham)->pluck('ten_san_pham')->toArray();
                $apDungText = 'Áp dụng cho sản phẩm: ' . implode(', ', $sanPhamNames);
            } elseif (!empty($dataKhuyenMaiDanhMuc)) {
                $danhMucNames = DB::table('danh_mucs')->whereIn('id', $dataKhuyenMaiDanhMuc)->pluck('ten_danh_muc')->toArray();
                $apDungText = 'Áp dụng cho danh mục: ' . implode(', ', $danhMucNames);
            } else {
                $apDungText = 'Áp dụng cho tất cả sản phẩm';
            }

            $dataMaKhuyenMai['ap_dung'] = $apDungText;

            $maKhuyenMai = MaKhuyenMai::create($dataMaKhuyenMai);

            if (!empty($dataKhuyenMaiDanhMuc)) {
                $maKhuyenMai->danhMucs()->sync($dataKhuyenMaiDanhMuc);
            } else {
                if (empty($dataKhuyenMaiSanPham)) {
                    $sanPhamIds = DB::table('san_phams')->pluck('id')->toArray();
                    $dataKhuyenMaiSanPham = $sanPhamIds;
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




    public function show(string $id)
    {
        try {
            $maKhuyenMai = MaKhuyenMai::with(['sanPhams', 'hangThanhViens', 'danhMucs'])->findOrFail($id);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu mã khuyến mãi thành công',
                'data' => $maKhuyenMai
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy mã khuyến mãi',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lỗi xảy ra khi lấy dữ liệu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'so_luong' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $maKhuyenMai = MaKhuyenMai::findOrFail($id);
            $dataMaKhuyenMai = $request->except('khuyen_mai_san_pham');

            if (!$maKhuyenMai->update($dataMaKhuyenMai)) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'status_code' => 500,
                    'message' => 'Cập nhật mã khuyến mãi không thành công',
                ], 500);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Đã cập nhật mã khuyến mãi thành công',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy mã khuyến mãi',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi trong quá trình cập nhật dữ liệu',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy mã khuyến mãi',
                'error' => $e->getMessage()
            ], 404);
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
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $maKhuyenMai,
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

    public function khoiPhucMaKhuyenMai(int $id)
    {
        try {
            $maKhuyenMai = MaKhuyenMai::withTrashed()->findOrFail($id);
            $maKhuyenMai->restore();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Khôi phục thành công',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy mã khuyến mãi',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function kichHoatMaKhuyenMai($id)
    {
        try {
            MaKhuyenMai::findOrFail($id)->update(['trang_thai' => 1]);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Kích hoạt mã khuyến mãi thành công',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy mã khuyến mãi',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Kích hoạt mã khuyến mãi thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function huyKichHoatMaKhuyenMai($id)
    {
        try {
            MaKhuyenMai::findOrFail($id)->update(['trang_thai' => 0]);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Hủy kích hoạt mã khuyến mãi thành công',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy mã khuyến mãi',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Hủy kích hoạt mã khuyến mãi thất bại',
                'error' => $e->getMessage()
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
}

