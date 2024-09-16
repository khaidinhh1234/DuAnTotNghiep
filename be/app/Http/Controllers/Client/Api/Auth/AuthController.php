<?php

namespace App\Http\Controllers\Client\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\VaiTro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    // Đăng ký người dùng mới
    public function register(RegisterRequest $request)
    {
        // Tạo người dùng mới
        $user = User::create($request->all());
        $member = VaiTro::query()->where('ten_vai_tro', 'member')->pluck('id');
        $user->vaiTros()->attach($member);
        // Tạo token cho người dùng
        $token = $user->createToken('auth_token')->plainTextToken;

        // Trả về phản hồi với token
        return response()->json([
            'status' => true,
            'status_code' => 200,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 200);
    }

    // Đăng nhập người dùng
    public function login(LoginRequest $request)
    {
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = User::where('email', $request->email)->first();
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
