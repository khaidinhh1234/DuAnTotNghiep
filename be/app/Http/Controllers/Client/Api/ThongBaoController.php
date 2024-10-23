<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\ThongBao;
use App\Events\ThongBaoMoi; // Sử dụng event để phát realtime
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
                ->get();

            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     */
    public function store(Request $request)
    {
        try {
            $thongBao = ThongBao::create([
                'user_id' => $request->user_id,
                'tieu_de' => $request->tieu_de,
                'noi_dung' => $request->noi_dung,
                'loai' => $request->loai,
                'duong_dan' => $request->duong_dan,
            ]);

            broadcast(new ThongBaoMoi($thongBao))->toOthers();

            return response()->json([
                'message' => 'Thông báo được gửi thành công!',
                'thong_bao' => $thongBao
            ]);
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

            $thongBao->da_doc = 1;
            $thongBao->save();

            return response()->json([
                'message' => 'Thông báo đã được đánh dấu là đã xem.',
                'thong_bao' => $thongBao
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 500);
        }
    }
}
