<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\LichSuGiaoDich;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaiKhoanController extends Controller
{
    public function CapNhatThongTin(Request $request)
    {
        $validateData = $request->validate([
            'ho' => 'nullable|string',
            'ten' => 'nullable|string',
            'anh_nguoi_dung' => 'nullable|string',
            'so_dien_thoai' => 'nullable|string',
            'dia_chi' => 'nullable|string',
            'ngay_sinh' => 'nullable|date',
            'gioi_tinh' => 'nullable|in:0,1,2',
        ]);

        $userId = Auth::guard('api')->user()->id;
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        } else {
            $user->update($validateData);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật thông tin thành công',
                'data' => $user,
            ], 200);
        }
    }

    public function viTaiKhoan(){
        try {
            $userID = Auth::id();
            $user = User::find($userID);
            $viUser = $user->viTien;
            $lichSuGiaoDich = $viUser->lichSuGiaoDichs;
            dd($lichSuGiaoDich);
            $data = [
                'viUser' => $viUser,
                'lichSuGiaoDich' => $lichSuGiaoDich,
            ];
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy thông tin ví thành công',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lỗi không xác định',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
