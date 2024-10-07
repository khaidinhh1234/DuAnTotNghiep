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
                'ten_hang_thanh_vien' => 'Đồng',
                'anh_hang_thanh_vien' => '',
                'chi_tieu_toi_thieu' => 0,
                'chi_tieu_toi_da' => 500000,
                'mo_ta' => 'Rank đồng'
            ]);
        }
        // Tạo người dùng mới
        $user = User::create([
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
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = User::query()->where('email', $request->email)->first();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 200);
        }

        return response()->json([
            'status' => false,
            'status_code' => 401,
            'message' => 'Tài khoản hoặc mật khẩu không chính xác.',
        ], 401);
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
