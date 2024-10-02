<?php

namespace App\Http\Controllers\Client\Api\Auth;

use App\Events\SendMail;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Tạo token reset
        $token = Str::random(60);
        $user = User::query()->where('email', $request->email)->first();
        $name = implode(" ", [$user->ho, $user->ten]);
        if ($user) {
            // Xóa token cũ và thêm token mới vào bảng password_reset_tokens
            DB::table('password_reset_tokens')->where('email', $user->email)->delete();

            DB::table('password_reset_tokens')->insert([
                'email' => $user->email,
                'token' => $token,
                'created_at' => Carbon::now(),
            ]);

            // Gửi email với link reset
            event(new SendMail($user->email, $name, 'forgot-password'));

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Liên kết quên mật khẩu được gửi đến email của bạn.',
                'data' => $name
            ], 200);
        }
        return response()->json([
            'status' => false,
            'status_code' => 400,
            'message' => 'Email không tồn tại trên hệ thống.'
        ], 400);
    }
}
