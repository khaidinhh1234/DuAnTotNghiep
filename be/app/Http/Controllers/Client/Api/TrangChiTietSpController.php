<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\SanPham;
use Illuminate\Http\Request;

class TrangChiTietSpController extends Controller {
    public function chiTietSanPham($id) {
        try {
            $chiTietSanPham = SanPham::with([
                'danhMuc',
                'danhGias.user',
                'bienTheSanPham.anhBienThe',
                'bienTheSanPham.mauBienThe',
                'bienTheSanPham.kichThuocBienThe',
                'theSanPham',
            ])->findOrFail($id);
            
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Chi tiết sản phẩm',
                'data' => $chiTietSanPham
            ]);
        } catch (\Exception $exception) {

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy chi tiết sản phẩm',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
