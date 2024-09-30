<?php

namespace App\Observers;

use App\Models\ChuongTrinhUuDai;
use App\Models\SanPham;
use Carbon\Carbon;

class ChuongTrinhUuDaiObserver
{
    public function saved(ChuongTrinhUuDai $uuDai)
    {
        $ngayHienTai = Carbon::now();

        if ($uuDai->ngay_bat_dau <= $ngayHienTai && $uuDai->ngay_ket_thuc >= $ngayHienTai) {
            $sanPhams = SanPham::all();

            foreach ($sanPhams as $sanPham) {
                if ($uuDai->loai == 'tien') {
                    $sanPham->gia_tri_uu_dai = $uuDai->gia_tri_uu_dai;
                }
                elseif ($uuDai->loai == 'phan_tram') {
                    $sanPham->gia_tri_uu_dai = $uuDai->gia_tri_uu_dai;
                }
                $sanPham->save();
            }
        }
    }

    public function deleting(ChuongTrinhUuDai $uuDai)
    {
        $ngayHienTai = Carbon::now();

        if ($uuDai->ngay_ket_thuc < $ngayHienTai) {
            $sanPhams = SanPham::where('gia_tri_uu_dai', $uuDai->gia_tri_uu_dai)->get();

            foreach ($sanPhams as $sanPham) {
                $sanPham->gia_tri_uu_dai = null;
                $sanPham->save();
            }
        }
    }

}
