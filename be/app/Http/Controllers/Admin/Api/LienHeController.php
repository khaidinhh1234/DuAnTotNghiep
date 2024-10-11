<?php

namespace App\Http\Controllers\Admin\Api;

use App\Events\PhanHoiLienHe;
use App\Events\SendMail;
use App\Http\Controllers\Controller;
use App\Models\LienHe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LienHeController extends Controller
{
    public function danhSachLienHe()
    {
        try {
            $lienHes = LienHe::with([
                'user:id,ho,ten,email,anh_nguoi_dung',
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
        $validatedData = $request->validate([
            'noi_dung_phan_hoi' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            $lien_he = LienHe::findOrFail($id);

            $lien_he->update([
                'noi_dung_phan_hoi' => $validatedData['noi_dung_phan_hoi'],
                'trang_thai_lien_he' => 'da_xu_ly',
            ]);

            event(new SendMail($lien_he->email, $lien_he->name, 'Phản hồi từ Admin'));
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Phản hồi liên hệ thành công',
                'data' => $lien_he
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi phản hồi liên hệ',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
