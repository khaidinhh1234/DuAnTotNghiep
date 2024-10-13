<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaiKhoanRequest;
use App\Http\Requests\UpdateTaiKhoanRequest;
use App\Models\HangThanhVien;
use App\Models\User;
use App\Models\VaiTro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaiKhoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            DB::beginTransaction();
            $data = User::query()->with('vaiTros', 'hangThanhVien')->whereNot('id', Auth::guard('api')->id())->orderBy('id', 'desc')->get();
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'data' => $data
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaiKhoanRequest $request)
    {
        try {
            DB::beginTransaction();

            //Lấy ra hạng thành viên thấp nhất
            $hangThanhVien = HangThanhVien::query()->where('chi_tieu_toi_thieu', 0)->first();
            if ($hangThanhVien == []) {
                $hangThanhVien = HangThanhVien::create([
                    'ten_hang_thanh_vien' => 'Thành viên mới',
                    'anh_hang_thanh_vien' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1728635543/game-level-icons-medals-stars-ui-badges-trophy_jxsnoo.png',
                    'chi_tieu_toi_thieu' => 0,
                    'chi_tieu_toi_da' => 500000,
                    'mo_ta' => 'Thành viên mới'
                ]);
            }

            $taiKhoan = User::create([
                'ho' => $request->ho,
                'ten' => $request->ten,
                'anh_nguoi_dung' => 'https://i.pinimg.com/originals/f3/d1/ed/f3d1edf10d63c40e1fa06364176fa502.png',
                'email' => $request->email,
                'password' => $request->password,
                'so_dien_thoai' => $request->so_dien_thoai,
                'dia_chi' => $request->dia_chi,
                'ngay_sinh' => $request->ngay_sinh,
                'gioi_tinh' => $request->gioi_tinh,
                'hang_thanh_vien_id' => $hangThanhVien->id
            ]);

            if ($request->vai_tros == []) {
                $member = VaiTro::query()->where('ten_vai_tro', operator: 'Khách hàng')->first();
                if ($member == []) {
                    $member = VaiTro::updateOrCreate(
                        [
                            'ten_vai_tro' => 'Khách hàng',
                            'mo_ta' => 'Khách hàng'
                        ]
                    );
                }
                $taiKhoan->vaiTros()->attach($member->id);
            } else {
                foreach ($request->vai_tros ?? [] as $vaiTro) {
                    $vaiTro_id = VaiTro::query()->where('ten_vai_tro', $vaiTro)->pluck('id');
                    $taiKhoan->vaiTros()->attach($vaiTro_id);
                }
            }
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Tài khoản được tạo thành công.',
                'data' => $taiKhoan
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
            // $quyen = [];
            $taiKhoan = User::query()->with('vaiTros', 'hangThanhVien', 'danhGias', 'donHangs', 'sanPhamYeuThich')->findOrFail($id);
            $tongTienDonhangThanhCong = $taiKhoan->donHangs()->where('trang_thai_don_hang', 'Giao hàng thành công')->where('trang_thai_thanh_toan', 'Đã thanh toán')->sum('tong_tien_don_hang');

            // $quyen = $taiKhoan->vaiTros->flatMap(function ($vaiTro) {
            //     return $vaiTro->quyens->pluck('ten_quyen');
            // })->unique()->values()->all();

            $data = [
                'tai_khoan' => $taiKhoan,
                // 'quyen' => $quyen,
                'tong_tien_don_hang' => (int)$tongTienDonhangThanhCong,
                'so_luong_danh_gia' => count($taiKhoan->danhGias),
                'so_luong_don_hang' => count($taiKhoan->donHangs),
                'so_luong_yeu_thich' => count($taiKhoan->sanPhamYeuThich)
            ];
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'data' => $data
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaiKhoanRequest $request, User $taikhoan)
    {
        try {
            DB::beginTransaction();

            $taiKhoan = User::with('vaiTros')->findOrFail($taikhoan->id);

            $taiKhoan->update([
                'ho' => $request->ho,
                'ten' => $request->ten,
                'anh_nguoi_dung' => $request->anh_nguoi_dung ?? 'https://i.pinimg.com/originals/f3/d1/ed/f3d1edf10d63c40e1fa06364176fa502.png',
                'so_dien_thoai' => $request->so_dien_thoai,
                'dia_chi' => $request->dia_chi,
                'ngay_sinh' => $request->ngay_sinh,
                'gioi_tinh' => $request->gioi_tinh,
                'hang_thanh_vien_id' => $request->hang_thanh_vien_id ?? 1
            ]);

            $vaiTro_id = [];
            if (empty($request->vai_tros)) {
                $member = VaiTro::firstOrCreate(
                    ['ten_vai_tro' => 'Khách hàng'],
                    ['mo_ta' => 'Khách hàng']
                );
                $vaiTro_id[] = $member->id;
            } else {
                $vaiTro_id = VaiTro::whereIn('ten_vai_tro', $request->vai_tros)->pluck('id')->toArray();
            }
            $taiKhoan->vaiTros()->sync($vaiTro_id);

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Tài khoản được cập nhật thành công.',
                'data' => $taiKhoan
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi cập nhật tài khoản.',
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
            $taiKhoan = User::query()->findOrFail($id);
            $taiKhoan->vaiTros()->sync([]);

            $taiKhoan->delete();
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Tài khoản đã bị block.'
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Xóa tài khoản thất bại!',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function danhSachTaiKhoanDaXoa()
    {
        try {
            $taiKhoan = User::onlyTrashed()->orderByDesc('deleted_at')->get();
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'data' => $taiKhoan,
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

    public function khoiPhucTaiKhoan(string $id)
    {
        try {
            DB::beginTransaction();
            $taiKhoan = User::onlyTrashed()->findOrFail($id);
            $taiKhoan->restore();
            $member = VaiTro::query()->where('ten_vai_tro',  'Khách hàng')->first();
            $taiKhoan->vaiTros()->attach($member->id);
            DB::commit();
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Khôi phục tài khoản thành công',
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Khôi phục tài khoản bị block thất bại',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function danhSachVaiTro()
    {
        $allRole = VaiTro::query()->whereNot('ten_vai_tro', 'member')->get();
        return response()->json([
            'data' => $allRole
        ], 200);
    }

    public function doiMatKhau(Request $request)
    {
        try {
            $validated = $request->validate([
                'password' => 'required',
                'new_password' => 'required',
                'confirm_password' => 'required|same:new_password'
            ]);

            $user = User::query()->findOrFail(Auth::guard('api')->id());

            if (!password_verify($validated['password'], $user->password)) {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Mật khẩu cũ không chính xác.'
                ], 400);
            } else {
                $user->update([
                    'password' => $validated['new_password']
                ]);
                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Đổi mật khẩu thành công.'
                ], 200);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi đổi mật khẩu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
