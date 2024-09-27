<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhGia;
use App\Models\SanPham;
use Illuminate\Http\Request;

class DanhGiaController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function DanhGiaTheoSanPham(SanPham $sanpham)
    {
        try {
            $danhGias = DanhGia::with([
                'sanPham:id,ten_san_pham,anh_san_pham',
                'anhDanhGias:id,anh_danh_gia,danh_gia_id',
                'user:id,ho,ten,email'
            ])
                ->where('san_pham_id', $sanpham->id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($danhGia) {
                    $danhGia->tong_so_sao = ($danhGia->so_sao_san_pham + $danhGia->so_sao_dich_vu_van_chuyen) / 2;
                    return $danhGia;
                });

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

    public function danhSachDanhGiaAll()
    {
        try {
            $danhGias = DanhGia::with([
                'sanPham:id,ten_san_pham,anh_san_pham',
                'anhDanhGias:id,anh_danh_gia,danh_gia_id',
                'user:id,ho,ten,email'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

            $danhGias->transform(function ($danhGia) {
                $danhGia->tong_so_sao_trung_binh = ($danhGia->so_sao_san_pham + $danhGia->so_sao_dich_vu_van_chuyen) / 2;
                return $danhGia;
            });

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Danh sách tất cả đánh giá với tổng số sao',
                'data' => $danhGias
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy danh sách đánh giá',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
