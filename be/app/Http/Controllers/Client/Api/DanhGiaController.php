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
            $validatedData = $request->validate([
                'ma_san_pham_id' => 'required|array',
                'ma_don_hang' => 'required|exists:don_hangs,ma_don_hang',
                'so_sao_san_pham' => 'required|integer|min:1|max:5',
                'so_sao_dich_vu_van_chuyen' => 'required|integer|min:1|max:5',
                'chat_luong_san_pham' => 'nullable|string',
                'mo_ta' => 'nullable|string',
                'phan_hoi' => 'nullable|string',
                'huu_ich' => 'nullable|integer|min:0',
                'anh_danh_gia' => 'nullable|array',
                'anh_danh_gia.*' => 'nullable|string',
            ]);

            // Kiểm tra trạng thái đơn hàng
            $donHang = DonHang::where('ma_don_hang', $validatedData['ma_don_hang'])
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
                ->first();
            // dd($donHang);

            if (!$donHang) {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Đơn hàng không hợp lệ hoặc chưa hoàn tất thanh toán.',
                ], 400);
            }

            $danhGia = DanhGia::create([
                'user_id' => Auth::user()->id,
                'don_hang_id' => $donHang->id,
                'so_sao_san_pham' => $validatedData['so_sao_san_pham'],
                'so_sao_dich_vu_van_chuyen' => $validatedData['so_sao_dich_vu_van_chuyen'],
                'chat_luong_san_pham' => $validatedData['chat_luong_san_pham'],
                'mo_ta' => $validatedData['mo_ta'],

            ]);

            // Thêm ảnh đánh giá
            if (isset($validatedData['anh_danh_gia'])) {
                foreach ($validatedData['anh_danh_gia'] as $anhDanhGia) {;
                    AnhDanhGia::create([
                        'danh_gia_id' => $danhGia->id,
                        'anh_danh_gia' => $anhDanhGia,
                    ]);
                }
            }

            foreach ($validatedData['ma_san_pham_id'] as $maSanPham) {
                $sanPham = SanPham::with('bienTheSanPham')->where('ma_san_pham', $maSanPham)->first();
                // dd($sanPham);
                if (!$sanPham) {
                    return response()->json([
                        'status' => false,
                        'status_code' => 400,
                        'message' => 'Sản phẩm không tồn tại',
                    ], 400);
                } else {
                    $danhGia->danhGiaBienTheSanPhams()->attach($sanPham->bienTheSanPham->pluck('id'), [
                        'san_pham_id' => $sanPham->id
                    ]);
                }
            }
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Đánh giá mới đã được tạo thành công',
                // 'data' => ,
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
