<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhGia;
use App\Models\SanPham;
use Illuminate\Http\Request;

class ThongKeDanhGiaController extends Controller
{
    public function danhSachDanhGiaTheoSanPham(SanPham $sanpham)
    {
        try {

            $danhGias = DanhGia::with([
                'sanPham:id,ten_san_pham',
                'anhDanhGias:id,anh_danh_gia,danh_gia_id',
                'user:id,ho,ten,email'
            ])
                ->where('san_pham_id', $sanpham->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Danh sách đánh giá theo sản phẩm',
                'data' => $danhGias
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
