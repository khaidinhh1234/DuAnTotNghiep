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
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Kiểm tra token reset trong bảng password_reset_tokens
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record || Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Mã thông báo đặt lại không hợp lệ hoặc đã hết hạn.'], 400);
        }

        // Cập nhật mật khẩu người dùng
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        // Xóa token sau khi sử dụng
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        event(new PasswordReset($user));

        return response()->json(['message' => 'Đặt lại mật khẩu thành công.'], 200);
    }
}