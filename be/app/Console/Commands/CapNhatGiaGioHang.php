<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\GioHang;
use App\Models\BienTheSanPham;

class CapNhatGiaGioHang extends Command
{
    protected $signature = 'giohang:cap-nhat-gia';
    protected $description = 'Cập nhật giá và giá cũ cho sản phẩm trong giỏ hàng';

    public function handle()
    {
        $gioHangs = GioHang::all();

        foreach ($gioHangs as $gioHang) {
            $bienThe = BienTheSanPham::find($gioHang->bien_the_san_pham_id);

            if ($bienThe) {
                $giaMoi = $bienThe->gia_khuyen_mai_tam_thoi ??
                    $bienThe->gia_khuyen_mai ??
                    $bienThe->gia_ban;

                $giaCu =  $bienThe->gia_khuyen_mai ??
                    null;

                $gioHang->gia_cu = $giaCu;
                $gioHang->gia = $giaMoi;
                $gioHang->save();

                $this->info("Cập nhật giá cho sản phẩm ID {$bienThe->id}: Giá mới - {$giaMoi}, Giá cũ - {$giaCu}");
            } else {
                $this->warn("Không tìm thấy biến thể sản phẩm ID {$gioHang->bien_the_san_pham_id}");
            }
        }

        $this->info('Hoàn tất cập nhật giá cho tất cả sản phẩm trong giỏ hàng.');
    }
}
