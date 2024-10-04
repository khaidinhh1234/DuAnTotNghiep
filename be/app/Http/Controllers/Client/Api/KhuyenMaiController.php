<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\MaKhuyenMai;
use Illuminate\Http\Request;

class KhuyenMaiController extends Controller
{
    public function danhSachMaKhuyenMaiTheoNguoiDung(Request $request)
    {
        $user = $request->user();
        $data = MaKhuyenMai::query()
            ->join('nguoi_dung_ma_khuyen_mai', 'ma_khuyen_mais.id', '=', 'nguoi_dung_ma_khuyen_mai.ma_khuyen_mai_id')
            ->where('nguoi_dung_ma_khuyen_mai.user_id', $user->id)
            ->select('ma_khuyen_mais.*', 'nguoi_dung_ma_khuyen_mai.da_su_dung', 'nguoi_dung_ma_khuyen_mai.ngay_su_dung')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách mã khuyến mãi',
            'data' => $data
        ]);
    }

    public function danhSachSanPhamChuongTrinhUuDai()
    {

    }

}
