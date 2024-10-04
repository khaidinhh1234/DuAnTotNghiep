<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\ChuongTrinhUuDai;
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

    public function danhSachSanPhamChuongTrinhUuDai($slug)
    {
        $chuongTrinh = ChuongTrinhUuDai::query()
            ->with(['sanPhams.bienTheSanPham'])
            ->where('duong_dan', $slug)
            ->first();

        if (!$chuongTrinh) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chương trình ưu đãi.'
            ], 404);
        }

        if ($chuongTrinh->sanPhams->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Không có sản phẩm nào trong chương trình ưu đãi.'
            ], 404);
        }

        foreach ($chuongTrinh->sanPhams as $sanPham) {
            if ($sanPham->bienTheSanPham->isEmpty()) {
                continue;
            }

            foreach ($sanPham->bienTheSanPham as $bienThe) {
                if (!is_null($bienThe->gia_khuyen_mai)) {
                    if ($chuongTrinh->loai == 'phan_tram') {
                        $bienThe->gia_khuyen_mai -= ($bienThe->gia_khuyen_mai * $chuongTrinh->gia_tri_uu_dai / 100);
                    } elseif ($chuongTrinh->loai == 'tien') {
                        $bienThe->gia_khuyen_mai = max(0, $bienThe->gia_khuyen_mai - $chuongTrinh->gia_tri_uu_dai);
                    }
                } else {
                    if ($chuongTrinh->loai == 'phan_tram') {
                        $bienThe->gia_khuyen_mai = $bienThe->gia_ban - ($bienThe->gia_ban * $chuongTrinh->gia_tri_uu_dai / 100);
                    } elseif ($chuongTrinh->loai == 'tien') {
                        $bienThe->gia_khuyen_mai = max(0, $bienThe->gia_ban - $chuongTrinh->gia_tri_uu_dai);
                    }
                }
            }
        }

        return response()->json([
            'status' => true,
            'data' => $chuongTrinh
        ]);
    }








}
