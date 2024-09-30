<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SanPham;

class CapNhatGiamGiaSoc extends Command
{
    protected $signature = 'sanpham:cap-nhat-giam-gia-soc';
    protected $description = 'Cập nhật trạng thái giảm giá sốc cho sản phẩm khi giá khuyến mãi thấp hơn giá bán 20% hoặc có giá trị ưu đãi.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $sanPhams = SanPham::all();

        foreach ($sanPhams as $sanPham) {
            $giamGiaSoc = false;

            if ($sanPham->gia_khuyen_mai && $sanPham->gia_ban > 0) {
                $phanTramGiamGia = (($sanPham->gia_ban - $sanPham->gia_khuyen_mai) / $sanPham->gia_ban) * 100;

                if ($phanTramGiamGia >= 20) {
                    $giamGiaSoc = true;
                }
            }

            if (!empty($sanPham->gia_tri_uu_dai)) {
                $giamGiaSoc = true;
            }

            if ($giamGiaSoc != $sanPham->giam_gia_soc) {
                $sanPham->giam_gia_soc = $giamGiaSoc;
                $sanPham->save();
            }
        }

        $this->info('Cập nhật trạng thái giảm giá sốc hoàn tất.');
    }
}
