<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\LienHe;
use Illuminate\Http\Request;

class LienHeController extends Controller
{
    public function danhSachLienHe()
    {
        try {
            $lienHes = LienHe::with([
                'user:id,ho,ten,email',
            ])->orderBy('created_at', 'desc')->get();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Danh sách liên hệ',
                'data' => $lienHes
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy danh sách đánh giá theo sản phẩm',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
