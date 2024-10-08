<?php

namespace App\Http\Controllers\Client\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        // Kiểm tra token reset trong bảng password_reset_tokens
        $record = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->first();

        // Cập nhật mật khẩu người dùng
        $user = User::where('email', $record->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy người dùng.'
            ], 404);
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        // Xóa token sau khi sử dụng
        DB::table('password_reset_tokens')->where('token', $request->token)->delete();

        event(new PasswordReset($user));

        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Đặt lại mật khẩu thành công.'
        ], 200);
    }
    public function checkTokenForgot(Request $request)
    {
        $request->validate([
            'token' => 'required'
        ]);
        $record = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->first();
        if (!$record || Carbon::parse($record->created_at)->addMinutes(5)->isPast()) {
            return response()->json([
                'status' => false,
                'status_code' => 400,
                'message' => 'Mã thông báo đặt lại không hợp lệ hoặc đã hết hạn.'
            ], 400);
        }
        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Mã thông báo đặt lại hợp lệ.'
        ], 200);
    }
}
