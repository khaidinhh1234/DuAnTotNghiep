<?php

namespace App\Http\Controllers\Admin\Api;

use App\Events\PhanHoiLienHe;
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

    public function phanHoi(Request $request, $id)
    {
        try {
            $lien_he = LienHe::find($id);

            if (!$lien_he) {
                return redirect()->back()->with('error', 'Liên hệ không tồn tại.');
            }
            $lien_he->noi_dung_phan_hoi = $request->noi_dung_phan_hoi;
            $lien_he->trang_thai_lien_he = 'da_xu_ly';
            $lien_he->save();

            event(new PhanHoiLienHe($lien_he->email, $lien_he->name, $request->noi_dung_phan_hoi));

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Phản hồi liên hệ thành công',
                'data' => $lien_he
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi phản hồi liên hệ',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
