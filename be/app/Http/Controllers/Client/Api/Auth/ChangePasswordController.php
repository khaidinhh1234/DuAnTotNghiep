<?php

namespace App\Http\Controllers\Client\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Exception;

class ChangePasswordController extends Controller
{
    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            // Lấy thông tin người dùng
            $user = Auth::user();

            // Kiểm tra mật khẩu hiện tại có đúng không
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'error' => 'Mật khẩu hiện tại không đúng.',
                ], 400);
            }

            // Kiểm tra nếu mật khẩu mới trùng với mật khẩu hiện tại
            if (Hash::check($request->new_password, $user->password)) {
                return response()->json([
                    'error' => 'Mật khẩu mới không được trùng với mật khẩu hiện tại.',
                ], 400);
            }

            // Cập nhật mật khẩu mới
            $user->update([
                'password' => Hash::make($request->new_password),
            ]);

            return response()->json(['message' => 'Đổi mật khẩu thành công!'], 200);

        } catch (Exception $e) {
            // Bắt lỗi và trả về phản hồi nếu có lỗi xảy ra
            return response()->json(['error' => 'Đã xảy ra lỗi trong quá trình đổi mật khẩu.'], 500);
        }
    }
}
