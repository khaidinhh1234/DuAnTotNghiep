<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\AnhDanhGia;
use App\Models\DanhGia;
use App\Models\SanPham;
use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DanhGiaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

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
            $validateDanhGia = $request->validate([
                'user_id' => 'required|exists:users,id',
                'san_pham_id' => 'required|exists:san_phams,id',
                'so_sao_san_pham' => 'required|integer|min:1|max:5',
                'so_sao_dich_vu_van_chuyen' => 'required|integer|min:1|max:5',
                'chat_luong_san_pham' => 'nullable|string',
                'mo_ta' => 'nullable|string',
                'huu_ich' => 'nullable|integer|min:0',
                'anh_danh_gia.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if (!$this->openAIService->filterReview($request->noi_dung) == 'This review contains inappropriate content') {
                $danhGia = DanhGia::create($validateDanhGia);
                $mess = 'Đánh giá mới đã được tạo thành công';
            }

            $mess = 'Đánh giá mới đã được tạo thành công';

            // Nếu có ảnh thì lưu ảnh
            // if ($request->hasFile('anh_danh_gia')) {
            //     foreach ($request->file('anh_danh_gia') as $file) {
            //         $pathFile = $file->store('anh_danh_gia', 'public');
            //         AnhDanhGia::create([
            //             'danh_gia_id' => $danhGia->id,
            //             'anh_danh_gia' => Storage::url($pathFile),
            //         ]);
            //     }
            // }

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => $mess,
                'data' => $danhGia
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
