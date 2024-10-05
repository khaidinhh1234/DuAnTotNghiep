<?php

namespace App\Observers;

use App\Models\ChuongTrinhUuDai;
use App\Models\SanPham;
use App\Models\BienTheSanPham;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChuongTrinhUuDaiObserver
{
    public function saved(ChuongTrinhUuDai $uuDai)
    {
        $ngayHienTai = Carbon::now();
        Log::info('Kiểm tra chương trình ưu đãi ID: ' . $uuDai->id);

        if ($uuDai->ngay_bat_dau <= $ngayHienTai && $uuDai->ngay_ket_thuc >= $ngayHienTai) {

            $sanPhams = SanPham::whereHas('chuongTrinhUuDais', function($query) use ($uuDai) {
                $query->where('chuong_trinh_uu_dai_id', $uuDai->id);
            })->with('bienTheSanPham')->get();

            if ($sanPhams->isEmpty()) {
                Log::info('Không có sản phẩm nào liên kết với chương trình ưu đãi ID: ' . $uuDai->id);
                return;
            }

            Log::info('Sản phẩm liên kết: ' . $sanPhams->count());

            foreach ($sanPhams as $sanPham) {
                $bienTheSanPhams = $sanPham->bienTheSanPham;

                foreach ($bienTheSanPhams as $bienTheSanPham) {
                    $originalPrice = $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_ban;

                    if ($originalPrice === null) {
                        Log::warning('Biến thể không có giá: ID ' . $bienTheSanPham->id);
                        continue;
                    }

                    if ($uuDai->loai == 'tien') {
                        $bienTheSanPham->gia_khuyen_mai_tam_thoi = max(0, $originalPrice - $uuDai->gia_tri_uu_dai);
                    } elseif ($uuDai->loai == 'phan_tram') {
                        $discountAmount = ($originalPrice * $uuDai->gia_tri_uu_dai) / 100;
                        $bienTheSanPham->gia_khuyen_mai_tam_thoi = max(0, $originalPrice - $discountAmount);
                    }

                    Log::info('Cập nhật giá khuyến mãi tạm thời cho biến thể ID: ' . $bienTheSanPham->id . ', Giá khuyến mãi tạm thời: ' . $bienTheSanPham->gia_khuyen_mai_tam_thoi);

                    try {
                        $bienTheSanPham->save();
                    } catch (\Exception $e) {
                        Log::error('Lỗi khi lưu biến thể ID: ' . $bienTheSanPham->id . ' - ' . $e->getMessage());
                    }
                }
            }
        } else {
            Log::info('Chương trình ưu đãi không hợp lệ hoặc đã hết hạn.');
        }
    }

    public function deleting(ChuongTrinhUuDai $uuDai)
    {
        $ngayHienTai = Carbon::now();

        if ($uuDai->ngay_ket_thuc < $ngayHienTai) {
            $sanPhams = $uuDai->sanPhams()->get();

            foreach ($sanPhams as $sanPham) {
                $bienTheSanPhams = $sanPham->bienTheSanPham()
                    ->whereNotNull('gia_khuyen_mai_tam_thoi')
                    ->get();

                foreach ($bienTheSanPhams as $bienTheSanPham) {
                    $bienTheSanPham->gia_khuyen_mai_tam_thoi = null;

                    try {
                        $bienTheSanPham->save();
                    } catch (\Exception $e) {
                        Log::error('Lỗi khi lưu lại biến thể ID: ' . $bienTheSanPham->id . ' - ' . $e->getMessage());
                    }
                }
            }
        }
    }

}
