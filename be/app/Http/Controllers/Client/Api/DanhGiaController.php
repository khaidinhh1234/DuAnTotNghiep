<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\AnhDanhGia;
use App\Models\DanhGia;
use App\Models\DonHang;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class DanhGiaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function danhSachDanhGia(SanPham $sanpham)
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



    /**
     * Store a newly created resource in storage.
     */
    public function themMoiDanhGia(Request $request)
    {
        try {
            DB::beginTransaction();

            // Xác thực đầu vào
            $validateDanhGia = $request->validate([
                'san_pham_id' => 'required|exists:san_phams,id',
                'don_hang_id' => 'required|exists:don_hangs,id',
                'so_sao_san_pham' => 'required|integer|min:1|max:5',
                'so_sao_dich_vu_van_chuyen' => 'required|integer|min:1|max:5',
                'chat_luong_san_pham' => 'nullable|string',
                'mo_ta' => 'nullable|string',
                'phan_hoi' => 'nullable|string',
                'huu_ich' => 'nullable|integer|min:0',
                'anh_danh_gia.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Kiểm tra trạng thái đơn hàng
            $donHang = DonHang::where('id', $request->don_hang_id)
                ->where('user_id', Auth::guard('api')->id())
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH) 
                ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                ->first();

            if (!$donHang) {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Đơn hàng không hợp lệ hoặc chưa hoàn tất thanh toán.',
                ], 400);
            }

            // Kiểm tra xem người dùng đã đánh giá sản phẩm này trong đơn hàng chưa
            $existingReview = DanhGia::where('user_id', Auth::guard('api')->id())
                ->where('san_pham_id', $request->san_pham_id)
                ->where('don_hang_id', $request->don_hang_id)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Bạn đã đánh giá sản phẩm này trong đơn hàng này.',
                ], 400);
            }

            $validateDanhGia['user_id'] = Auth::guard('api')->id();

            $danhGia = DanhGia::create($validateDanhGia);

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Đánh giá mới đã được tạo thành công',
                'data' => $danhGia,
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi thêm mới dữ liệu',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
}
