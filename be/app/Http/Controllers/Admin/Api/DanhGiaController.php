<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\AnhDanhGia;
use App\Models\DanhGia;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
                'user:id,ho,ten,email',
                'danhGiaBienTheSanPhams',
            ])
                ->orderBy('created_at', 'desc')
                ->get();

            $danhGias->transform(function ($danhGia) {
                $soSaoSanPham = $danhGia->so_sao_san_pham ?? 0;
                $soSaoVanChuyen = $danhGia->so_sao_dich_vu_van_chuyen ?? 0;

                if ($soSaoSanPham > 0 || $soSaoVanChuyen > 0) {
                    $danhGia->tong_so_sao_trung_binh = ($soSaoSanPham + $soSaoVanChuyen) / 2;
                } else {
                    $danhGia->tong_so_sao_trung_binh = 0;
                }

                return $danhGia;
            });

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Danh sách tất cả đánh giá với tổng số sao',
                'danh_gias' => $danhGias,
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

    /**
     * Update the specified resource in storage.
     */

    public function phanHoiDanhGia(Request $request, DanhGia $danhgia)
    {
        try {
            DB::beginTransaction();

            $validateDanhGia = $request->validate([
                'phan_hoi' => 'nullable|string',
            ]);
            $danhgia->update($validateDanhGia);
            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Đánh giá đã được cập nhật thành công',
                'data' => $danhgia,
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi cập nhật đánh giá',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
    public function xoaDanhGia(DanhGia $danhgia)
    {
        try {
            DB::beginTransaction();
            $danhgia->delete();
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Đánh giá đã được xóa thành công.',
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi xóa đánh giá.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
    public function danhSachDanhGiaBiXoa()
    {
        try {
            $danhGiasBiXoa = DanhGia::onlyTrashed()
                ->with([
                    'sanPham:id,ten_san_pham,anh_san_pham',
                    'anhDanhGias:id,anh_danh_gia,danh_gia_id',
                    'user:id,ho,ten,email',
                ])
                ->orderBy('deleted_at', 'desc')
                ->get();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Danh sách đánh giá đã bị xóa',
                'data' => $danhGiasBiXoa,
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy danh sách đánh giá bị xóa.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
    public function khoiPhucDanhGia($id)
    {
        try {
            DB::beginTransaction();
            $danhGia = DanhGia::onlyTrashed()->findOrFail($id);
            $danhGia->restore();
            Db::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Đánh giá đã được khôi phục thành công.',
                'data' => $danhGia,
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi khôi phục đánh giá.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
}
