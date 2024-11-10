<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\ThongBao;
use App\Events\ThongBaoMoi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ThongBaoController extends Controller
{
    /**
     */
    public function index()
    {
        try {
            $data = ThongBao::where('user_id', Auth::id())
                ->orderByDesc('id')
                ->get()
                ->toArray();

            $thongBaoChuaDoc = ThongBao::where('user_id', Auth::id())
                ->where('trang_thai_da_doc', 0)
                ->count();

            $json = [
                'data' => $data,
                'thong_bao_chua_doc' => $thongBaoChuaDoc
            ];

            return response()->json($json);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 500);
        }
    }


    /**
     */
    public function daXem($id)
    {
        try {
            $thongBao = ThongBao::where('id', $id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$thongBao) {
                return response()->json([
                    'message' => 'Thông báo không tồn tại hoặc bạn không có quyền truy cập.'
                ], 404);
            }

            $thongBao->trang_thai_da_doc = 1;
            $thongBao->save();

            return response()->json([
                'message' => 'Thông báo đã được đánh dấu là đã xem.',
                'thong_bao' => $thongBao,
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    public function daXemTatCa()
    {
        try {
            $thongBao = ThongBao::where('user_id', Auth::id())
                ->update([
                    'trang_thai_da_doc' => 1
                ]);

            return response()->json([
                'message' => 'Thong bao da doc thanh cong',
                'thong_bao' => $thongBao
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 500);
        }
    }
}
