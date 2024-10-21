<?php

namespace App\Http\Controllers\Client\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\HangThanhVien;
use App\Models\User;
use App\Models\VaiTro;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Đăng ký người dùng mới
    public function register(RegisterRequest $request)
    {
        //Lấy ra hạng thành viên thấp nhất
        $hangThanhVien = HangThanhVien::query()->where('chi_tieu_toi_thieu', 0)->first();
        if ($hangThanhVien == []) {
            $hangThanhVien = HangThanhVien::create([
                'ten_hang_thanh_vien' => 'Thành viên mới',
                'anh_hang_thanh_vien' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729310626/game-level-icons-medals-stars-ui-badges-trophy_l6e7b2.png',
                'chi_tieu_toi_thieu' => 0,
                'chi_tieu_toi_da' => 500000,
                'mo_ta' => 'Thành viên mới'
            ]);
        }
        // Tạo người dùng mới
        $user = User::create([
            'ho' => $request->ho,
            'ten' => $request->ten,
            'anh_nguoi_dung' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729485508/Avatar-trang-den_apceuv.png',
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'so_dien_thoai' => $request->so_dien_thoai,
            'dia_chi' => $request->dia_chi,
            'ngay_sinh' => $request->ngay_sinh,
            'gioi_tinh' => $request->gioi_tinh,
            'hang_thanh_vien_id' => $hangThanhVien->id
        ]);
        $member = VaiTro::query()->where('ten_vai_tro', 'Khách hàng')->first();
        if ($member == []) {
            $member = VaiTro::create(
                [
                    'ten_vai_tro' => 'Khách hàng',
                    'mo_ta' => 'Khách hàng'
                ]
            );
        }
        $user->vaiTros()->attach($member->id);

        // Trả về phản hồi với token
        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Đăng ký thành công'
            // 'user' => $user,
        ], 200);
    }

    // Đăng nhập người dùng
    public function login(LoginRequest $request)
    {
        if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'status_code' => 401,
                'message' => 'Tài khoản hoặc mật khẩu không chính xác'
            ], 401);
        }

        $user = User::query()->with('vaiTros')->where('email', $request->email)->first();

        $user->vaiTros->each(function ($role) {
            $role->makeHidden('quyens');
        });

        $token = $user->createToken(name: 'token')->plainTextToken;

        $quyen = $user->vaiTros->flatMap(function ($vaiTro) {
            return $vaiTro->quyens->pluck('ten_quyen');
        })->unique()->values()->all();

        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'user' => $user,
            'quyen' => $quyen
        ], 200);
    }

    // Đăng xuất người dùng
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Đăng xuất thành công'
        ], 200);
    }
}
