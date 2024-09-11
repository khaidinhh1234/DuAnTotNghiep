<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
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
        $email = $request->email;

        // Xóa token cũ và thêm token mới vào bảng password_reset_tokens
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => Carbon::now(),
        ]);

        // Gửi email với link reset
        Mail::send('emails.password-reset', ['token' => $token], function ($message) use ($email) {
            $message->to($email);
            $message->subject('Reset Password Notification');
        });

        return response()->json(['message' => 'Liên kết quên mật khẩu được gửi đến email của bạn.'], 200);
    }
}
